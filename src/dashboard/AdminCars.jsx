import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { carAPI } from '../services';
import { formatPrice } from '../utils/constants';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await carAPI.getAll();
        setCars(data?.data || data?.cars || data || []);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        toast.error(err?.response?.data?.message || 'Unable to load cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filtered = cars.filter(c => {
    const q = search.toLowerCase();
    return (
      (c.make || '').toLowerCase().includes(q) ||
      (c.model || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.location?.city || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this car?')) return;
    try {
      await carAPI.delete(id);
      setCars(prev => prev.filter(c => c._id !== id));
      toast.success('Car deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete car');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Cars</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Search cars..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiFilter size={14} /> Filter
            </button>
            <Link to="/dashboard/admin/cars/add" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <FiPlus size={14} /> Add Car
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-sm">No cars found.</p>
            <Link to="/dashboard/admin/cars/add" className="mt-3 text-primary-600 text-sm font-medium hover:underline">Add your first car →</Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transmission</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/Day</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {c.images?.[0] ? (
                        <img src={c.images[0]} alt={c.model} className="w-12 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-lg">🚗</div>
                      )}
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">{c.make} {c.model}</span>
                        <span className="text-xs text-gray-400">{c.year}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.transmission}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.seats}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.location?.city || '—'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(c.pricePerDay, 'INR', 'INR')}/day</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.isAvailable !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {c.isAvailable !== false ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/dashboard/admin/cars/edit/${c._id}`} className="text-gray-400 hover:text-primary-600 p-1 transition-colors"><FiEdit2 size={15} /></Link>
                      <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-rose-600 p-1 transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">Showing {filtered.length} car{filtered.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export default AdminCars;
