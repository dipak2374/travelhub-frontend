import { useState } from 'react';
import { FiSearch, FiDownload, FiMoreVertical, FiCreditCard } from 'react-icons/fi';
import { formatPrice } from '../utils/constants';
import Pagination from '../components/Pagination';

const SAMPLE_PAYMENTS = [
  { _id: 'PMT123486', bookingId: '#TKS453446', user: 'John Doe', amount: 297, method: 'Credit Card', date: '30 May, 2025', status: 'Paid' },
  { _id: 'PMT123487', bookingId: '#TKS453447', user: 'Jane Smith', amount: 180, method: 'Credit Card', date: '29 May, 2025', status: 'Paid' },
  { _id: 'PMT123488', bookingId: '#TKS453448', user: 'Robert Brown', amount: 420, method: 'Credit Card', date: '22 May, 2025', status: 'Paid' },
  { _id: 'PMT123489', bookingId: '#TKS453449', user: 'Emily Davis', amount: 156, method: 'Credit Card', date: '20 May, 2025', status: 'Failed' },
  { _id: 'PMT123490', bookingId: '#TKS453450', user: 'Michael Wilson', amount: 415, method: 'Credit Card', date: '18 May, 2025', status: 'Paid' },
];

const AdminPayments = () => {
  const [payments] = useState(SAMPLE_PAYMENTS);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = payments.filter(p =>
    p._id.toLowerCase().includes(search.toLowerCase()) ||
    p.user.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentPayments = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalRevenue = 125430;
  const totalPaid = filtered.filter(p => p.status === 'Paid').length;
  const totalFailed = filtered.filter(p => p.status === 'Failed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: totalRevenue, color: 'bg-blue-50 border-blue-100', iconColor: 'text-blue-600 bg-blue-100' },
          { label: 'Successful Payments', value: totalPaid, color: 'bg-emerald-50 border-emerald-100', iconColor: 'text-emerald-600 bg-emerald-100' },
          { label: 'Failed Payments', value: totalFailed, color: 'bg-rose-50 border-rose-100', iconColor: 'text-rose-600 bg-rose-100' },
        ].map((card, i) => (
          <div key={i} className={`rounded-2xl p-5 border ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.label === 'Total Revenue' ? formatPrice(card.value, 'INR', 'INR') : card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                <FiCreditCard size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Payment Transactions</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiDownload size={14} /> Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentPayments.map(p => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{p._id}</td>
                  <td className="px-6 py-4 text-sm text-primary-600 font-medium">{p.bookingId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                        {p.user.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700">{p.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(p.amount, 'INR', 'INR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1"><FiMoreVertical size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} transactions
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
