import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  sendOTP: (email) => api.post('/auth/otp/send', { email }),
  verifyOTP: (data) => api.post('/auth/otp/verify', data),
  resetPassword: (data) => api.post('/auth/password/reset', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUsers: (params) => api.get('/auth/users', { params }),
  getUser: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  createUser: (data) => api.post('/auth/users', data),
  updateUserStatus: (id, data) => api.put(`/auth/users/${id}/status`, data),
  approvePartner: (id) => api.put(`/auth/users/${id}/approve`),
};

export const hotelAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getOne: (id) => api.get(`/hotels/${id}`),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
  getMy: () => api.get('/hotels/my'),
  approve: (id) => api.put(`/hotels/${id}/approve`),
};

export const flightAPI = {
  getAll: (params) => api.get('/flights', { params }),
  getOne: (id) => api.get(`/flights/${id}`),
  create: (data) => api.post('/flights', data),
  update: (id, data) => api.put(`/flights/${id}`, data),
  delete: (id) => api.delete(`/flights/${id}`),
  getMy: () => api.get('/flights/my'),
  approve: (id) => api.put(`/flights/${id}/approve`),
};

export const busAPI = {
  getAll: (params) => api.get('/buses', { params }),
  getOne: (id) => api.get(`/buses/${id}`),
  create: (data) => api.post('/buses', data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  delete: (id) => api.delete(`/buses/${id}`),
  getMy: () => api.get('/buses/my'),
  approve: (id) => api.put(`/buses/${id}/approve`),
};

export const carAPI = {
  getAll: (params) => api.get('/cars', { params }),
  getOne: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
  getMy: () => api.get('/cars/my'),
  approve: (id) => api.put(`/cars/${id}/approve`),
};

export const tourAPI = {
  getAll: (params) => api.get('/tours', { params }),
  getOne: (id) => api.get(`/tours/${id}`),
  create: (data) => api.post('/tours', data),
  update: (id, data) => api.put(`/tours/${id}`, data),
  delete: (id) => api.delete(`/tours/${id}`),
  getMy: () => api.get('/tours/my'),
  approve: (id) => api.put(`/tours/${id}/approve`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  getPartner: (params) => api.get('/bookings/partner', { params }),
  getAll: (params) => api.get('/bookings', { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  requestRefund: (id) => api.post(`/bookings/${id}/refund`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  createPayment: (data) => api.post('/bookings/payment/create-order', data),
  verifyPayment: (data) => api.post('/bookings/payment/verify', data),
  getStats: () => api.get('/bookings/stats'),
};

export const reviewAPI = {
  get: (itemModel, itemId) => api.get(`/reviews/${itemModel}/${itemId}`),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const couponAPI = {
  getAll: () => api.get('/coupons'),
  validate: (data) => api.post('/coupons/validate', data),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (itemId, itemModel) => api.post('/wishlist/toggle', { itemId, itemModel }),
};
