import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Column 1: Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <FaPlaneDeparture className="text-2xl text-primary-600" />
            <span className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
              TravelHub
            </span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Your all-in-one travel booking platform. Plan, book and travel with ease.
          </p>
        </div>

        {/* Column 2: Company */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</Link></li>
            <li><Link to="/blog" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link></li>
            <li><Link to="/press" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Press</Link></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Help Center</Link></li>
            <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Column 4: Top Destinations */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Top Destinations</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/destinations/paris" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Paris</Link></li>
            <li><Link to="/destinations/dubai" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Dubai</Link></li>
            <li><Link to="/destinations/singapore" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Singapore</Link></li>
            <li><Link to="/destinations/maldives" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Maldives</Link></li>
          </ul>
        </div>

        {/* Column 5: Follow Us */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Follow Us</h4>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <FaTwitter size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <FaYoutube size={14} />
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TravelHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
