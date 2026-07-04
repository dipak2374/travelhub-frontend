import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardPath } from '../utils/constants';

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !user) {
    return <div className="flex justify-center items-center min-h-[80vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (!user) {
      return <div className="flex justify-center items-center min-h-[80vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    }
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
};
