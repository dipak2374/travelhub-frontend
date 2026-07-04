import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 1) return 'Dashboard';
  if (parts.length === 2 && parts[1] === 'admin') return 'Dashboard Overview';
  const lastPart = parts[parts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm shadow-gray-100/50">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
          {pageTitle}
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <FiSettings size={20} />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name}</p>
            <p className="text-xs text-gray-500 leading-none capitalize">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold ml-2">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
