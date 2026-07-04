import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatPrice } from '../utils/constants';
import { flightAPI } from '../services';

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await flightAPI.getAll();
        setFlights(data?.data || data?.flights || data || []);
      } catch (err) {
        console.error('Failed to fetch flights:', err);
        toast.error(err?.response?.data?.message || 'Unable to load flights');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const filtered = flights.filter(f => {
    const q = search.toLowerCase();
    return (
      (f.flightNumber || '').toLowerCase().includes(q) ||
      (f.airline || '').toLowerCase().includes(q) ||
      (f.origin?.code || '').toLowerCase().includes(q) ||
      (f.destination?.code || '').toLowerCase().includes(q) ||
      (f.origin?.city || '').toLowerCase().includes(q) ||
      (f.destination?.city || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this flight?')) return;
    try {
      await flightAPI.delete(id);
      setFlights(prev => prev.filter(f => f._id !== id));
      toast.success('Flight deleted');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete flight');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Flights</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Search flights..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiFilter size={14} /> Filter
            </button>
            <Link to="/dashboard/admin/flights/add" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <FiPlus size={14} /> Add Flight
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-sm">No flights found.</p>
            <Link to="/dashboard/admin/flights/add" className="mt-3 text-primary-600 text-sm font-medium hover:underline">Add your first flight →</Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flight No</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Airline</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(f => (
                <tr key={f._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{f.flightNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{f.airline?.charAt(0)}</div>
                      <span className="text-sm text-gray-700">{f.airline}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{f.origin?.code || f.origin?.city || '—'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{f.destination?.code || f.destination?.city || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{f.departureTime ? new Date(f.departureTime).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(f.price?.economy || 0, 'INR', 'INR')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${f.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {f.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/dashboard/admin/flights/edit/${f._id}`} className="text-gray-400 hover:text-primary-600 p-1 transition-colors"><FiEdit2 size={15} /></Link>
                      <button onClick={() => handleDelete(f._id)} className="text-gray-400 hover:text-rose-600 p-1 transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing {filtered.length} flight{filtered.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export default AdminFlights;
