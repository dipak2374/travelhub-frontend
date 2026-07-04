import { Link } from 'react-router-dom';
import { FiMapPin, FiArrowRight, FiStar } from 'react-icons/fi';
import { formatPrice } from '../utils/constants';

const destinations = [
  { name: 'Paris, France', subtitle: 'Romantic city escapes', price: 399, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900' },
  { name: 'Dubai, UAE', subtitle: 'Luxury adventures', price: 299, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900' },
  { name: 'Bali, Indonesia', subtitle: 'Tropical island retreats', price: 499, image: 'https://images.unsplash.com/photo-1507525428034-b723cf9613e?w=900' },
  { name: 'Maldives', subtitle: 'Water villa luxury', price: 599, image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=900' },
  { name: 'Singapore', subtitle: 'City culture & cuisine', price: 349, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900' },
  { name: 'Tokyo, Japan', subtitle: 'Modern city & tradition', price: 429, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900' },
];

const Destinations = () => (
  <div className="bg-white dark:bg-gray-950 min-h-screen">
    <section className="pt-24 pb-16 bg-gradient-to-br from-primary-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4">Explore destinations</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">Discover top travel destinations.</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Browse curated city breaks, beach escapes, and adventure hotspots — then find the best hotels, flights, and packages for your trip.
          </p>
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {destinations.map((destination, index) => (
            <div key={index} className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/80">{destination.subtitle}</p>
                  <h2 className="text-2xl font-bold">{destination.name}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Starting from</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatPrice(destination.price, 'INR', 'INR')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary-600">
                    <FiStar />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
                <Link
                  to="/hotels"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  View hotels <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Not sure where to start?</h2>
            <p className="text-gray-300">Check our latest offers and save on flights, hotels, and tours today.</p>
          </div>
          <Link to="/offers" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
            Browse offers
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Destinations;
