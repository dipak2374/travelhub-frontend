import { Link } from 'react-router-dom';
import { FiMoon, FiSun, FiMenu, FiX, FiBell, FiUser } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { logout } from '../redux/slices/authSlice';
import { getDashboardPath } from '../utils/constants';

const navLinks = [
  { to: '/hotels', label: 'Hotels' },
  { to: '/flights', label: 'Flights' },
  { to: '/buses', label: 'Buses' },
  { to: '/cars', label: 'Car Rentals' },
  { to: '/tours', label: 'Tours' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/images/logo.png" 
              alt="TravelHub Logo" 
              className="h-16 w-16 object-contain hover:scale-105 transition-transform"
            />
            <img
              src="/images/travelhub.png"
              alt="TravelHub Text Logo"
              className="h-20 w-auto hidden sm:block object-contain hover:scale-125 transition-transform"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <FiUser className="text-primary-600" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        Profile
                      </Link>
                        <Link to="/reviews" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        Reviews
                      </Link>
                      <Link to="/bookings" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        My Bookings
                      </Link>
                      <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        Wishlist
                      </Link>
                      <Link to="/refunds" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        Refunds
                      </Link>
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={() => { dispatch(logout()); setProfileOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
