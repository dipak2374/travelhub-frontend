import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheck, FiShield, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { flightAPI, bookingAPI } from '../services';
import { formatPrice } from '../utils/constants';

import TravellerForm from '../components/FlightBooking/TravellerForm';
import SeatMap, { EXTRA_LEGROOM_ROWS } from '../components/FlightBooking/SeatMap';
import AddOns, { ADD_ONS_DATA } from '../components/FlightBooking/AddOns';

const STEPS = ['Travellers', 'Seats', 'Add-Ons', 'Payment'];

const FlightBookingFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Flight details
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const flightClass = searchParams.get('class') || 'economy';

  // Booking state
  const [currentStep, setCurrentStep] = useState(0);
  const [guestDetails, setGuestDetails] = useState(Array(passengers).fill({}));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [addOns, setAddOns] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    flightAPI.getOne(id)
      .then(res => setFlight(res.data.data))
      .catch(err => {
        toast.error('Failed to load flight');
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !flight) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const baseFare = flight.price[flightClass] * passengers;
  const taxes = baseFare * 0.18;
  const convenienceFee = 200;

  // Calculate seat charges
  const seatCharges = selectedSeats.reduce((total, seat) => {
    const row = parseInt(seat);
    return total + (EXTRA_LEGROOM_ROWS.includes(row) ? 400 : 200);
  }, 0);

  // Calculate add-on charges
  const addOnCharges = ADD_ONS_DATA.reduce((total, addon) => {
    return total + (addOns[addon.id] ? addon.price : 0);
  }, 0);

  const totalAmount = baseFare + taxes + convenienceFee + seatCharges + addOnCharges;

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate travellers
      for (let i = 0; i < passengers; i++) {
        if (!guestDetails[i]?.name || !guestDetails[i]?.age) {
          return toast.error('Please fill all traveller details');
        }
      }
      if (!guestDetails[0]?.email || !guestDetails[0]?.phone) {
        return toast.error('Please provide contact details for Traveller 1');
      }
    }
    
    if (currentStep === 1) {
      if (selectedSeats.length < passengers) {
        return toast.error(`Please select ${passengers} seat(s)`);
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
      window.scrollTo(0, 0);
    } else {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create booking
      const bookingData = {
        bookingType: 'flight',
        itemId: flight._id,
        passengers,
        flightClass,
        guestDetails,
        seatNumbers: selectedSeats,
        seatCharges,
        addOnCharges,
      };

      const bookingRes = await bookingAPI.create(bookingData);
      const booking = bookingRes.data.data;

      // 2. Create Razorpay order
      const orderRes = await bookingAPI.createPayment({
        bookingId: booking._id,
        method: 'razorpay'
      });

      const { order, key } = orderRes.data;

      // 3. Open Razorpay
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'TravelHub',
        description: `Flight Booking: ${flight.flightNumber}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await bookingAPI.verifyPayment({
              ...response,
              bookingId: booking._id,
              method: 'razorpay'
            });
            toast.success('Payment successful! Booking confirmed.');
            navigate('/profile');
          } catch (err) {
            toast.error('Payment verification failed');
            navigate('/profile');
          }
        },
        prefill: {
          name: guestDetails[0].name,
          email: guestDetails[0].email,
          contact: guestDetails[0].phone
        },
        theme: { color: '#4f46e5' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed or cancelled');
        navigate('/profile');
      });
      rzp.open();

    } catch (err) {
      toast.error('Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10"></div>
            <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-primary-600 transition-all duration-300 -z-10" style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 2rem)` }}></div>
            
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isPast ? 'bg-primary-600 text-white' : isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-200 text-gray-500'}`}>
                    {isPast ? <FiCheck /> : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${isCurrent || isPast ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* Flight Summary Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold text-xl shrink-0">
                  {flight.airline.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{flight.airline}</h2>
                  <p className="text-sm text-gray-500">{flight.flightNumber} • Airbus A320</p>
                </div>
              </div>
              <div className="flex flex-1 w-full md:w-auto items-center justify-between md:justify-end md:gap-8">
                <div className="text-center md:text-right">
                  <p className="text-xl font-bold text-gray-900">{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-sm font-medium text-gray-500">{flight.origin.code}</p>
                </div>
                <div className="flex flex-col items-center w-24 md:w-32 relative mx-4">
                  <span className="text-xs text-gray-400 mb-1">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</span>
                  <div className="w-full h-px bg-gray-300"></div>
                  <span className="text-xs text-gray-400 mt-1">Non-stop</span>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xl font-bold text-gray-900">{new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-sm font-medium text-gray-500">{flight.destination.code}</p>
                </div>
              </div>
            </div>

            {currentStep === 0 && (
              <TravellerForm passengers={passengers} guestDetails={guestDetails} onChange={setGuestDetails} />
            )}

            {currentStep === 1 && (
              <SeatMap passengers={passengers} selectedSeats={selectedSeats} onSeatSelect={setSelectedSeats} />
            )}

            {currentStep === 2 && (
              <AddOns addOns={addOns} onAddOnChange={setAddOns} />
            )}

            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Review & Payment</h3>
                <div className="space-y-4">
                  <p className="text-gray-600">Please review your trip summary on the right before proceeding to secure payment.</p>
                  <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100">
                    <FiLock size={20} />
                    <span>Your transaction is secured with 256-bit bank-level encryption.</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar - Price Details */}
          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gray-900 p-6 text-white">
                <h3 className="text-lg font-bold mb-1">Price Details</h3>
                <p className="text-gray-400 text-sm">{passengers} Adult(s) • <span className="capitalize">{flightClass}</span></p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-semibold">{formatPrice(baseFare)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold">{formatPrice(taxes)}</span>
                </div>
                {seatCharges > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seat Charges</span>
                    <span className="font-semibold">{formatPrice(seatCharges)}</span>
                  </div>
                )}
                {addOnCharges > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-Ons</span>
                    <span className="font-semibold">{formatPrice(addOnCharges)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Convenience Fee</span>
                  <span className="font-semibold">{formatPrice(convenienceFee)}</span>
                </div>
                
                <hr className="border-gray-100" />
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-sm text-gray-500 font-medium mb-1">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(totalAmount)}</span>
                  </div>
                  <button 
                    onClick={handleNext}
                    disabled={isProcessing}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : currentStep === STEPS.length - 1 ? 'Pay Now' : 'Continue'}
                  </button>
                </div>
                {currentStep > 0 && (
                  <button 
                    onClick={() => setCurrentStep(c => c - 1)}
                    disabled={isProcessing}
                    className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-900 mt-2"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl border border-green-100 p-5 flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <FiShield size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Free Cancellation</h4>
                <p className="text-sm text-green-600/80 mt-1">Cancel before 24 hours of departure to get a full refund.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBookingFlow;
