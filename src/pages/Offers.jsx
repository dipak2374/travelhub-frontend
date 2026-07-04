import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTag, FiTrendingUp, FiStar } from 'react-icons/fi';
import { formatPrice } from '../utils/constants';
import { couponAPI } from '../services';

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

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await couponAPI.getAll();
        const offersData = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        if (!Array.isArray(res.data?.data) && !Array.isArray(res.data)) {
          console.warn('Offers response is not an array:', res.data);
        }

        setOffers(offersData);
      } catch (err) {
        console.error('Failed to load offers', err);
        setError('Unable to load offers at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
  <div className="bg-white dark:bg-gray-950 min-h-screen">
    <section className="pt-24 pb-16 bg-gradient-to-br from-primary-600 to-sky-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4">Special promotions</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">Discover curated travel offers.</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Save on select hotel stays, flight bundles, and tours. These limited-time offers make it easier to book your next getaway.
          </p>
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            Loading offers...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {error}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            No offers available right now. Check back later.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {offers.map((offer) => (
              <div key={offer._id} className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{offer.applicableTypes?.join(', ') || 'All services'}</p>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{offer.code}</h2>
                    </div>
                    <div className="rounded-full bg-primary-50 px-3 py-2 text-primary-700 text-sm font-semibold">
                      {offer.discountType === 'percentage'
                        ? `${offer.discountValue}% off`
                        : `Save ${formatPrice(offer.discountValue || 0, 'INR', 'INR')}`}
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{offer.description || 'Apply this coupon at checkout for instant savings.'}</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      Minimum spend: {formatPrice(offer.minOrderAmount || 0, 'INR', 'INR')}
                    </div>
                    <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <FiStar />
                      <span className="text-sm font-medium">Top deal</span>
                    </div>
                    <Link to={getOfferRoute(offer.applicableTypes)} className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                      View deal
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Want more personalized offers?</h2>
            <p className="text-gray-300">Visit our homepage to search for destinations, flights, hotels, and tours all in one place.</p>
          </div>
          <Link to="/" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  </div>
);
};

export default Offers;
