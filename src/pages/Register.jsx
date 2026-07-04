import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { ROLE_LABELS, getDashboardPath } from '../utils/constants';

const roles = ['customer', 'travel_agency', 'car_rental_partner', 'bus_operator', 'airline_partner'];

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const defaultRole = roles.includes(roleParam) ? roleParam : 'customer';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: defaultRole,
    companyName: '',
    licenseNumber: '',
    description: '',
    address: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const isAgency = form.role === 'travel_agency';
  const isPartner = ['car_rental_partner', 'bus_operator', 'airline_partner'].includes(form.role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
    };

    if (isAgency) {
      payload.agencyProfile = {
        companyName: form.companyName,
        licenseNumber: form.licenseNumber,
        description: form.description,
        address: form.address,
      };
    }

    if (isPartner) {
      payload.partnerProfile = {
        companyName: form.companyName,
        description: form.description,
        address: form.address,
      };
    }

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate(getDashboardPath(result.payload.user.role));
    } else {
      const message = result.payload || result.error?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 mt-2">Join TravelHub and start exploring</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input type="text" required className="input-field" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" required className="input-field" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input type="tel" className="input-field" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input type="password" required minLength={6} className="input-field" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Account Type</label>
              <select className="input-field" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>

            {(isAgency || isPartner) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Company Name</label>
                  <input type="text" required className="input-field" value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                {isAgency && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">License Number</label>
                    <input type="text" required className="input-field" value={form.licenseNumber}
                      onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Company Description</label>
                  <textarea rows={3} required className="input-field" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Business Address</label>
                  <input type="text" required className="input-field" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
