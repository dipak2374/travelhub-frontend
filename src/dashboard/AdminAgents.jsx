import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiUserPlus, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { authAPI } from '../services';
import Pagination from '../components/Pagination';
import { ROLE_LABELS } from '../utils/constants';

const AGENT_ROLES = ['travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'];

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [newAgent, setNewAgent] = useState({
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

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = {
        role: filter || undefined,
        page: currentPage,
        limit: 10,
      };
      const { data } = await authAPI.getUsers(params);
      const filtered = data.users.filter((user) => AGENT_ROLES.includes(user.role));
      setAgents(filtered);
      setTotalPages(data.pages || 1);
      setTotalAgents(filtered.length);
    } catch {
      toast.error('Failed to load agent accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, [filter, currentPage]);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: newAgent.name,
        email: newAgent.email,
        phone: newAgent.phone,
        password: newAgent.password,
        role: newAgent.role,
      };

      if (newAgent.role === 'travel_agency') {
        payload.agencyProfile = {
          companyName: newAgent.companyName,
          licenseNumber: newAgent.licenseNumber,
          address: newAgent.address,
          description: newAgent.description,
        };
      } else {
        payload.partnerProfile = {
          companyName: newAgent.companyName,
          address: newAgent.address,
          description: newAgent.description,
        };
      }

      await authAPI.createUser(payload);
      toast.success('Agent account created');
      setNewAgent({
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
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create agent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await authAPI.approvePartner(id);
      toast.success('Agent approved');
      fetchAgents();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await authAPI.updateUserStatus(id, { isActive: !isActive });
      toast.success('Status updated');
      fetchAgents();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Agent Management</h2>
            <p className="text-sm text-gray-500">Create and manage all agency and partner accounts from one page.</p>
          </div>
          <div className="flex items-center gap-3">
            <FiUserPlus className="text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Create Agent</span>
          </div>
        </div>

        <form onSubmit={handleCreateAgent} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Name</span>
            <input
              type="text"
              required
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              className="input-field w-full"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Email</span>
            <input
              type="email"
              required
              value={newAgent.email}
              onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              className="input-field w-full"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Phone</span>
            <input
              type="tel"
              value={newAgent.phone}
              onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
              className="input-field w-full"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={newAgent.password}
              onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
              className="input-field w-full"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Role</span>
            <select
              value={newAgent.role}
              onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
              className="input-field w-full"
            >
              {AGENT_ROLES.map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Company / Agency Name</span>
            <input
              type="text"
              required
              value={newAgent.companyName}
              onChange={(e) => setNewAgent({ ...newAgent, companyName: e.target.value })}
              className="input-field w-full"
            />
          </label>
          {newAgent.role === 'travel_agency' && (
            <label className="space-y-2 text-sm">
              <span className="font-medium text-gray-700">License Number</span>
              <input
                type="text"
                value={newAgent.licenseNumber}
                onChange={(e) => setNewAgent({ ...newAgent, licenseNumber: e.target.value })}
                className="input-field w-full"
              />
            </label>
          )}
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Address</span>
            <input
              type="text"
              value={newAgent.address}
              onChange={(e) => setNewAgent({ ...newAgent, address: e.target.value })}
              className="input-field w-full"
            />
          </label>
          <label className="space-y-2 text-sm lg:col-span-2 xl:col-span-3">
            <span className="font-medium text-gray-700">Description</span>
            <textarea
              rows={3}
              value={newAgent.description}
              onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              className="input-field w-full resize-none"
            />
          </label>
          <div className="lg:col-span-2 xl:col-span-3 flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary ml-auto">
              {submitting ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Agent Accounts</h3>
            <p className="text-sm text-gray-500">View all agency and partner accounts in the system.</p>
          </div>
          <div className="flex items-center gap-3">
            <FiSearch className="text-gray-400" />
            <select
              className="input-field w-full max-w-xs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Agent Roles</option>
              {AGENT_ROLES.map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : agents.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">No agent accounts found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agents.map((agent) => {
                  const profile = agent.role === 'travel_agency' ? agent.agencyProfile || {} : agent.partnerProfile || {};
                  return (
                    <tr key={agent._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                            {agent.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{agent.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{profile.companyName || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{agent.role?.replace(/_/g, ' ')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${agent.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {['travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'].includes(agent.role) && !agent.isVerified && (
                            <button onClick={() => handleApprove(agent._id)} className="text-xs text-primary-600 hover:underline font-medium">Approve</button>
                          )}
                          <button onClick={() => handleToggleActive(agent._id, agent.isActive)} className={`text-xs ${agent.isActive ? 'text-rose-600' : 'text-emerald-600'} hover:underline font-medium`}>
                            {agent.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1"><FiEdit2 size={16} /></button>
                          <button className="text-gray-400 hover:text-rose-600 p-1"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && agents.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalAgents)} of {totalAgents} agents
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAgents;
