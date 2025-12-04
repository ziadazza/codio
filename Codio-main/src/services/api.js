const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('admin_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      console.log('Using token:', token);
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        throw new Error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في الخادم');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: {
        username: credentials.username,
        password: credentials.password
      },
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/user');
  }

  // Business Requests
  async getBusinessRequests(params = {}) {
    console.log('Params for getBusinessRequests:', params);
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/business-requests?${queryString}`);
    // أضف هذا في بداية دالة getBusinessRequests
console.log('Fetching business requests from:', `${this.baseURL}/business-requests`);
    return {
      data: response.data || [],
      pagination: response.pagination
    };
  }

  async getBusinessRequest(id) {
    return this.request(`/business-requests/${id}`);
  }

  async createBusinessRequest(data) {
    return this.request('/business-requests', {
      method: 'POST',
      body: data,
    });
  }

  async updateBusinessRequest(id, data) {
    return this.request(`/business-requests/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteBusinessRequest(id) {
    return this.request(`/business-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async updateBusinessRequestStatus(id, status) {
    return this.request(`/business-requests/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }

  // Users
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/users?${queryString}`);
    return {
      data: response.data || [],
      pagination: response.pagination
    };
  }

  async createUser(data) {
    return this.request('/users', {
      method: 'POST',
      body: data,
    });
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Advertisements
  async getAdvertisements(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.request(`/advertisements?${queryString}`);
    return {
      data: response.data || [],
      pagination: response.pagination
    };
  }

  async createAdvertisement(data) {
    return this.request('/advertisements', {
      method: 'POST',
      body: data,
    });
  }

  async updateAdvertisement(id, data) {
    return this.request(`/advertisements/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteAdvertisement(id) {
    return this.request(`/advertisements/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics
  async getStats() {
    return this.request('/stats');
  }

  // Upload
  async uploadFile(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/upload`, config);
      
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        throw new Error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في رفع الملف');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();

export default apiService;