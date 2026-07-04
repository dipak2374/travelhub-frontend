import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hotelAPI, tourAPI, flightAPI, busAPI, carAPI, bookingAPI } from '../services';
import { formatPrice, formatDate } from '../utils/constants';

const ROLE_LABELS = {
  travel_agency: 'Travel Agency Partner',
  airline_partner: 'Airline Partner',
  bus_operator: 'Bus Operator',
  car_rental_partner: 'Car Rental Partner',
};

const getListingType = (listing) => {
  if (listing.flightNumber) return 'flight';
  if (listing.busNumber) return 'bus';
  if (listing.make && listing.model) return 'car';
  if (listing.amenities || listing.pricePerNight) return 'hotel';
  if (listing.duration || listing.tourType) return 'tour';
  return 'listing';
};

const getListingPath = (listing) => {
  const type = getListingType(listing);
  switch (type) {
    case 'flight':
      return `/flights/${listing._id}`;
    case 'bus':
      return `/buses/${listing._id}`;
    case 'car':
      return `/cars/${listing._id}`;
    case 'hotel':
      return `/hotels/${listing._id}`;
    case 'tour':
      return `/tours/${listing._id}`;
    default:
      return '#';
  }
};

const PartnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apis = [];
        if (user?.role === 'travel_agency') {
          apis.push(hotelAPI.getMy(), tourAPI.getMy());
        } else if (user?.role === 'airline_partner') {
          apis.push(flightAPI.getMy());
        } else if (user?.role === 'bus_operator') {
          apis.push(busAPI.getMy());
        } else if (user?.role === 'car_rental_partner') {
          apis.push(carAPI.getMy());
        }

        const results = await Promise.all(apis);
        setListings(results.flatMap((r) => r.data.data));

        const bookingsRes = await bookingAPI.getPartner();
        setBookings(bookingsRes.data.data);
      } catch {
        setListings([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchData();
    }
  }, [user?.role]);

  const stats = useMemo(() => {
    const approvedCount = listings.filter((l) => l.isApproved).length;
    const activeCount = listings.filter((l) => l.isActive).length;
    const pendingApprovals = listings.filter((l) => !l.isApproved).length;
    const paidBookings = bookings.filter((b) => b.paymentStatus === 'paid');
    const pendingBookings = bookings.filter((b) => b.paymentStatus === 'pending');
    const cancelledBookings = bookings.filter((b) => b.paymentStatus === 'cancelled');
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const bookingsThisWeek = bookings.filter((b) => new Date(b.createdAt) >= startOfWeek);
    const bookingsThisMonth = bookings.filter((b) => new Date(b.createdAt) >= startOfMonth);
    const newBookings = bookings.filter((b) => new Date(b.createdAt) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    const totalEarnings = paidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const earningsThisMonth = paidBookings
      .filter((b) => new Date(b.createdAt) >= startOfMonth)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      approvedCount,
      activeCount,
      pendingApprovals,
      totalEarnings,
      paidCount: paidBookings.length,
      pendingCount: pendingBookings.length,
      cancelledCount: cancelledBookings.length,
      bookingsThisWeek: bookingsThisWeek.length,
      bookingsThisMonth: bookingsThisMonth.length,
      newBookings: newBookings.length,
      earningsThisMonth,
    };
  }, [bookings, listings]);

  const renderStatusBadge = (status) => {
    const map = {
      paid: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-rose-100 text-rose-700',
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const renderListingType = (listing) => {
    const type = getListingType(listing);
    return type === 'listing' ? 'Listing' : type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {user?.name || 'Partner'}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {ROLE_LABELS[user?.role] || 'Partner'} dashboard
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/partner/listings" className="btn-primary px-4 py-2">Add new listing</Link>
          <Link to="/bookings" className="btn-secondary px-4 py-2">View all bookings</Link>
          <button type="button" className="btn-secondary px-4 py-2">Request payout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-sm text-gray-500">My Listings</p>
          <p className="text-2xl font-bold">{listings.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Active Listings</p>
          <p className="text-2xl font-bold">{stats.activeCount}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pendingApprovals}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Canceled / Pending</p>
          <p className="text-2xl font-bold">{stats.pendingCount + stats.cancelledCount}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold text-primary-600">{formatPrice(stats.totalEarnings)}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-40 rounded-3xl bg-gray-100/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6 mb-6">
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Listing overview</h2>
                  <p className="text-sm text-gray-500">Review listing status and active inventory.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-3xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-gray-500">Approved</p>
                    <p className="font-semibold text-lg">{stats.approvedCount}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-gray-500">Active</p>
                    <p className="font-semibold text-lg">{stats.activeCount}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-gray-500">Pending</p>
                    <p className="font-semibold text-lg">{stats.pendingApprovals}</p>
                  </div>
                </div>
              </div>

              {listings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-primary-200 p-8 text-center">
                  <p className="text-gray-600 mb-4">No listings yet.</p>
                  <Link to="/dashboard/partner/listings" className="btn-primary px-6 py-3">Start listing</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {listings.map((listing) => (
                    <div key={listing._id} className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{listing.name || listing.title || listing.flightNumber || listing.busNumber || `${listing.make} ${listing.model}`}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-primary-100 text-primary-700 px-2 py-1">{renderListingType(listing)}</span>
                          <span className={listing.isApproved ? 'rounded-full bg-emerald-100 text-emerald-700 px-2 py-1' : 'rounded-full bg-yellow-100 text-yellow-700 px-2 py-1'}>
                            {listing.isApproved ? 'Approved' : 'Pending approval'}
                          </span>
                          <span className={listing.isActive ? 'rounded-full bg-sky-100 text-sky-700 px-2 py-1' : 'rounded-full bg-gray-100 text-gray-700 px-2 py-1'}>
                            {listing.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Link to={getListingPath(listing)} className="text-primary-600 hover:underline text-sm">View listing</Link>
                        <Link to={`/dashboard/partner/edit/${listing._id}`} className="text-gray-500 hover:text-gray-700 text-sm">Manage</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Booking performance</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">This month</p>
                  <p className="text-3xl font-semibold">{stats.bookingsThisMonth}</p>
                  <p className="text-sm text-gray-500 mt-1">Bookings</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">This week</p>
                  <p className="text-3xl font-semibold">{stats.bookingsThisWeek}</p>
                  <p className="text-sm text-gray-500 mt-1">Bookings</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">New bookings</p>
                  <p className="text-3xl font-semibold">{stats.newBookings}</p>
                  <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-white/80 p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Earnings trend</p>
                  <p className="text-sm text-gray-500">{formatPrice(stats.earningsThisMonth)} this month</p>
                </div>
                <div className="space-y-3">
                  {[{
                    label: 'This month',
                    value: stats.earningsThisMonth,
                    color: 'bg-primary-600'
                  }, {
                    label: 'Total earnings',
                    value: stats.totalEarnings,
                    color: 'bg-sky-500'
                  }].map((item) => {
                    const ratio = stats.totalEarnings > 0 ? Math.min((item.value / stats.totalEarnings) * 100, 100) : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{item.label}</span>
                          <span>{formatPrice(item.value)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className={`${item.color} h-full`} style={{ width: `${ratio}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <p className="text-sm text-gray-500">Latest partner bookings with status and amount.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-1">Paid {stats.paidCount}</span>
                <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1">Pending {stats.pendingCount}</span>
                <span className="rounded-full bg-rose-100 text-rose-700 px-2 py-1">Cancelled {stats.cancelledCount}</span>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-primary-200 p-8 text-center">
                <p className="text-gray-600 mb-4">No bookings have been received yet.</p>
                <p className="text-sm text-gray-500">Share your partner profile and accelerate sales.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-gray-200 text-gray-500">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {bookings.slice(0, 10).map((booking) => (
                      <tr key={booking._id}>
                        <td className="py-4 px-4">{booking.user?.name || 'Guest'}</td>
                        <td className="py-4 px-4 capitalize">{booking.bookingType}</td>
                        <td className="py-4 px-4 font-semibold">{formatPrice(booking.totalAmount)}</td>
                        <td className="py-4 px-4">{renderStatusBadge(booking.paymentStatus)}</td>
                        <td className="py-4 px-4">{formatDate(booking.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerDashboard;
