import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { registerUser, clearError, googleSignIn } from '../redux/slices/authSlice';
import { ROLE_LABELS, getDashboardPath } from '../utils/constants';
import GoogleAuthButton from '../components/Buttons/GoogleAuthButton';

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
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const isAgency = form.role === 'travel_agency';
  const isPartner = ['car_rental_partner', 'bus_operator', 'airline_partner'].includes(form.role);

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, phone: digitsOnly });
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      e.target.setCustomValidity('Phone number must be exactly 10 digits');
    } else {
      setPhoneError('');
      e.target.setCustomValidity('');
    }
  };

  const handlePasswordChange = (e) => {
    const nextPassword = e.target.value;
    setForm({ ...form, password: nextPassword });

    if (nextPassword.length === 0) {
      setPasswordError('');
      e.target.setCustomValidity('');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(nextPassword)) {
      setPasswordError('Password must be at least 8 characters, start with an uppercase letter, and include one special character');
      e.target.setCustomValidity('Password must be at least 8 characters, start with an uppercase letter, and include one special character');
    } else {
      setPasswordError('');
      e.target.setCustomValidity('');
    }
  };

  const handleGoogleSuccess = async (response) => {
    dispatch(clearError());
    const result = await dispatch(googleSignIn({ idToken: response.credential }));
    if (googleSignIn.fulfilled.match(result)) {
      toast.success('Signed in with Google');
      navigate(getDashboardPath(result.payload.user.role));
    } else {
      toast.error(result.payload || 'Google sign-in failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!/^\d{10}$/.test(form.phone)) {
      setPhoneError('Phone number must be exactly 10 digits');
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setPasswordError('Password must be at least 8 characters, start with an uppercase letter, and include one special character');
      toast.error('Password must be at least 8 characters, start with an uppercase letter, and include one special character');
      return;
    }

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
              <input
                type="tel"
                inputMode="numeric"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                title="Enter exactly 10 digits"
                className="input-field"
                value={form.phone}
                onChange={handlePhoneChange}
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
                title="Must be at least 8 characters, start with an uppercase letter, and include one special character"
                className="input-field"
                value={form.password}
                onChange={handlePasswordChange}
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
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
            <div className="mt-4">
              <GoogleAuthButton onSuccess={handleGoogleSuccess} />
            </div>
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
