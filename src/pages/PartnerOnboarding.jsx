import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiUsers, FiTrendingUp } from 'react-icons/fi';

const benefits = [
  {
    icon: FiCheckCircle,
    title: 'Grow your revenue',
    description: 'List your inventory, reach more travelers, and increase bookings through a single platform.',
  },
  {
    icon: FiShield,
    title: 'Trusted partner network',
    description: 'Join a verified agent and partner ecosystem with trusted customer support and secure payments.',
  },
  {
    icon: FiUsers,
    title: 'Manage in one place',
    description: 'Use your partner dashboard to manage listings, bookings, and earnings from day one.',
  },
  {
    icon: FiTrendingUp,
    title: 'Launch faster',
    description: 'Onboard quickly with clear steps, dedicated resources, and support for your travel business.',
  },
];

const partnerRoles = [
  { role: 'travel_agency', label: 'Travel Agency' },
  { role: 'car_rental_partner', label: 'Car Rental Partner' },
  { role: 'bus_operator', label: 'Bus Operator' },
  { role: 'airline_partner', label: 'Airline Partner' },
];

const PartnerOnboarding = () => (
  <div className="bg-white dark:bg-gray-950 min-h-screen">
    <section className="pt-24 pb-16 bg-gradient-to-br from-primary-600 to-sky-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4">Partner with TravelHub</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">Grow your travel business with the right platform.</h1>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Become a verified partner and let customers book your hotels, cars, buses, or flights with confidence.
          </p>
          <Link
            to="/register?role=travel_agency"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-gray-100 transition-colors"
          >
            Start onboarding
          </Link>
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item, index) => (
            <div key={index} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-5">
                <item.icon size={22} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">Choose your partner role</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {partnerRoles.map((item) => (
              <Link
                key={item.role}
                to={`/register?role=${item.role}`}
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 transition hover:border-primary-400 hover:bg-white/10"
              >
                <p className="text-lg font-semibold text-white mb-1">{item.label}</p>
                <p className="text-sm text-gray-300">Register as a verified partner and access the TravelHub partner dashboard.</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default PartnerOnboarding;
