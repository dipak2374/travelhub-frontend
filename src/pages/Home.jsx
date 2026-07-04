import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiClock, FiHeadphones, FiLock, FiUsers, FiStar } from 'react-icons/fi';
import { hotelAPI, flightAPI, busAPI, carAPI, tourAPI, couponAPI } from '../services';
import { formatPrice } from '../utils/constants';
import SearchWidget from '../components/SearchWidget';

const trustIndicators = [
  { icon: FiCheckCircle, title: 'Best Price', subtitle: 'Guarantee' },
  { icon: FiClock, title: 'Easy Booking', subtitle: 'In 2 mins' },
  { icon: FiHeadphones, title: '24/7 Support', subtitle: 'We\'re here' },
  { icon: FiLock, title: 'Secure Payment', subtitle: '100% safe' },
  { icon: FiUsers, title: 'Trusted by Millions', subtitle: 'Happy travelers' },
];


const testimonials = [
  { name: 'Sarah Chen', role: 'Solo traveler', quote: 'Everything from booking to support felt effortless. I booked my Bali trip in minutes.' },
  { name: 'Daniel Brooks', role: 'Family vacation', quote: 'Great value, smooth payments, and very responsive support. Highly recommended.' },
  { name: 'Mina Patel', role: 'Business traveler', quote: 'The hotel and flight combo saved me both time and money. A very reliable platform.' },
];

const getOfferRoute = (applicableTypes = []) => {
  if (!applicableTypes?.length || applicableTypes.includes('all')) return '/offers';
  const routeMap = {
    hotel: '/hotels',
    flight: '/flights',
    bus: '/buses',
    car: '/cars',
    tour: '/tours',
  };
  return routeMap[applicableTypes[0]] || '/offers';
};

