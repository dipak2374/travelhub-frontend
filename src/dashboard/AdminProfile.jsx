import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiSave } from 'react-icons/fi';

const AdminProfile = () => {
  const { user } = useSelector(state => state.auth);
  const [form, setForm] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@travelhub.com',
    phone: user?.phone || '+1 (55) 7032-5551',
    bio: user?.bio || 'Super Admin',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Profile Form */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <input type="text" value={user?.role?.replace(/_/g, ' ') || 'Super Admin'} readOnly
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors">
                <FiSave size={15} /> Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
          <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Current Password', key: 'current' },
              { label: 'New Password', key: 'new' },
              { label: 'Confirm Password', key: 'confirm' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="password" value={passwords[f.key]} onChange={e => setPasswords({...passwords, [f.key]: e.target.value})} placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>
            ))}
            <div className="sm:col-span-3 flex justify-end mt-2">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
                <FiLock size={15} /> Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Picture Card */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 text-center">
          <h3 className="text-base font-bold text-gray-900 mb-6">Profile Picture</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md">
              <FiCamera size={14} />
            </button>
          </div>
          <p className="text-lg font-bold text-gray-900">{form.name}</p>
          <p className="text-sm text-gray-500 capitalize mb-4">{user?.email || 'admin@travelhub.com'}</p>
          <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            {user?.role?.replace(/_/g, ' ') || 'Super Admin'}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-left">
            {[
              { label: 'Member Since', value: '1 Jan, 2024' },
              { label: 'Last Login', value: 'Today, 9:00 AM' },
              { label: 'Status', value: 'Active' },
            ].map(info => (
              <div key={info.label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{info.label}</span>
                <span className={`text-xs font-medium ${info.label === 'Status' ? 'text-emerald-600' : 'text-gray-700'}`}>{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
