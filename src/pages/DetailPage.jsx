import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiHeart, FiMapPin, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import GoogleMapPlaceholder from '../components/GoogleMapPlaceholder';
import { formatPrice, formatDate, PLACEHOLDER_IMAGE } from '../utils/constants';
import { reviewAPI, wishlistAPI } from '../services';

const createDetailPage = (api, type, bookingType, itemModel) => {
  const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState({
      checkIn: '', checkOut: '', travelDate: '', passengers: 1, flightClass: 'economy', couponCode: '',
    });

    useEffect(() => {
      Promise.all([
        api.getOne(id).then((r) => {
          const itemData = r.data.data;
          setItem(itemData);
          setSelectedImage(itemData.images?.[0] || PLACEHOLDER_IMAGE);
        }),
        reviewAPI.get(itemModel, id).then((r) => setReviews(r.data.data)).catch(() => {}),
      ]).finally(() => setLoading(false));
    }, [id]);

    const handleWishlist = async () => {
      try {
        await wishlistAPI.toggle(id, itemModel);
        toast.success('Wishlist updated');
      } catch {
        toast.error('Please login to save to wishlist');
        navigate('/login');
      }
    };

    const handleBook = () => {
      if (type === 'hotel' || type === 'car') {
        if (!booking.checkIn) return toast.error('Please select a Check In date');
        if (!booking.checkOut) return toast.error('Please select a Check Out date');
        const checkInDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
          return toast.error('Check In date cannot be in the past');
        }
        if (checkOutDate <= checkInDate) {
          return toast.error('Check Out date must be after Check In date');
        }
      } else {
        if (!booking.travelDate) return toast.error('Please select a Travel Date');
        const travelDate = new Date(booking.travelDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (travelDate < today) {
          return toast.error('Travel date cannot be in the past');
        }
      }
      
      if (!booking.passengers || booking.passengers < 1) {
        return toast.error(`Please enter a valid number of ${type === 'tour' ? 'travelers' : 'passengers'}`);
      }

      if (type === 'flight') {
        navigate(`/flights/${item._id}/book?passengers=${booking.passengers}&class=${booking.flightClass}`);
      } else {
        navigate('/checkout', {
          state: {
            bookingType,
            item,
            ...booking,
          },
        });
      }
    };

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;
    if (!item) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Not found</div>;

    const galleryImages = item.images?.length ? item.images : [PLACEHOLDER_IMAGE];
    const image = selectedImage || galleryImages[0];
    const title = type === 'hotel' ? item.name : type === 'tour' ? item.title : type === 'car' ? `${item.make} ${item.model}` : type === 'flight' ? `${item.origin?.code} → ${item.destination?.code}` : item.busNumber;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img src={image} alt={title} className="w-full h-full object-cover" />
              <button onClick={handleWishlist} className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white">
                <FiHeart className="text-red-500" />
              </button>
            </div>

            {type === 'hotel' && galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((galleryImage, index) => {
                  const isSelected = galleryImage === image;
                  return (
                    <button
                      key={`${galleryImage}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(galleryImage)}
                      className={`h-20 w-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-primary-600 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100 hover:border-gray-200'
                      }`}
                      aria-label={`Show hotel image ${index + 1}`}
                    >
                      <img src={galleryImage} alt={`${title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}

            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold">{title}</h1>
                  {item.location && (
                    <p className="flex items-center gap-1 text-gray-500 mt-2">
                      <FiMapPin size={16} /> {item.location.city || item.destination}, {item.location.country || ''}
                    </p>
                  )}
                </div>
                {item.averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg">
                    <FiStar className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{item.averageRating}</span>
                    <span className="text-sm text-gray-500">({item.reviewCount})</span>
                  </div>
                )}
              </div>
              {item.amenities?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.amenities.slice(0, 5).map((amenity) => (
                    <span
                      key={amenity}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${amenity === 'Bar & Lounge' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}
                    >
                      {amenity}
                    </span>
                  ))}
                  {item.amenities.length > 5 && (
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      +{item.amenities.length - 5} more
                    </span>
                  )}
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">{item.description}</p>
              <button
                onClick={() => navigate(`/reviews?itemModel=${itemModel}&itemId=${item._id}&name=${encodeURIComponent(title)}`)}
                className="btn-outline mt-5"
              >
                Write a Review
              </button>
            </div>

            {(item.amenities || item.features || item.inclusions) && (
              <div className="card p-6">
                <h3 className="font-semibold mb-3">{item.inclusions ? 'Inclusions' : 'Amenities'}</h3>
                <div className="flex flex-wrap gap-2">
                  {(item.amenities || item.features || item.inclusions || []).map((a) => (
                    <span key={a} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {item.location && (
              <div>
                <h3 className="font-semibold mb-3">Location</h3>
                <GoogleMapPlaceholder location={item.location} height="250px" />
              </div>
            )}

            {reviews.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Reviews ({reviews.length})</h3>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r._id} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{r.user?.name}</span>
                        <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card p-6 sticky top-24">
              <div className="text-2xl font-bold text-primary-600 mb-6">
                {type === 'hotel' && formatPrice(item.pricePerNight) + '/night'}
                {type === 'flight' && formatPrice(item.price?.economy) + ' (Economy)'}
                {type === 'car' && formatPrice(item.pricePerDay) + '/day'}
                {type === 'bus' && formatPrice(item.price)}
                {type === 'tour' && formatPrice(item.price) + '/person'}
              </div>

              <div className="space-y-4">
                {(type === 'hotel' || type === 'car') && (
                  <>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1 mb-1"><FiCalendar size={14} /> Check In</label>
                      <input type="date" className="input-field" value={booking.checkIn}
                        onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1 mb-1"><FiCalendar size={14} /> Check Out</label>
                      <input type="date" className="input-field" value={booking.checkOut}
                        onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })} />
                    </div>
                  </>
                )}
                {(type === 'flight' || type === 'bus' || type === 'tour') && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Travel Date</label>
                    <input type="date" className="input-field" value={booking.travelDate}
                      onChange={(e) => setBooking({ ...booking, travelDate: e.target.value })} />
                  </div>
                )}
                {type === 'flight' && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Class</label>
                    <select className="input-field" value={booking.flightClass}
                      onChange={(e) => setBooking({ ...booking, flightClass: e.target.value })}>
                      <option value="economy">Economy - {formatPrice(item.price?.economy)}</option>
                      <option value="business">Business - {formatPrice(item.price?.business)}</option>
                      <option value="firstClass">First Class - {formatPrice(item.price?.firstClass)}</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium mb-1 block">{type === 'tour' ? 'Travelers' : 'Passengers'}</label>
                  <input type="number" min={1} className="input-field" value={booking.passengers}
                    onChange={(e) => setBooking({ ...booking, passengers: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Coupon Code</label>
                  <input type="text" placeholder="e.g. WELCOME20" className="input-field" value={booking.couponCode}
                    onChange={(e) => setBooking({ ...booking, couponCode: e.target.value })} />
                </div>
              </div>

              <button onClick={handleBook} className="btn-primary w-full mt-6">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return DetailPage;
};

export default createDetailPage;
