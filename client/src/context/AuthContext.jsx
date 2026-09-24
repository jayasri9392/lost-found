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
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (isMounted) {
            if (res.success && res.data) {
              setUser(res.data);
              authService.saveSession(storedToken, res.data);
            } else {
              handleLogout();
            }
          }
        } catch (err) {
          // Only clear session if explicitly unauthorized (token invalid/expired)
          if (err.response && err.response.status === 401) {
            console.warn('[AuthContext] Session expired or invalid token');
            if (isMounted) handleLogout();
          } else {
            // Server might be cold-starting or temporary network glitch: preserve existing cached user
            console.warn('[AuthContext] Network or cold-start error during verify, retaining cached session:', err.message);
            if (isMounted && storedUser) {
              setUser(storedUser);
            }
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
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
        error.customMessage ||
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
        error.customMessage ||
        error.message ||
        'Unable to connect to the server. Please check your connection.';
      return { success: false, message };
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      handleLogout();
    }
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
