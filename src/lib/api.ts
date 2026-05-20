const API_BASE_URL = 'https://f1-api-fux7.onrender.com';

class ApiClient {
  private token: string | null = null;

  getToken(): string | null {
    return localStorage.getItem('access_token') || localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_token');
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      this.clearToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
export const api = apiClient;