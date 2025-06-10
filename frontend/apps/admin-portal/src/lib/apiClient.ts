/**
 * API Client for admin-portal
 * Handles all backend communication with proper error handling
 */

class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData = null;
        
        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON
        }
        
        throw new APIError(errorMessage, response.status, errorData);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError(`Network error: ${error.message}`, 0, null);
    }
  }

  async get(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseURL);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    return this.request(url.pathname + url.search);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
export const apiClient = new APIClient();
export { APIError };

// Domain-specific API methods
export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    logout: () => apiClient.post('/api/auth/logout'),
    getUser: () => apiClient.get('/api/auth/user'),
    refreshToken: () => apiClient.post('/api/auth/refresh'),
  },

  // Users and Roles
  users: {
    getAll: (params) => apiClient.get('/api/users', params),
    getById: (id) => apiClient.get(`/api/users/${id}`),
    create: (userData) => apiClient.post('/api/users', userData),
    update: (id, userData) => apiClient.put(`/api/users/${id}`, userData),
    delete: (id) => apiClient.delete(`/api/users/${id}`),
    getRoles: () => apiClient.get('/api/users/roles'),
    assignRole: (userId, roleId) => apiClient.post(`/api/users/${userId}/roles`, { roleId }),
  },

  // Products and Catalog
  catalog: {
    getProducts: (params) => apiClient.get('/api/catalog/products', params),
    getProduct: (id) => apiClient.get(`/api/catalog/products/${id}`),
    createProduct: (productData) => apiClient.post('/api/catalog/products', productData),
    updateProduct: (id, productData) => apiClient.put(`/api/catalog/products/${id}`, productData),
    deleteProduct: (id) => apiClient.delete(`/api/catalog/products/${id}`),
    getCategories: () => apiClient.get('/api/catalog/categories'),
    createCategory: (categoryData) => apiClient.post('/api/catalog/categories', categoryData),
  },

  // Orders
  orders: {
    getAll: (params) => apiClient.get('/api/orders', params),
    getById: (id) => apiClient.get(`/api/orders/${id}`),
    create: (orderData) => apiClient.post('/api/orders', orderData),
    update: (id, orderData) => apiClient.put(`/api/orders/${id}`, orderData),
    updateStatus: (id, status) => apiClient.patch(`/api/orders/${id}/status`, { status }),
    cancel: (id) => apiClient.post(`/api/orders/${id}/cancel`),
  },

  // Inventory
  inventory: {
    getAll: (params) => apiClient.get('/api/inventory', params),
    getById: (id) => apiClient.get(`/api/inventory/${id}`),
    updateStock: (id, quantity) => apiClient.patch(`/api/inventory/${id}/stock`, { quantity }),
    getLowStock: () => apiClient.get('/api/inventory/low-stock'),
    addStock: (productId, quantity) => apiClient.post('/api/inventory/add-stock', { productId, quantity }),
  },

  // Payments
  payments: {
    getAll: (params) => apiClient.get('/api/payments', params),
    getById: (id) => apiClient.get(`/api/payments/${id}`),
    processPayment: (paymentData) => apiClient.post('/api/payments/process', paymentData),
    refund: (id, amount) => apiClient.post(`/api/payments/${id}/refund`, { amount }),
    getPaymentMethods: () => apiClient.get('/api/payments/methods'),
  },

  // Analytics
  analytics: {
    getDashboard: () => apiClient.get('/api/analytics/dashboard'),
    getSales: (params) => apiClient.get('/api/analytics/sales', params),
    getCustomers: (params) => apiClient.get('/api/analytics/customers', params),
    getProducts: (params) => apiClient.get('/api/analytics/products', params),
    getRevenue: (params) => apiClient.get('/api/analytics/revenue', params),
  },

  // Multi-language
  languages: {
    getAll: () => apiClient.get('/api/languages'),
    getTranslations: (languageCode) => apiClient.get(`/api/languages/${languageCode}/translations`),
    addTranslation: (languageCode, key, value) => 
      apiClient.post(`/api/languages/${languageCode}/translations`, { key, value }),
    updateTranslation: (languageCode, key, value) => 
      apiClient.put(`/api/languages/${languageCode}/translations/${key}`, { value }),
  },

  // Notifications
  notifications: {
    getAll: (params) => apiClient.get('/api/notifications', params),
    getById: (id) => apiClient.get(`/api/notifications/${id}`),
    markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),
    markAllAsRead: () => apiClient.patch('/api/notifications/read-all'),
    send: (notificationData) => apiClient.post('/api/notifications/send', notificationData),
  }
};
