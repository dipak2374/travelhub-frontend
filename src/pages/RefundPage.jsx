import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocation, Link } from 'react-router-dom';
import { FiFilter, FiDownload, FiCheckCircle, FiClock, FiAlertCircle, FiArrowRight, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { bookingAPI } from '../services';
import Pagination from '../components/Pagination';
import { formatPrice, formatDate } from '../utils/constants';

const REFUND_STATUSES = {
  pending: { icon: FiClock, label: 'Pending', color: 'bg-yellow-50', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  approved: { icon: FiCheckCircle, label: 'Approved', color: 'bg-blue-50', textColor: 'text-blue-700', bgColor: 'bg-blue-100' },
  processing: { icon: FiClock, label: 'Processing', color: 'bg-blue-50', textColor: 'text-blue-700', bgColor: 'bg-blue-100' },
  completed: { icon: FiCheckCircle, label: 'Completed', color: 'bg-green-50', textColor: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { icon: FiAlertCircle, label: 'Rejected', color: 'bg-red-50', textColor: 'text-red-700', bgColor: 'bg-red-100' },
};

const LIMIT = 10;

const RefundPage = () => {
  const { state } = useLocation();
  const selectedBooking = state?.selectedBooking;
  const { user } = useSelector((state) => state.auth);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedBooking, setShowSelectedBooking] = useState(!!selectedBooking);
  const [stats, setStats] = useState({
    totalRefunds: 0,
    pendingRefunds: 0,
    completedRefunds: 0,
    totalAmount: 0,
  });

  const fetchRefunds = useCallback((page = 1, status = 'All') => {
    setLoading(true);
    const params = { page: 1, limit: 100 }; // Fetch all to see everything

    bookingAPI.getMy(params)
      .then((r) => {
        const res = r.data;
        let items = res.data || res.bookings || [];
        
        console.log('API Response:', res); // Debug logging
        console.log('All bookings count:', items.length); // Debug logging
        
        // If no items, try the whole response as items
        if (!items || items.length === 0) {
          items = Array.isArray(res) ? res : [res];
        }
        
        console.log('Processing items:', items); // Debug logging
        
        // Show ALL bookings (no filters by default)
        let refundItems = items;

        // Apply status filter if selected
        if (status !== 'All') {
          refundItems = refundItems.filter(b => {
            if (status === 'Pending') return b.refundStatus === 'pending' || (!b.refundStatus && b.status === 'cancelled') || b.status === 'confirmed';
            if (status === 'Processing') return b.refundStatus === 'processing';
            if (status === 'Approved') return b.refundStatus === 'approved';
            if (status === 'Completed') return b.refundStatus === 'completed';
            if (status === 'Rejected') return b.refundStatus === 'rejected';
            if (status === 'Confirmed') return b.status === 'confirmed';
            if (status === 'Cancelled') return b.status === 'cancelled';
            return true;
          });
        }
        
        console.log('Final refund items:', refundItems); // Debug logging
        
        // Paginate
        const total = refundItems.length;
        const startIdx = (page - 1) * LIMIT;
        const endIdx = startIdx + LIMIT;
        const paginatedItems = refundItems.slice(startIdx, endIdx);
        const pages = Math.ceil(total / LIMIT) || 1;
        
        setRefunds(paginatedItems);
        setTotalRefunds(total);
        setTotalPages(pages);

        // Calculate stats from all items
        const pending = refundItems.filter(r => r.refundStatus === 'pending' || (!r.refundStatus && r.status === 'cancelled') || r.status === 'confirmed').length;
        const completed = refundItems.filter(r => r.refundStatus === 'completed').length;
        const totalAmount = refundItems.reduce((sum, r) => sum + (r.refundAmount || 0), 0);

        setStats({
          totalRefunds: total,
          pendingRefunds: pending,
          completedRefunds: completed,
          totalAmount,
        });
      })
      .catch((err) => {
        console.error('Fetch refunds error:', err);
        console.error('Error details:', err.response?.data); // Debug logging
        toast.error(err.response?.data?.message || 'Failed to fetch bookings');
        setRefunds([]);
        setTotalRefunds(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchRefunds(1, filterStatus);
  }, [filterStatus, fetchRefunds]);

  // Restore selected booking from localStorage if not passed via state
  const fetchLatestCancelledBooking = useCallback(async () => {
    try {
      const { data } = await bookingAPI.getMy({ page: 1, limit: 50 });
      const items = data.data || data.bookings || [];
      const cancelledBooking = items.find(b => b.status === 'cancelled' && !b.refundStatus);

      if (cancelledBooking) {
        if (!selectedBooking && !showSelectedBooking) {
          setShowSelectedBooking(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch latest cancelled booking', err);
    }
  }, [selectedBooking, showSelectedBooking]);

  useEffect(() => {
    if (!selectedBooking && !showSelectedBooking) {
      const savedBooking = localStorage.getItem('selectedCancelledBooking');
      if (savedBooking) {
        try {
          const booking = JSON.parse(savedBooking);
          setShowSelectedBooking(true);
        } catch (e) {
          console.error('Failed to parse saved booking', e);
        }
      } else {
        // If no saved booking, try to fetch the latest cancelled booking
        fetchLatestCancelledBooking();
      }
    }
  }, [fetchLatestCancelledBooking]);

  // Save selected booking to localStorage when changed
  useEffect(() => {
    if (selectedBooking && showSelectedBooking) {
      localStorage.setItem('selectedCancelledBooking', JSON.stringify(selectedBooking));
    } else {
      localStorage.removeItem('selectedCancelledBooking');
    }
  }, [selectedBooking, showSelectedBooking]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchRefunds(page, filterStatus);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setFilterStatus(tab);
    setCurrentPage(1);
    // useEffect will handle the fetch
  };

  const handleRequestRefund = async (id) => {
    if (!confirm('Request refund for this booking?')) return;
    try {
      await bookingAPI.requestRefund(id);
      toast.success('Refund request submitted');
      fetchRefunds(currentPage, filterStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request refund');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled');
      fetchRefunds(currentPage, filterStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleRequestRefundNow = async () => {
    if (!selectedBooking) return;
    try {
      await bookingAPI.requestRefund(selectedBooking._id);
      toast.success('Refund request submitted for this booking');
      setShowSelectedBooking(false);
      localStorage.removeItem('selectedCancelledBooking');
      fetchRefunds(1, filterStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request refund');
    }
  };

  const filteredRefunds = (refunds || []).filter((r) => {
    const query = searchQuery.toLowerCase();
    const id = (r?._id || r?.id || '').toString().toLowerCase();
    const title = (r?.item?.name || r?.item?.title || r?.bookingType || '').toString().toLowerCase();
    const reference = (r?.bookingReference || '').toString().toLowerCase();

    return (
      id.includes(query) ||
      title.includes(query) ||
      reference.includes(query)
    );
  });

  const getRefundStatus = (booking) => {
    return booking.refundStatus || (booking.status === 'refunded' ? 'completed' : 'pending');
  };

  const getRefundIcon = (status) => {
    const Icon = REFUND_STATUSES[status]?.icon || FiClock;
    return Icon;
  };

  const startItem = totalRefunds === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const endItem = Math.min(currentPage * LIMIT, totalRefunds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">Refunds & Cancellations</h1>
          <p className="text-gray-600">Manage your bookings, cancel trips, and track refund requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Refunds</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalRefunds}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiDownload className="text-blue-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pendingRefunds}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-yellow-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Completed</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.completedRefunds}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Amount</p>
                <p className="text-2xl md:text-3xl font-bold text-indigo-600">{formatPrice(stats.totalAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-lg">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Booking Banner */}
        {showSelectedBooking && selectedBooking && (
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-primary-900">Cancelled Booking Selected</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-primary-600 font-medium mb-1">Booking ID</p>
                    <p className="text-sm font-semibold text-primary-900">{selectedBooking._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-600 font-medium mb-1">Item</p>
                    <p className="text-sm font-semibold text-primary-900">{selectedBooking.item?.name || selectedBooking.item?.title || selectedBooking.bookingType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-600 font-medium mb-1">Amount</p>
                    <p className="text-sm font-semibold text-primary-900">{formatPrice(selectedBooking.totalAmount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleRequestRefundNow}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FiArrowRight size={14} />
                    Request Refund Now
                  </button>
                  <p className="text-xs text-primary-700">
                    Or view your refunds in the table below
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSelectedBooking(false)}
                className="flex-shrink-0 p-2 hover:bg-primary-200 rounded-lg transition-colors"
              >
                <FiX size={18} className="text-primary-600" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          {/* Filter Tabs */}
          <div className="p-6 border-b border-gray-100">
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Booking Status</p>
              <div className="flex items-center gap-1 overflow-x-auto">
                {['All', 'Confirmed', 'Cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === tab
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Refund Status</p>
              <div className="flex items-center gap-1 overflow-x-auto">
                {['Pending', 'Processing', 'Approved', 'Completed', 'Rejected'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === tab
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Header and Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by booking ID or item name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiFilter size={14} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiDownload size={14} /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredRefunds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400 p-6">
                <span className="text-5xl">�</span>
                <p className="text-base font-medium">No bookings to manage</p>
                <p className="text-sm text-center">
                  {totalRefunds === 0 
                    ? "You don't have any bookings yet. Start by booking a hotel, flight, or tour!"
                    : `No bookings match "${filterStatus}" filter. Try a different filter.`}
                </p>
                {totalRefunds === 0 && (
                  <Link 
                    to="/hotels" 
                    className="mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Make Your First Booking
                  </Link>
                )}
                {totalRefunds > 0 && (
                  <button 
                    onClick={() => handleTabChange('All')}
                    className="mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                  >
                    View All Bookings
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Total bookings: {totalRefunds}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, idx) => {
                    const refundStatus = getRefundStatus(refund);
                    const statusConfig = REFUND_STATUSES[refundStatus];
                    const Icon = getRefundIcon(refundStatus);
                    const shortId = refund?._id ? refund._id.slice(-8).toUpperCase() : (refund?.id ? refund.id.toString().slice(-8).toUpperCase() : `REF-${idx + 1}`);

                    return (
                      <tr key={refund._id || refund.id || idx} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-gray-900">{shortId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{refund.item?.name || refund.item?.title || refund.bookingType || 'Unknown item'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(refund.refundAmount || refund.totalAmount || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {/* Booking Status */}
                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              refund.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                              refund.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                              refund.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {refund.status?.charAt(0).toUpperCase() + refund.status?.slice(1) || 'Pending'}
                            </div>
                            {/* Refund Status */}
                            {refund.refundStatus && (
                              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${REFUND_STATUSES[refund.refundStatus]?.bgColor || 'bg-gray-100'}`}>
                                <span className={`text-xs font-medium ${REFUND_STATUSES[refund.refundStatus]?.textColor || 'text-gray-600'}`}>
                                  {REFUND_STATUSES[refund.refundStatus]?.label || refund.refundStatus}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{formatDate(refund.updatedAt || refund.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4">
                          {refund.status === 'confirmed' ? (
                            <button
                              onClick={() => handleCancelBooking(refund._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          ) : refund.status === 'cancelled' && !refund.refundStatus ? (
                            <button
                              onClick={() => handleRequestRefund(refund._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              Request Refund
                              <FiArrowRight size={12} />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalRefunds > LIMIT && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                startItem={startItem}
                endItem={endItem}
                totalItems={totalRefunds}
              />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-4">📋 How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-blue-900 mb-3 uppercase">Cancellation Policy</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <strong>Flights:</strong> 2 hours before departure</li>
                <li>• <strong>Hotels:</strong> 24 hours before check-in</li>
                <li>• <strong>Buses/Cars/Tours:</strong> 24 hours before trip</li>
                <li>• Early cancellation = Full refund</li>
                <li>• Late cancellation = Partial refund</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-blue-900 mb-3 uppercase">Refund Process</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>1. Click <strong>"Cancel"</strong> to cancel your booking</li>
                <li>2. Click <strong>"Request Refund"</strong> to submit request</li>
                <li>3. Refund will be processed within 5-7 business days</li>
                <li>4. Check status in this page anytime</li>
                <li>📧 Questions? Contact support@travelhub.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;
