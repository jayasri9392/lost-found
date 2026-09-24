import API from './api';

const TOKEN_KEY = 'ilfn_token';
const USER_KEY = 'ilfn_user';

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, confirmPassword }
   */
  async register(userData) {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Fetch currently authenticated user
   */
  async getMe() {
    const response = await API.get('/auth/me');
    return response.data;
  },

  /**
   * Save session in localStorage
   */
  saveSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Log out user - attempt backend notification and clear local session
   */
  async logout() {
    try {
      await API.post('/auth/logout');
    } catch {
      // Ignored - local session clear is the primary action
    } finally {
      this.clearSession();
    }
  },

  /**
   * Remove session from localStorage
   */
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user
   */
  getUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
};

export default authService;