const mapCouponToOffer = (coupon) => {
  const savings = coupon.discountType === 'percentage'
    ? `${coupon.discountValue}% off`
    : `Save ${formatPrice(coupon.discountValue, 'INR', 'INR')}`;

  return {
    id: coupon._id,
    title: coupon.code,
    description: coupon.description || (coupon.discountType === 'percentage'
      ? `${coupon.discountValue}% off on a qualifying booking`
      : `Save ${formatPrice(coupon.discountValue, 'INR', 'INR')} on your next booking`),
    price: coupon.minOrderAmount || 0,
    savings,
    route: getOfferRoute(coupon.applicableTypes),
    couponCode: coupon.code,
  };
};

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [topHotels, setTopHotels] = useState([]);
  const [topFlights, setTopFlights] = useState([]);
  const [topBuses, setTopBuses] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [topOffers, setTopOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setNewsletterStatus({ type: 'success', message: 'Thanks! We will keep you updated with the latest deals.' });
    setNewsletterEmail('');
  };

  useEffect(() => {
    const fetchTopListings = async () => {
      try {
        const [hotelRes, flightRes, busRes, carRes, tourRes] = await Promise.all([
          hotelAPI.getAll({ limit: 3, sort: '-bookings' }),
          flightAPI.getAll({ limit: 2, sort: '-bookings' }),
          busAPI.getAll({ limit: 2, sort: '-bookings' }),
          carAPI.getAll({ limit: 2, sort: '-bookings' }),
          tourAPI.getAll({ limit: 2, sort: '-bookings' }),
        ]);

        setTopHotels(hotelRes.data?.data || hotelRes.data?.hotels || []);
        setTopFlights(flightRes.data?.data || flightRes.data?.flights || []);
        setTopBuses(busRes.data?.data || busRes.data?.buses || []);
        setTopCars(carRes.data?.data || carRes.data?.cars || []);
        setTopTours(tourRes.data?.data || tourRes.data?.tours || []);
      } catch (err) {
        console.error('Failed to load top listings', err);
      } finally {
        setLoadingListings(false);
      }
    };

    const fetchTopOffers = async () => {
      try {
        const couponRes = await couponAPI.getAll();
        const coupons = Array.isArray(couponRes.data?.data)
          ? couponRes.data.data
          : Array.isArray(couponRes.data)
            ? couponRes.data
            : [];

        if (!Array.isArray(couponRes.data?.data) && !Array.isArray(couponRes.data)) {
          console.warn('Top offers response is not an array:', couponRes.data);
        }

        setTopOffers(coupons.map(mapCouponToOffer));
      } catch (err) {
        console.error('Failed to load top offers', err);
      } finally {
        setOffersLoading(false);
      }
    };

    fetchTopListings();
    fetchTopOffers();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-40 flex items-center min-h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')", backgroundPosition: "center 20%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur mb-6">
              Trusted by travelers worldwide
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
              Turn every trip into <br />
              <span className="text-primary-300">a smoother journey</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl font-medium mb-8">
              Book flights, hotels, buses, cars, and curated tours in one place at the best value.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/hotels" className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-600 transition-colors">
                Book Now <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/partner-onboarding" className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
                Become a Partner
              </Link>
              <Link to="/tours" className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 font-semibold text-white hover:bg-white/20 transition-colors">
                Explore Tours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget - Pulled up to overlap hero */}
      <section className="relative z-20 -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchWidget />
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-6">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-primary-100 flex items-center justify-center text-primary-600 bg-primary-50">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Landing */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4">Partner with TravelHub</p>
              <h2 className="text-4xl font-bold mb-4">List your services and start earning with a verified partner dashboard.</h2>
              <p className="max-w-2xl text-white/80 mb-8">
                Join our travel partner network and manage hotel, car, bus, or airline listings from one platform. Grow bookings with seamless onboarding and trusted support.
              </p>
              <Link to="/partner-onboarding" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-gray-100 transition-colors">
                Start partner onboarding
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">Verified network</p>
                <p className="text-white/90">Reach more customers through our high-traffic marketplace and secure booking tools.</p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">Fast onboarding</p>
                <p className="text-white/90">Register with your business details and get access to the partner dashboard quickly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Hotels, Cars, Flights, Buses, Tours) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Services</h2>
            <Link to="/listings" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">Browse categories</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link to="/hotels" className="group block rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all p-4 text-center">
              <img src={topHotels[0]?.images?.[0] || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'} alt={topHotels[0]?.name || 'Hotels'} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Hotels</h3>
              {loadingListings ? (
                <p className="text-sm text-gray-500">Loading top hotels...</p>
              ) : topHotels[0] ? (
                <p className="text-sm text-gray-500 truncate">{topHotels[0].name} • {topHotels[0].location?.city}</p>
              ) : (
                <p className="text-sm text-gray-500">Comfortable stays across destinations</p>
              )}
            </Link>

            <Link to="/cars" className="group block rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all p-4 text-center">
              <img src={topCars[0]?.images?.[0] || 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80'} alt={topCars[0] ? `${topCars[0].make} ${topCars[0].model}` : 'Car rentals'} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Car Rentals</h3>
              {loadingListings ? (
                <p className="text-sm text-gray-500">Loading top cars...</p>
              ) : topCars[0] ? (
                <p className="text-sm text-gray-500 truncate">{topCars[0].make} {topCars[0].model} • {formatPrice(topCars[0].pricePerDay, 'INR', 'INR')}</p>
              ) : (
                <p className="text-sm text-gray-500">Self-drive and chauffeur options</p>
              )}
            </Link>

            <Link to="/flights" className="group block rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all p-4 text-center">
              <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80" alt="Flights" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Flights</h3>
              {loadingListings ? (
                <p className="text-sm text-gray-500">Loading top flights...</p>
              ) : topFlights[0] ? (
                <p className="text-sm text-gray-500 truncate">{topFlights[0].origin?.code} → {topFlights[0].destination?.code} • {formatPrice(topFlights[0].price?.economy || 0, 'INR', 'INR')}</p>
              ) : (
                <p className="text-sm text-gray-500">Search and book best airfares</p>
              )}
            </Link>

            <Link to="/buses" className="group block rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all p-4 text-center">
              <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800" alt="Buses" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Buses</h3>
              {loadingListings ? (
                <p className="text-sm text-gray-500">Loading top buses...</p>
              ) : topBuses[0] ? (
                <p className="text-sm text-gray-500 truncate">{topBuses[0].operator} • {formatPrice(topBuses[0].price, 'INR', 'INR')}</p>
              ) : (
                <p className="text-sm text-gray-500">Intercity and private coach options</p>
              )}
            </Link>

            <Link to="/tours" className="group block rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all p-4 text-center">
              <img src={topTours[0]?.images?.[0] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800'} alt={topTours[0]?.title || 'Tours'} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Tours</h3>
              {loadingListings ? (
                <p className="text-sm text-gray-500">Loading top tours...</p>
              ) : topTours[0] ? (
                <p className="text-sm text-gray-500 truncate">{topTours[0].title} • {formatPrice(topTours[0].price, 'INR', 'INR')}</p>
              ) : (
                <p className="text-sm text-gray-500">Curated local experiences and packages</p>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-2">Trending now</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Best-selling travel picks</h2>
            </div>
            <Link to="/listings" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">Explore all listings</Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {[
              {
                label: 'Hotel',
                item: topHotels[0],
                route: '/hotels',
                subtitle: topHotels[0]?.location?.city,
                price: topHotels[0]?.pricePerNight ? `${formatPrice(topHotels[0].pricePerNight, 'INR', 'INR')}/night` : null,
                image: topHotels[0]?.images?.[0],
              },
              {
                label: 'Flight',
                item: topFlights[0],
                route: '/flights',
                subtitle: topFlights[0] ? `${topFlights[0].origin?.code} → ${topFlights[0].destination?.code}` : null,
                price: topFlights[0]?.price?.economy ? formatPrice(topFlights[0].price.economy, 'INR', 'INR') : null,
                image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
              },
              {
                label: 'Car',
                item: topCars[0],
                route: '/cars',
                subtitle: topCars[0] ? `${topCars[0].make} ${topCars[0].model}` : null,
                price: topCars[0]?.pricePerDay ? `${formatPrice(topCars[0].pricePerDay, 'INR', 'INR')}/day` : null,
                image: topCars[0]?.images?.[0],
              },
              {
                label: 'Tour',
                item: topTours[0],
                route: '/tours',
                subtitle: topTours[0]?.title,
                price: topTours[0]?.price ? formatPrice(topTours[0].price, 'INR', 'INR') : null,
                image: topTours[0]?.images?.[0],
              },
            ].map((card, index) => (
              <Link key={index} to={card.route} className="group block rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={card.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900'}
                    alt={card.subtitle || card.label}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300 mb-2">{card.label}</p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{card.subtitle || `Top ${card.label}`}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{card.price || 'Popular choice'}</p>
                  <div className="inline-flex items-center rounded-full bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700">View {card.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Offers */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Offers</h2>
            <Link to="/offers" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View all offers</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offersLoading ? (
              <div className="col-span-full rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                Loading offers...
              </div>
            ) : topOffers.length > 0 ? (
              topOffers.map((offer) => (
                <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{offer.description}</p>
                        <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">{offer.title}</h3>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">{offer.savings}</span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-1">Starting at</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {offer.price > 0 ? formatPrice(offer.price, 'INR', 'INR') : 'Best price'}
                        </p>
                      </div>
                      <Link to={offer.route} className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                        Book now <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                No offers available right now. Check back later.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Loved by travelers everywhere</h2>
            <p className="text-gray-600 dark:text-gray-400">Real experiences from people who booked with TravelHub.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <div key={index} className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <div className="flex items-center gap-1 text-primary-500 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">“{item.quote}”</p>
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background plane image hint */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800" alt="" className="w-full h-full object-cover mix-blend-overlay" />
            </div>
            
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-3">Get Exclusive Travel Deals</h2>
              <p className="text-white/80 mb-6">Subscribe to our newsletter and get the best offers straight to your inbox.</p>
              <div className="flex flex-col gap-2">
                <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleNewsletterSubmit}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                    required
                  />
                  <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                    Subscribe
                  </button>
                </form>
                {newsletterStatus && (
                  <p className={`mt-4 text-sm ${newsletterStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                    {newsletterStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
