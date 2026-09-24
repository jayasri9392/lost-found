import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    authService.clearSession();
    setUser(null);
    setToken(null);
  };

  // Verify stored session on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            authService.saveSession(storedToken, res.data);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error('[AuthContext] Session expired or invalid:', err.message);
          handleLogout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Log in user
   */
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const { token: receivedToken, ...userData } = res.data;
        authService.saveSession(receivedToken, userData);
        setToken(receivedToken);
        setUser(userData);
        return { success: true, message: res.message, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to connect to the server. Please check your connection.';
      return { success: false, message };
    }
  };

  /**
   * Register user
   */
  const register = async (name, email, password, confirmPassword) => {
    try {
      const res = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });
      if (res.success && res.data) {
        const { token: receivedToken, ...userData } = res.data;
        authService.saveSession(receivedToken, userData);
        setToken(receivedToken);
        setUser(userData);
        return { success: true, message: res.message, user: userData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to connect to the server. Please check your connection.';
      return { success: false, message };
    }
  };

  /**
   * Log out user
   */
  const logout = () => {
    handleLogout();
  };


  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
