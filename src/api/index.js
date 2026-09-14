import { apiRequest } from './client';

export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: data }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (data) => apiRequest('/auth/profile', { method: 'PATCH', body: data }),
  changePassword: (data) => apiRequest('/auth/change-password', { method: 'PATCH', body: data }),
};

export const menuApi = {
  getCategories: () => apiRequest('/categories'),
  getCategory: (id) => apiRequest(`/categories/${id}`),
  createCategory: (data) => apiRequest('/categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => apiRequest(`/categories/${id}`, { method: 'PATCH', body: data }),
  deleteCategory: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),

  getMenuItems: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    const qs = query.toString();
    return apiRequest(`/menu${qs ? `?${qs}` : ''}`);
  },
  getMenuItem: (id) => apiRequest(`/menu/${id}`),
  createMenuItem: (data) => apiRequest('/menu', { method: 'POST', body: data }),
  updateMenuItem: (id, data) => apiRequest(`/menu/${id}`, { method: 'PATCH', body: data }),
  deleteMenuItem: (id) => apiRequest(`/menu/${id}`, { method: 'DELETE' }),
};

export const cartApi = {
  calculate: (data) => apiRequest('/cart/calculate', { method: 'POST', body: data }),
};

export const orderApi = {
  create: (data) => apiRequest('/orders', { method: 'POST', body: data }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  track: (orderNumber) => apiRequest(`/orders/track/${orderNumber}`),
  getById: (id) => apiRequest(`/orders/${id}`),
  list: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    const qs = query.toString();
    return apiRequest(`/orders${qs ? `?${qs}` : ''}`);
  },
  update: (id, data) => apiRequest(`/orders/${id}`, { method: 'PATCH', body: data }),
  cancel: (id) => apiRequest(`/orders/${id}/cancel`, { method: 'PATCH' }),
  delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
};

export const paymentApi = {
  initialize: (data) => apiRequest('/payments/initialize', { method: 'POST', body: data }),
  verify: (reference) => apiRequest(`/payments/verify/${encodeURIComponent(reference)}`),
};

export const reviewApi = {
  getByMenuItem: (menuItemId) => apiRequest(`/reviews/menu-item/${menuItemId}`),
  create: (data) => apiRequest('/reviews', { method: 'POST', body: data }),
};

export const favoriteApi = {
  list: () => apiRequest('/favorites'),
  toggle: (menuItemId) => apiRequest(`/favorites/toggle/${menuItemId}`, { method: 'POST' }),
};

export const dashboardApi = {
  getStats: () => apiRequest('/dashboard/stats'),
  getCustomers: () => apiRequest('/dashboard/customers'),
};
