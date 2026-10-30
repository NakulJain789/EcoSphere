import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error unwrapping
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    // If 401 Unauthorized, dispatch event or handle token expiry
    if (error.response?.status === 401) {
      // Don't auto-clear if it's an attempted login failure
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    return Promise.reject(new Error(customMessage));
  }
);

// Auth Service
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  demoLogin: (role = 'customer') => api.post('/auth/demo-login', { role }),
};

// Products Service
export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getPicks: () => api.get('/products/picks'),
  getAlternatives: (id) => api.get(`/products/${id}/alternatives`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Orders Service
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/myorders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrders: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Wishlist Service
export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

// Reviews Service
export const reviewService = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (productId, data) => api.post(`/reviews/${productId}`, data),
};

// Challenges Service
export const challengeService = {
  getChallenges: () => api.get('/challenges'),
  completeChallenge: (id) => api.post(`/challenges/${id}/complete`),
};

export default api;
