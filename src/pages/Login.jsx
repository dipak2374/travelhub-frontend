import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser, clearError, googleSignIn } from '../redux/slices/authSlice';
import { useEffect } from 'react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (form.password.trim().length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const { getDashboardPath } = await import('../utils/constants');
      navigate(getDashboardPath(result.payload.user.role));
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const handleOTPSend = async () => {
    if (!form.email.trim()) {
      toast.error('Please enter your email first');
      return;
    }

    try {
      const { authAPI } = await import('../services');
      const { data } = await authAPI.sendOTP(form.email.trim());
      setOtpMode(true);
      toast.success(data.message || 'OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    dispatch(clearError());
    const result = await dispatch(googleSignIn({ idToken: response.credential }));
    if (googleSignIn.fulfilled.match(result)) {
      toast.success('Signed in with Google');
      const { getDashboardPath } = await import('../utils/constants');
      navigate(getDashboardPath(result.payload.user.role));
    } else {
      toast.error(result.payload || 'Google sign-in failed');
    }
  };

  useEffect(() => {
    window.__handleGoogleCredential = handleCredentialResponse;
    const loadGsi = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return;
      const mount = document.getElementById('googleSignInDiv');
      if (!mount) return;
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({ client_id: clientId, callback: (resp) => window.__handleGoogleCredential(resp) });
          window.google.accounts.id.renderButton(mount, { theme: 'outline', size: 'large', width: '100%' });
          return;
        } catch (e) {
          // fallthrough to load script
        }
      }

      if (!document.getElementById('gsi-script')) {
        const script = document.createElement('script');
        script.id = 'gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
          if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.initialize({ client_id: clientId, callback: (resp) => window.__handleGoogleCredential(resp) });
            window.google.accounts.id.renderButton(mount, { theme: 'outline', size: 'large', width: '100%' });
          }
        };
        document.head.appendChild(script);
      }
    };

    loadGsi();
    return () => { if (window.__handleGoogleCredential === handleCredentialResponse) window.__handleGoogleCredential = null; };
  }, []);

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      const { verifyOTPUser } = await import('../redux/slices/authSlice');
      const result = await dispatch(verifyOTPUser({ email: form.email, otp }));
      if (verifyOTPUser.fulfilled.match(result)) {
        toast.success('Login successful!');
        const { getDashboardPath } = await import('../utils/constants');
        navigate(getDashboardPath(result.payload.user.role));
      } else {
        toast.error(result.payload || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your TravelHub account</p>
        </div>

        <div className="card p-8">
          {!otpMode ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div id="googleSignInDiv" className="mt-4 flex justify-center"></div>
            </form>
          ) : (
            <form onSubmit={handleOTPVerify} className="space-y-5">
              <p className="text-sm text-gray-500">Enter the 6-digit OTP sent to {form.email}</p>
              <input
                type="text"
                maxLength={6}
                required
                className="input-field text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="submit" className="btn-primary w-full">Verify OTP</button>
              <button type="button" onClick={() => setOtpMode(false)} className="btn-secondary w-full text-sm">
                Back to Password Login
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
