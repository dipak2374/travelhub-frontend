import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    const message = error.customMessage || error.response?.data?.message || 'Login failed';
    return rejectWithValue(message);
  }
});

export const verifyOTPUser = createAsyncThunk('auth/verifyOTP', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.verifyOTP(credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    const message = error.customMessage || error.response?.data?.message || 'Invalid OTP';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    const message = error.customMessage || error.response?.data?.message || error.message || 'Registration failed';
    return rejectWithValue(message);
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.getMe();
    return data.user;
  } catch (error) {
    localStorage.removeItem('token');
    const message = error.customMessage || error.response?.data?.message || error.message || 'Unable to fetch user';
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTPUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOTPUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(verifyOTPUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Registration failed';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
