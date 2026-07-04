import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  FiGrid, FiCalendar, FiHeart, FiUser, FiSettings, FiUsers, FiTag,
  FiCornerUpLeft, FiStar, FiFileText, FiHome,
  FiNavigation, FiTruck, FiCamera, FiMap, FiCreditCard, FiLogOut, FiUserPlus
} from 'react-icons/fi';
import { FaPlane, FaBus } from 'react-icons/fa';

const customerLinks = [
  { to: '/profile', icon: FiUser, label: 'Profile' },
  { to: '/wishlist', icon: FiHeart, label: 'Wishlist' },
];

const adminLinks = [
  { to: '/dashboard/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/dashboard/admin/hotels', icon: FiHome, label: 'Hotels' },
  { to: '/dashboard/admin/flights', icon: FaPlane, label: 'Flights' },
  { to: '/dashboard/admin/buses', icon: FaBus, label: 'Buses' },
  { to: '/dashboard/admin/cars', icon: FiTruck, label: 'Cars' },
  { to: '/dashboard/admin/tours', icon: FiMap, label: 'Tours' },
  { to: '/dashboard/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/dashboard/admin/agents', icon: FiUserPlus, label: 'Agents' },
  { to: '/dashboard/admin/payments', icon: FiCreditCard, label: 'Payments' },
  { to: '/dashboard/admin/coupons', icon: FiTag, label: 'Coupons' },
  { to: '/dashboard/admin/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/dashboard/admin/reports', icon: FiFileText, label: 'Reports' },
  { to: '/dashboard/admin/settings', icon: FiSettings, label: 'Settings' },
  { to: '/dashboard/admin/profile', icon: FiUser, label: 'Profile' },
];

const agencyLinks = [
  { to: '/dashboard/agency', icon: FiGrid, label: 'Overview' },
  { to: '/dashboard/agency/listings', icon: FiTag, label: 'My Listings' },
];

const partnerLinks = [
  { to: '/dashboard/partner', icon: FiGrid, label: 'Overview' },
  { to: '/dashboard/partner/listings', icon: FiTag, label: 'My Listings' },
];

const getLinks = (role) => {
  if (role === 'admin') return adminLinks;
  if (role === 'travel_agency') return agencyLinks;
  if (['car_rental_partner', 'bus_operator', 'airline_partner'].includes(role)) return partnerLinks;
  return customerLinks;
};

const DashboardSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const links = getLinks(user?.role);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="w-64 bg-white text-gray-900 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold font-display text-gray-900">
          <FaPlane className="text-primary-400" />
          <span>TravelHub</span>
        </Link>
      </div>

      {/* Admin Title (Optional) */}
      <div className="px-6 py-4">
        <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
          {user?.role === 'admin' ? 'ALL ADMIN PANELS' : 'DASHBOARD PANELS'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 hide-scrollbar">
        {links.map((link, index) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${active ? 'bg-primary-700/50 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
