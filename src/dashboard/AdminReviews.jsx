import { useState } from 'react';
import { FiSearch, FiStar, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';

const SAMPLE_REVIEWS = [
  { _id: '1', user: 'John Doe', service: 'Sea View Resort', review: 'Best stay! Great with warm service.', rating: 4, date: '30 May, +125', status: 'Published' },
  { _id: '2', user: 'Jane Smith', service: 'Bali Adventure', review: 'Wonderful tour, well organized and fun!', rating: 5, date: '29 May, +125', status: 'Published' },
  { _id: '3', user: 'Robert Brown', service: 'Toyota Innova', review: 'Car was clean and driver was polite.', rating: 3, date: '19 May, +125', status: 'Pending' },
  { _id: '4', user: 'Emily Ross', service: 'Desert Paradise', review: 'Excellent hospitality!', rating: 5, date: '15 May, +125', status: 'Published' },
  { _id: '5', user: 'Michael Wilson', service: 'City Line Bus', review: 'Comfortable ride but slight delay.', rating: 3, date: '12 May, +125', status: 'Pending' },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <FiStar key={s} size={13} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = reviews.filter(r =>
    r.user.toLowerCase().includes(search.toLowerCase()) ||
    r.service.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentReviews = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (id) => {
    if (!confirm('Delete this review?')) return;
    setReviews(prev => prev.filter(r => r._id !== id));
    toast.success('Review deleted');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Review</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentReviews.map(r => (
              <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                      {r.user.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{r.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.service}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <p className="truncate">{r.review}</p>
                </td>
                <td className="px-6 py-4">
                  <StarRating rating={r.rating} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleDelete(r._id)} className="text-gray-400 hover:text-rose-600 p-1"><FiTrash2 size={15} /></button>
                    <button className="text-gray-400 hover:text-gray-600 p-1"><FiMoreVertical size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} reviews
        </p>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminReviews;
