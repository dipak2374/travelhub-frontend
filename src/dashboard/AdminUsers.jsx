import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiUserPlus, FiMoreVertical, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { authAPI } from '../services';
import Pagination from '../components/Pagination';
import { ROLE_LABELS } from '../utils/constants';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'travel_agency',
    companyName: '',
    licenseNumber: '',
    address: '',
    description: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (filter) params.role = filter;
      if (search) params.search = search;
      const { data } = await authAPI.getUsers(params);
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
      setTotalUsers(data.total || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  useEffect(() => {
    fetchUsers();
  }, [filter, search, currentPage]);

  const handleApprove = async (id) => {
    try {
      await authAPI.approvePartner(id);
      toast.success('Partner approved');
      fetchUsers();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await authAPI.updateUserStatus(id, { isActive: !isActive });
      toast.success('Status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await authAPI.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
      };

      if (newUser.role === 'travel_agency') {
        payload.agencyProfile = {
          companyName: newUser.companyName,
          licenseNumber: newUser.licenseNumber,
          address: newUser.address,
          description: newUser.description,
        };
      } else if (['car_rental_partner', 'bus_operator', 'airline_partner'].includes(newUser.role)) {
        payload.partnerProfile = {
          companyName: newUser.companyName,
          address: newUser.address,
          description: newUser.description,
        };
      }

      await authAPI.createUser(payload);
      toast.success('User created successfully');
      setShowForm(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'travel_agency',
        companyName: '',
        licenseNumber: '',
        address: '',
        description: '',
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header and Controls */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Users</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or phone"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64"
              />
            </div>
            
            <select 
              className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-transparent"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              {Object.entries(ROLE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <FiUserPlus /> Add User
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No users found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
                    <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.phone || '+1 987 654 3210'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{u.role?.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {(['travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'].includes(u.role)) && (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'travel_agency'
                            ? (u.agencyProfile?.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700')
                            : (u.partnerProfile?.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700')
                          }`}>
                            {u.role === 'travel_agency'
                              ? (u.agencyProfile?.isApproved ? 'Agency approved' : 'Approval pending')
                              : (u.partnerProfile?.isApproved ? 'Partner approved' : 'Approval pending')
                            }
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {['travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'].includes(u.role) && !u.isVerified && (
                          <button onClick={() => handleApprove(u._id)} className="text-xs text-primary-600 hover:underline font-medium">Approve</button>
                        )}
                        <button onClick={() => handleToggleActive(u._id, u.isActive)} className={`text-xs ${u.isActive ? 'text-rose-600' : 'text-emerald-600'} hover:underline font-medium`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => navigate(`/dashboard/admin/users/${u._id}`)} className="text-xs text-blue-600 hover:underline font-medium">View</button>
                        <button onClick={() => navigate(`/dashboard/admin/users/${u._id}?edit=true`)} className="text-gray-400 hover:text-gray-600 p-1"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-gray-400 hover:text-rose-600 p-1"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination Footer */}
      {!loading && users.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
          </p>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
                <p className="text-sm text-gray-500">Create a travel agent or partner account from the admin panel.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-gray-700">Full Name</span>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="input-field w-full"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-gray-700">Email</span>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="input-field w-full"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-gray-700">Phone</span>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="input-field w-full"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-gray-700">Password</span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="input-field w-full"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-medium text-gray-700">Role</span>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="input-field w-full"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>

              {newUser.role === 'travel_agency' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-gray-700">Agency Name</span>
                    <input
                      type="text"
                      required
                      value={newUser.companyName}
                      onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                      className="input-field w-full"
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-gray-700">License Number</span>
                    <input
                      type="text"
                      value={newUser.licenseNumber}
                      onChange={(e) => setNewUser({ ...newUser, licenseNumber: e.target.value })}
                      className="input-field w-full"
                    />
                  </label>
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="font-medium text-gray-700">Address</span>
                    <input
                      type="text"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      className="input-field w-full"
                    />
                  </label>
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="font-medium text-gray-700">Description</span>
                    <textarea
                      rows={3}
                      value={newUser.description}
                      onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
                      className="input-field w-full resize-none"
                    />
                  </label>
                </div>
              )}
              {['car_rental_partner', 'bus_operator', 'airline_partner'].includes(newUser.role) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-gray-700">Partner Company Name</span>
                    <input
                      type="text"
                      required
                      value={newUser.companyName}
                      onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                      className="input-field w-full"
                    />
                  </label>
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="font-medium text-gray-700">Address</span>
                    <input
                      type="text"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      className="input-field w-full"
                    />
                  </label>
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="font-medium text-gray-700">Description</span>
                    <textarea
                      rows={3}
                      value={newUser.description}
                      onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
                      className="input-field w-full resize-none"
                    />
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                  {submitting ? 'Saving...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
