import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { busAPI } from '../services';
import { formatPrice } from '../utils/constants';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data } = await busAPI.getAll();
        setBuses(data?.data || data?.buses || data || []);
      } catch (err) {
        console.error('Failed to fetch buses:', err);
        toast.error(err?.response?.data?.message || 'Unable to load buses');
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const filtered = buses.filter(b => {
    const q = search.toLowerCase();
    return (
      (b.busNumber || '').toLowerCase().includes(q) ||
      (b.operator || '').toLowerCase().includes(q) ||
      (b.route?.origin || '').toLowerCase().includes(q) ||
      (b.route?.destination || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus?')) return;
    try {
      await busAPI.delete(id);
      setBuses(prev => prev.filter(b => b._id !== id));
      toast.success('Bus deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete bus');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Buses</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Search buses..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiFilter size={14} /> Filter
            </button>
            <Link to="/dashboard/admin/buses/add" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <FiPlus size={14} /> Add Bus
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-sm">No buses found.</p>
            <Link to="/dashboard/admin/buses/add" className="mt-3 text-primary-600 text-sm font-medium hover:underline">Add your first bus →</Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bus No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Operator</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(b => (
                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{b.busNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">{b.operator?.charAt(0)}</div>
                      <span className="text-sm text-gray-700">{b.operator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{b.route?.origin || '—'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{b.route?.destination || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.departureTime ? new Date(b.departureTime).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(b.price, 'INR', 'INR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.busType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${b.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {b.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/dashboard/admin/buses/edit/${b._id}`} className="text-gray-400 hover:text-primary-600 p-1 transition-colors"><FiEdit2 size={15} /></Link>
                      <button onClick={() => handleDelete(b._id)} className="text-gray-400 hover:text-rose-600 p-1 transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">Showing {filtered.length} bus{filtered.length !== 1 ? 'es' : ''}</p>
      </div>
    </div>
  );
};

export default AdminBuses;
