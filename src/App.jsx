import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/slices/authSlice';
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Hotels = lazy(() => import('./pages/Hotels'));
const Flights = lazy(() => import('./pages/Flights'));
const Buses = lazy(() => import('./pages/Buses'));
const Cars = lazy(() => import('./pages/Cars'));
const Tours = lazy(() => import('./pages/Tours'));
const HotelDetail = lazy(() => import('./pages/HotelDetail'));
const FlightDetail = lazy(() => import('./pages/FlightDetail'));
const FlightBookingFlow = lazy(() => import('./pages/FlightBookingFlow'));
const BusDetail = lazy(() => import('./pages/BusDetail'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Reviews = lazy(() => import('./pages/Reviews'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PartnerOnboarding = lazy(() => import('./pages/PartnerOnboarding'));
const BookingsPage = lazy(() => import('./dashboard/BookingsPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const Destinations = lazy(() => import('./pages/Destinations'));
const Offers = lazy(() => import('./pages/Offers'));

const AdminDashboard = lazy(() => import('./dashboard/AdminDashboard'));
const AdminUsers = lazy(() => import('./dashboard/AdminUsers'));
const AdminUserDetail = lazy(() => import('./dashboard/AdminUserDetail'));
const AdminAgents = lazy(() => import('./dashboard/AdminAgents'));
const AdminCoupons = lazy(() => import('./dashboard/AdminCoupons'));
const AdminHotels = lazy(() => import('./dashboard/AdminHotels'));
const AdminFlights = lazy(() => import('./dashboard/AdminFlights'));
const AdminBuses = lazy(() => import('./dashboard/AdminBuses'));
const AdminCars = lazy(() => import('./dashboard/AdminCars'));
const AdminTours = lazy(() => import('./dashboard/AdminTours'));
const AdminEditHotel = lazy(() => import('./dashboard/AdminEditHotel'));
const AdminEditFlight = lazy(() => import('./dashboard/AdminEditFlight'));
const AdminEditBus = lazy(() => import('./dashboard/AdminEditBus'));
const AdminEditCar = lazy(() => import('./dashboard/AdminEditCar'));
const AdminEditTour = lazy(() => import('./dashboard/AdminEditTour'));
const AdminPayments = lazy(() => import('./dashboard/AdminPayments'));
const AdminReviews = lazy(() => import('./dashboard/AdminReviews'));
const AdminReports = lazy(() => import('./dashboard/AdminReports'));
const AdminSettings = lazy(() => import('./dashboard/AdminSettings'));
const AdminProfile = lazy(() => import('./dashboard/AdminProfile'));
const PartnerDashboard = lazy(() => import('./dashboard/PartnerDashboard'));

const ADMIN = ['admin'];

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchUser());
  }, [dispatch, token]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="hotels/:id" element={<HotelDetail />} />
        <Route path="flights" element={<Flights />} />
        <Route path="flights/:id" element={<FlightDetail />} />
        <Route path="flights/:id/book" element={<ProtectedRoute><FlightBookingFlow /></ProtectedRoute>} />
        <Route path="buses" element={<Buses />} />
        <Route path="buses/:id" element={<BusDetail />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetail />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="partner-onboarding" element={<PartnerOnboarding />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="offers" element={<Offers />} />
        <Route path="bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="refunds" element={<ProtectedRoute><RefundPage /></ProtectedRoute>} />
      </Route>

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Admin Routes */}
        <Route path="dashboard/admin" element={<ProtectedRoute roles={ADMIN}><AdminDashboard /></ProtectedRoute>} />
        <Route path="dashboard/admin/hotels" element={<ProtectedRoute roles={ADMIN}><AdminHotels /></ProtectedRoute>} />
        <Route path="dashboard/admin/hotels/add" element={<ProtectedRoute roles={ADMIN}><AdminEditHotel /></ProtectedRoute>} />
        <Route path="dashboard/admin/hotels/edit/:id" element={<ProtectedRoute roles={ADMIN}><AdminEditHotel /></ProtectedRoute>} />
        <Route path="dashboard/admin/flights" element={<ProtectedRoute roles={ADMIN}><AdminFlights /></ProtectedRoute>} />
        <Route path="dashboard/admin/flights/add" element={<ProtectedRoute roles={ADMIN}><AdminEditFlight /></ProtectedRoute>} />
        <Route path="dashboard/admin/flights/edit/:id" element={<ProtectedRoute roles={ADMIN}><AdminEditFlight /></ProtectedRoute>} />
        <Route path="dashboard/admin/buses" element={<ProtectedRoute roles={ADMIN}><AdminBuses /></ProtectedRoute>} />
        <Route path="dashboard/admin/buses/add" element={<ProtectedRoute roles={ADMIN}><AdminEditBus /></ProtectedRoute>} />
        <Route path="dashboard/admin/buses/edit/:id" element={<ProtectedRoute roles={ADMIN}><AdminEditBus /></ProtectedRoute>} />
        <Route path="dashboard/admin/cars" element={<ProtectedRoute roles={ADMIN}><AdminCars /></ProtectedRoute>} />
        <Route path="dashboard/admin/cars/add" element={<ProtectedRoute roles={ADMIN}><AdminEditCar /></ProtectedRoute>} />
        <Route path="dashboard/admin/cars/edit/:id" element={<ProtectedRoute roles={ADMIN}><AdminEditCar /></ProtectedRoute>} />
        <Route path="dashboard/admin/tours" element={<ProtectedRoute roles={ADMIN}><AdminTours /></ProtectedRoute>} />
        <Route path="dashboard/admin/tours/add" element={<ProtectedRoute roles={ADMIN}><AdminEditTour /></ProtectedRoute>} />
        <Route path="dashboard/admin/tours/edit/:id" element={<ProtectedRoute roles={ADMIN}><AdminEditTour /></ProtectedRoute>} />
        <Route path="dashboard/admin/users" element={<ProtectedRoute roles={ADMIN}><AdminUsers /></ProtectedRoute>} />
        <Route path="dashboard/admin/users/:id" element={<ProtectedRoute roles={ADMIN}><AdminUserDetail /></ProtectedRoute>} />
        <Route path="dashboard/admin/agents" element={<ProtectedRoute roles={ADMIN}><AdminAgents /></ProtectedRoute>} />
        <Route path="dashboard/admin/payments" element={<ProtectedRoute roles={ADMIN}><AdminPayments /></ProtectedRoute>} />
        <Route path="dashboard/admin/coupons" element={<ProtectedRoute roles={ADMIN}><AdminCoupons /></ProtectedRoute>} />
        <Route path="dashboard/admin/reviews" element={<ProtectedRoute roles={ADMIN}><AdminReviews /></ProtectedRoute>} />
        <Route path="dashboard/admin/reports" element={<ProtectedRoute roles={ADMIN}><AdminReports /></ProtectedRoute>} />
        <Route path="dashboard/admin/settings" element={<ProtectedRoute roles={ADMIN}><AdminSettings /></ProtectedRoute>} />
        <Route path="dashboard/admin/profile" element={<ProtectedRoute roles={ADMIN}><AdminProfile /></ProtectedRoute>} />

        {/* Partner/Agency Routes */}
        <Route path="dashboard/agency" element={<ProtectedRoute roles={['travel_agency', 'admin']}><PartnerDashboard /></ProtectedRoute>} />
        <Route path="dashboard/agency/listings" element={<ProtectedRoute roles={['travel_agency', 'admin']}><PartnerDashboard /></ProtectedRoute>} />

        <Route path="dashboard/partner" element={<ProtectedRoute roles={['car_rental_partner', 'bus_operator', 'airline_partner', 'admin']}><PartnerDashboard /></ProtectedRoute>} />
        <Route path="dashboard/partner/listings" element={<ProtectedRoute roles={['car_rental_partner', 'bus_operator', 'airline_partner', 'admin']}><PartnerDashboard /></ProtectedRoute>} />

        <Route path="dashboard/car-partner" element={<Navigate to="/dashboard/partner" replace />} />
        <Route path="dashboard/bus-operator" element={<Navigate to="/dashboard/partner" replace />} />
        <Route path="dashboard/airline" element={<Navigate to="/dashboard/partner" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
