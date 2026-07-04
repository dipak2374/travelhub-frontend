import { Link } from 'react-router-dom';
import { FiGlobe, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/images/footer.png" 
              alt="TravelHub Logo" 
              className="h-22 w-22 object-contain"
            />
          </Link>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Plan, Book, and Travel – All in One Place. Your trusted partner for unforgettable journeys.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hotels" className="hover:text-primary-400 transition-colors">Hotels</Link></li>
            <li><Link to="/flights" className="hover:text-primary-400 transition-colors">Flights</Link></li>
            <li><Link to="/buses" className="hover:text-primary-400 transition-colors">Buses</Link></li>
            <li><Link to="/cars" className="hover:text-primary-400 transition-colors">Car Rentals</Link></li>
            <li><Link to="/tours" className="hover:text-primary-400 transition-colors">Tour Packages</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            <li><Link to="/partner-onboarding" className="hover:text-primary-400 transition-colors">Partner With Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><FiMail className="text-primary-400" /> support@travelhub.com</li>
            <li className="flex items-center gap-2"><FiPhone className="text-primary-400" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><FiMapPin className="text-primary-400" /> New York, USA</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} TravelHub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;


