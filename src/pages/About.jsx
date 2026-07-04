import { Link } from 'react-router-dom';
import { FiCompass, FiShield, FiHeadphones, FiTrendingUp } from 'react-icons/fi';

const values = [
  {
    icon: FiCompass,
    title: 'Curated journeys',
    description: 'We combine flights, hotels, tours, and transport into smooth travel plans that fit your style.',
  },
  {
    icon: FiShield,
    title: 'Trusted booking',
    description: 'Secure payments, transparent pricing, and reliable support make every booking feel safe.',
  },
  {
    icon: FiHeadphones,
    title: 'Friendly support',
    description: 'Our team is available around the clock to help before, during, and after your trip.',
  },
  {
    icon: FiTrendingUp,
    title: 'Growing network',
    description: 'We work with verified travel agents and partners to bring you more choice and better service.',
  },
];

const About = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4">About TravelHub</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5">We make travel planning simple, trusted, and exciting.</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              TravelHub brings together flights, hotels, buses, car rentals, and curated tours in one easy platform.
              Whether you are planning a quick getaway or a luxury holiday, we help you book with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe travel should feel effortless. That is why we focus on transparent pricing, verified partners, and a seamless booking experience from inspiration to arrival.
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 p-8 bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why travelers choose us</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Best value packages across hotels, flights, and tours</li>
              <li>• Verified agents and partners for reliable service</li>
              <li>• Fast support when plans change</li>
              <li>• A single dashboard for bookings and travel updates</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <item.icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to start your next trip?</h2>
              <p className="text-gray-300">Discover destinations, compare options, and book with confidence.</p>
            </div>
            <Link to="/register" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
