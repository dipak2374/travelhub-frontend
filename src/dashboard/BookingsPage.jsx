import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { bookingAPI } from '../services';
import Pagination from '../components/Pagination';
import { formatPrice, formatDate } from '../utils/constants';

const TABS = ['All', 'Confirmed', 'Pending', 'Cancelled', 'Refunded'];
const LIMIT = 10;

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const fetchBookings = useCallback((page = 1, tab = 'All') => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (tab !== 'All') params.status = tab.toLowerCase();

    let fetchPromise;
    if (user?.role === 'admin') {
      fetchPromise = bookingAPI.getAll(params);
    } else if (['travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'].includes(user?.role)) {
      fetchPromise = bookingAPI.getPartner(params);
    } else {
      fetchPromise = bookingAPI.getMy(params);
    }

    fetchPromise
      .then((r) => {
        const res = r.data;
        // Handle different server response shapes
        const items = res.data || res.bookings || [];
        const total = res.total ?? items.length;
        const pages = res.pages ?? (Math.ceil(total / LIMIT) || 1);
        setBookings(items);
        setTotalBookings(total);
        setTotalPages(pages);
      })
      .catch(() => {
        setBookings([]);
        setTotalBookings(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [user?.role]);

  useEffect(() => {
    setCurrentPage(1);
    fetchBookings(1, activeTab);
  }, [user?.role, activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBookings(page, activeTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // useEffect handles the fetch
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      const cancelledBooking = bookings.find(b => b._id === id);
      
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      
      // Store cancelled booking in localStorage for refund page
      if (cancelledBooking) {
        localStorage.setItem('selectedCancelledBooking', JSON.stringify({ ...cancelledBooking, status: 'cancelled' }));
      }
      
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const startItem = totalBookings === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const endItem = Math.min(currentPage * LIMIT, totalBookings);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header and Controls */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search booking ID..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-56"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiFilter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiDownload size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">
            <span className="text-4xl">📋</span>
            <p className="text-sm font-medium">No bookings found</p>
            {activeTab !== 'All' && (
              <button onClick={() => handleTabChange('All')} className="text-xs text-primary-600 hover:underline">
                View all bookings
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                {user?.role !== 'customer' && (
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                )}
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                    #{b._id?.substring(0, 8).toUpperCase()}
                  </td>
                  {user?.role !== 'customer' && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {b.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{b.user?.name || 'Guest User'}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{b.itemModel || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(b.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(b.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      b.status === 'confirmed'  ? 'bg-emerald-100 text-emerald-700' :
                      b.status === 'cancelled'  ? 'bg-rose-100 text-rose-700'     :
                      b.status === 'refunded'   ? 'bg-gray-100 text-gray-600'     :
                      b.status === 'completed'  ? 'bg-blue-100 text-blue-700'     :
                                                  'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {b.status === 'cancelled' && user?.role === 'customer' && (
                      <button
                        onClick={() => navigate('/refunds', { state: { selectedBooking: b } })}
                        className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors"
                      >
                        Request Refund
                      </button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && user?.role === 'customer' && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="text-sm text-rose-600 hover:text-rose-700 hover:underline font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
