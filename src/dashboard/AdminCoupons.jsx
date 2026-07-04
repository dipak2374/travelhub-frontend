import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiPlus, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { couponAPI } from '../services';
import Pagination from '../components/Pagination';
import { formatDate } from '../utils/constants';
import { formatPrice } from '../utils/constants';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'percentage', discountValue: 10,
    validUntil: '', minPurchaseAmount: 0, applicableTypes: ['all'],
  });

  const fetchCoupons = () => {
    setLoading(true);
    couponAPI.getAll()
      .then((r) => setCoupons(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const currentCoupons = coupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await couponAPI.create(form);
      toast.success('Coupon created');
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header and Controls */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Coupons</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupon..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64"
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiFilter /> Filter
            </button>
            
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <FiPlus /> {showForm ? 'Cancel' : 'Add Coupon'}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Coupon Code</label>
              <input type="text" placeholder="e.g. SUMMER20" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Discount Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Discount Value</label>
              <input type="number" placeholder="10" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Purchase Amount</label>
              <input type="number" placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" value={form.minPurchaseAmount} onChange={(e) => setForm({ ...form, minPurchaseAmount: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Valid Until</label>
              <input type="date" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No coupons found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Min. Purchase</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid Till</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentCoupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-gray-900">{c.code}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : formatPrice(c.discountValue || 0, 'INR', 'INR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{c.discountType}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatPrice(c.minPurchaseAmount || 0, 'INR', 'INR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.validUntil)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-gray-400 hover:text-gray-600 p-1"><FiEdit2 size={16} /></button>
                      <button className="text-gray-400 hover:text-rose-600 p-1"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination Footer */}
      {!loading && coupons.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, coupons.length)} of {coupons.length} coupons
          </p>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
