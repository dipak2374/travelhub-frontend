import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authAPI } from '../services';
import { fetchUser } from '../redux/slices/authSlice';
import { FiEdit2, FiX, FiSave, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      dispatch(fetchUser());
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display text-gray-900">My Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
          >
            <FiEdit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-flex mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold capitalize">
              {user?.role?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FiUser /> Full Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FiMail /> Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FiPhone /> Phone Number</p>
                <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Read-only)</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-lg text-sm text-gray-500 cursor-not-allowed" 
                  value={user?.email}
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" 
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={loading} 
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({ name: user.name || '', phone: user.phone || '' });
                }}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <FiX /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
