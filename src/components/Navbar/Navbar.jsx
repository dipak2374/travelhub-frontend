import { Link, useLocation } from 'react-router-dom';
import { FiGlobe, FiMoon, FiSun, FiMenu, FiX, FiBell, FiUser, FiChevronDown } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { logout } from '../../redux/slices/authSlice';
import { getDashboardPath } from '../../utils/constants';
import { FaPlaneDeparture } from 'react-icons/fa';

const navLinks = [
  { to: '/flights', label: 'Flights' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/buses', label: 'Bus' },
  { to: '/cars', label: 'Cars' },
  { to: '/tours', label: 'Tours' },
  { to: '/packages', label: 'Packages' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const { darkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !isScrolled;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent text-white' 
        : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <FaPlaneDeparture className={`text-2xl ${isTransparent ? 'text-white' : 'text-primary-600'}`} />
            <span className="font-display font-bold text-2xl tracking-tight">
              TravelHub
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors hover:text-primary-400 ${
                  isTransparent ? 'text-white/90' : 'text-gray-700 dark:text-gray-200 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            <div className={`hidden sm:flex items-center gap-1 text-sm font-medium cursor-pointer ${isTransparent ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              <FiGlobe className="text-lg" />
              <span>EN</span>
              <FiChevronDown />
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/notifications" className={`relative p-2 rounded-full ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center border border-primary-200 dark:border-primary-800">
                      <FiUser className="text-primary-600" />
                    </div>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        Profile
                      </Link>
                      <Link to="/reviews" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        Reviews
                      </Link>
                      <hr className="my-2 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={() => { dispatch(logout()); setProfileOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-full transition-colors text-sm shadow-md">
                Login
              </Link>
            )}

            <button
              className={`md:hidden p-2 rounded-lg ${isTransparent ? 'text-white' : 'text-gray-500'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-white dark:bg-gray-900 px-4 pt-2 shadow-lg rounded-b-2xl border-t border-gray-100 dark:border-gray-800 absolute w-full left-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-3 text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg"
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
