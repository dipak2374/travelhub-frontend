import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { bookingAPI } from '../services';
import { formatPrice } from '../utils/constants';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!state?.item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">No booking details found</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const { bookingType, item, checkIn, checkOut, travelDate, passengers, flightClass, couponCode } = state;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (bookingData, orderData) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load Razorpay. Please check your internet connection.');
      setLoading(false);
      return;
    }

    const options = {
      key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: orderData.order.currency || 'INR',
      name: 'TravelHub',
      description: `Booking: ${item.name || item.title || item.flightNumber || 'Travel Booking'}`,
      order_id: orderData.order.id,
      prefill: {
        name: guestDetails.name,
        email: guestDetails.email,
        contact: guestDetails.phone,
      },
      theme: {
        color: '#6366f1',
      },
      handler: async function (response) {
        try {
          await bookingAPI.verifyPayment({
            bookingId: bookingData.data._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            method: 'razorpay',
          });
          console.log('Payment verified, navigating to bookings');
          toast.success('Payment successful! Booking confirmed.');
          navigate('/bookings');
        } catch (err) {
          console.error('Payment verification failed', err);
          toast.error(err.response?.data?.message || 'Payment verification failed');
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          toast.error('Payment cancelled');
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      toast.error(`Payment failed: ${response.error.description}`);
      setLoading(false);
    });

    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!guestDetails.name || !nameRegex.test(guestDetails.name.trim())) {
      return toast.error('Please enter a valid full name (letters only, min 2 characters)');
    }
    if (!guestDetails.email || !emailRegex.test(guestDetails.email.trim())) {
      return toast.error('Please enter a valid email address');
    }
    if (!guestDetails.phone || guestDetails.phone.replace(/[\s+-]/g, '').length < 10) {
      return toast.error('Please enter a valid phone number (at least 10 digits)');
    }

    setLoading(true);
    try {
      // Step 1: Create booking
      const { data: bookingData } = await bookingAPI.create({
        bookingType,
        itemId: item._id,
        checkIn,
        checkOut,
        travelDate,
        passengers,
        flightClass,
        couponCode,
        guestDetails: [guestDetails],
      });

      // Step 2: Create payment order
      const { data: paymentData } = await bookingAPI.createPayment({
        bookingId: bookingData.data._id,
        method: 'razorpay',
      });

      // Step 3: Open Razorpay checkout
      await handleRazorpayPayment(bookingData, paymentData);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">Complete Your Booking</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Booking Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="capitalize">{bookingType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Item</span><span>{item.name || item.title || item.flightNumber}</span></div>
            {passengers && <div className="flex justify-between"><span className="text-gray-500">Passengers</span><span>{passengers}</span></div>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Guest Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" required className="input-field" value={guestDetails.name}
              onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })} />
            <input type="email" placeholder="Email" required className="input-field" value={guestDetails.email}
              onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })} />
            <input type="tel" placeholder="Phone" required className="input-field sm:col-span-2" value={guestDetails.phone}
              onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 p-3 border-2 border-primary-500 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <div>
              <p className="font-semibold text-sm">Razorpay</p>
              <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-3">
          {loading ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
