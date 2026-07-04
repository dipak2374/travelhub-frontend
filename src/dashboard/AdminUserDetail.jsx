import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiUserCheck, FiShield, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { authAPI } from '../services';
import { formatDate } from '../utils/constants';

const AdminUserDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(new URLSearchParams(location.search).get('edit') === 'true');

  useEffect(() => {
    setIsEditing(new URLSearchParams(location.search).get('edit') === 'true');
  }, [location.search]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.getUser(id);
      setUser(data.user);
      setForm({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        agencyProfile: {
          companyName: data.user.agencyProfile?.companyName || '',
          address: data.user.agencyProfile?.address || '',
          description: data.user.agencyProfile?.description || '',
          licenseNumber: data.user.agencyProfile?.licenseNumber || '',
        },
        partnerProfile: {
          companyName: data.user.partnerProfile?.companyName || '',
          address: data.user.partnerProfile?.address || '',
          description: data.user.partnerProfile?.description || '',
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const toggleStatus = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const { data } = await authAPI.updateUserStatus(user._id, { isActive: !user.isActive });
      setUser(data.user);
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const approveUser = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const { data } = await authAPI.approvePartner(user._id);
      setUser(data.user);
      toast.success('Partner approved');
    } catch {
      toast.error('Failed to approve partner');
    } finally {
      setUpdating(false);
    }
  };

  const saveChanges = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };

      if (user.role === 'travel_agency') {
        payload.agencyProfile = {
          companyName: form.agencyProfile.companyName,
          address: form.agencyProfile.address,
          description: form.agencyProfile.description,
          licenseNumber: form.agencyProfile.licenseNumber,
        };
      }

      if (['car_rental_partner', 'bus_operator', 'airline_partner'].includes(user.role)) {
        payload.partnerProfile = {
          companyName: form.partnerProfile.companyName,
          address: form.partnerProfile.address,
          description: form.partnerProfile.description,
        };
      }

      const { data } = await authAPI.updateUser(user._id, payload);
      setUser(data.user);
      setIsEditing(false);
      toast.success('User details updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save changes');
    } finally {
      setUpdating(false);
    }
  };

  const deleteUser = async () => {
    if (!user || !confirm('Delete this user?')) return;
    setUpdating(true);
    try {
      await authAPI.deleteUser(user._id);
      toast.success('User deleted');
      navigate('/dashboard/admin/users');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100/50">
        <p className="text-gray-500">User not found.</p>
      </div>
    );
  }

  const isPartner = ['travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'].includes(user.role);
  const approvalPending = isPartner && !user.isVerified;
  const approvalRequired = user.role === 'travel_agency'
    ? user.agencyProfile?.isApproved === false
    : user.partnerProfile?.isApproved === false;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <FiArrowLeft /> Back
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Detail</h1>
            <p className="text-sm text-gray-500">Review and manage user account details.</p>
          </div>
        </div>
          <div className="flex flex-wrap gap-3">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                <FiEdit2 /> Edit
              </button>
              <button onClick={deleteUser} disabled={updating} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50">
                <FiTrash2 /> Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={saveChanges} disabled={updating} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50">
                <FiCheckCircle /> Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} disabled={updating} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
            </>
          )}
          <button onClick={toggleStatus} disabled={updating} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50">
            {user.isActive ? <FiXCircle /> : <FiCheckCircle />} {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
          {approvalRequired && (
            <button onClick={approveUser} disabled={updating} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50">
              <FiUserCheck /> Approve Partner
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{user.name}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{user.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
                <p className="mt-1 font-medium text-gray-900 capitalize">{user.role?.replace(/_/g, ' ')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Account status</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Verified</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Last updated</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner / Agency Details</h2>
          {isPartner ? (
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Company Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.role === 'travel_agency' ? form.agencyProfile.companyName : form.partnerProfile.companyName}
                    onChange={(e) => setForm({
                      ...form,
                      [user.role === 'travel_agency' ? 'agencyProfile' : 'partnerProfile']: {
                        ...form[user.role === 'travel_agency' ? 'agencyProfile' : 'partnerProfile'],
                        companyName: e.target.value,
                      },
                    })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{user.agencyProfile?.companyName || user.partnerProfile?.companyName || 'Not provided'}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.role === 'travel_agency' ? form.agencyProfile.address : form.partnerProfile.address}
                    onChange={(e) => setForm({
                      ...form,
                      [user.role === 'travel_agency' ? 'agencyProfile' : 'partnerProfile']: {
                        ...form[user.role === 'travel_agency' ? 'agencyProfile' : 'partnerProfile'],
                        address: e.target.value,
                      },
                    })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{user.agencyProfile?.address || user.partnerProfile?.address || 'Not provided'}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Approval</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${approvalRequired ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {approvalRequired ? 'Approval required' : 'Approved'}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={user.role === 'travel_agency' ? form.agencyProfile.description : form.partnerProfile.description}
                    onChange={(e) => setForm({
                      ...form,
                      [user.role === 'travel_agency' ? 'agencyProfile' : 'partnerProfile']: {
                        ...form[user.role === 'travel_agency' ? 'agencyProfile' : 'partnerProfile'],
                        description: e.target.value,
                      },
                    })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{user.agencyProfile?.description || user.partnerProfile?.description || 'No description available'}</p>
                )}
              </div>
              {user.role === 'travel_agency' && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">License</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={form.agencyProfile.licenseNumber}
                      onChange={(e) => setForm({
                        ...form,
                        agencyProfile: {
                          ...form.agencyProfile,
                          licenseNumber: e.target.value,
                        },
                      })}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-900">{user.agencyProfile.licenseNumber || 'Not provided'}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">This user does not have partner or agency profile details.</p>
          )}
        </div>
      </div>

      {approvalPending && (
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 text-yellow-900">
          <div className="flex items-start gap-3">
            <FiShield size={20} className="mt-1" />
            <div>
              <h3 className="font-semibold">Partner verification pending</h3>
              <p className="text-sm text-yellow-800">The account has not completed partner verification. Approve the user if the profile information is valid.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;
