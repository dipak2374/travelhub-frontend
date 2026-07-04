import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiHeart, FiCreditCard } from 'react-icons/fi';
import { bookingAPI } from '../services';
import { formatPrice, formatDate } from '../utils/constants';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMy()
      .then((r) => setBookings(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FiCalendar, label: 'Total Bookings', value: stats.total, color: 'primary' },
          { icon: FiCreditCard, label: 'Confirmed', value: stats.confirmed, color: 'green' },
          { icon: FiHeart, label: 'Pending', value: stats.pending, color: 'yellow' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <s.icon className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-semibold">Recent Bookings</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No bookings yet</p>
            <Link to="/hotels" className="btn-primary inline-block mt-4 text-sm">Start Exploring</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {bookings.slice(0, 5).map((b) => (
              <div key={b._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{b.bookingType} Booking</p>
                  <p className="text-sm text-gray-500">{b.bookingReference} · {formatDate(b.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(b.totalAmount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
