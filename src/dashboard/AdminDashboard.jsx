import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FiBarChart2, FiUsers, FiClock, FiMoreVertical, FiCheckCircle } from 'react-icons/fi';
import { bookingAPI, authAPI } from '../services';
import { formatPrice } from '../utils/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    bookingAPI.getStats().then((r) => setStats(r.data.stats)).catch(() => {});
    bookingAPI.getAll({ page: 1, limit: 5 }).then((r) => setRecentBookings(r.data.bookings?.slice(0, 5) || [])).catch(() => {});
  }, []);

  if (!stats) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

  const revenueChart = {
    labels: stats.monthlyRevenue?.map((item) => {
      const [year, month] = item._id?.split('-') || [];
      return month && year ? new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short' }) : item._id;
    }) || [],
    datasets: [{
      label: 'Revenue',
      data: stats.monthlyRevenue?.map((item) => item.revenue || 0) || [],
      borderColor: '#4f46e5',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#4f46e5',
      pointBorderWidth: 2,
    }],
  };

  const typeChart = {
    labels: stats.bookingsByType?.map((t) => t._id) || [],
    datasets: [{
      data: stats.bookingsByType?.map((t) => t.count) || [],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
      cutout: '75%',
    }],
  };

  const topCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <FiBarChart2 size={24} />, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12.5% from last month' },
    { label: 'Total Bookings', value: stats.totalBookings?.toLocaleString(), icon: <FiBarChart2 size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+5.2% from last month' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings?.toLocaleString(), icon: <FiCheckCircle size={24} />, color: 'text-sky-600', bg: 'bg-sky-100', trend: '+3.4% from last month' },
    { label: 'Total Users', value: stats.totalUsers?.toLocaleString(), icon: <FiUsers size={24} />, color: 'text-amber-500', bg: 'bg-amber-100', trend: '+2.1% from last month' },
    { label: 'Pending Approvals', value: stats.pendingApprovals?.toLocaleString(), icon: <FiClock size={24} />, color: 'text-rose-500', bg: 'bg-rose-100', trend: stats.pendingApprovals > 0 ? 'Needs review' : 'All good' },
  ];

  const destinations = [
    { name: 'Bali, Indonesia', bookings: '1,545', image: 'https://images.unsplash.com/photo-1537996194471-f297763fd423?w=100&h=100&fit=crop' },
    { name: 'Dubai, UAE', bookings: '1,234', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=100&fit=crop' },
    { name: 'Paris, France', bookings: '980', image: 'https://images.unsplash.com/photo-1502602881226-22858fe4c5ad?w=100&h=100&fit=crop' },
    { name: 'Maldives', bookings: '850', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=100&h=100&fit=crop' },
    { name: 'Singapore', bookings: '764', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=100&h=100&fit=crop' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 overflow-hidden">
        {topCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className={card.trend.startsWith('+') ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                {card.trend.split(' ')[0]}
              </span>
              <span className="text-gray-400 ml-1">{card.trend.substring(card.trend.indexOf(' '))}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <button className="text-gray-400 hover:text-gray-600"><FiMoreVertical /></button>
          </div>
          <div className="h-72">
            <Line 
              data={revenueChart} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } },
                  x: { grid: { display: false }, border: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Bookings By Service</h3>
            <button className="text-gray-400 hover:text-gray-600"><FiMoreVertical /></button>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <div className="h-48 w-48 relative">
              <Doughnut 
                data={typeChart} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">{stats.totalBookings?.toLocaleString()}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {stats.bookingsByType?.map((t, i) => {
              const colors = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-purple-500'];
              return (
                <div key={t._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`}></span>
                    <span className="text-gray-600 capitalize">{t._id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{t.count}</span>
                    <span className="text-xs text-gray-400">({Math.round((t.count / stats.totalBookings) * 100)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Booking ID</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">User</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Service</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-900">#{b._id?.substring(0, 8).toUpperCase()}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                          {b.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{b.user?.name || 'Guest User'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500 capitalize">{b.itemModel}</td>
                    <td className="py-4 text-sm font-semibold text-gray-900">{formatPrice(b.totalAmount)}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Destinations</h3>
            <button className="text-gray-400 hover:text-gray-600"><FiMoreVertical /></button>
          </div>
          <div className="space-y-5">
            {destinations.map((dest, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{dest.name.split(',')[0]}</h4>
                  <p className="text-xs text-gray-500 truncate">{dest.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{dest.bookings}</span>
                  <p className="text-xs text-gray-400">Bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
