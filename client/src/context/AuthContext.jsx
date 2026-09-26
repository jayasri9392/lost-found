import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize directly from localStorage so first render is already correct
  const [user, setUser] = useState(authService.getUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    authService.clearSession();
    setUser(null);
    setToken(null);
  };

  // Verify the stored session is still valid on every app mount/refresh
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
              // Always re-sync both user AND token state from storage
              setUser(res.data);
              setToken(storedToken);
              authService.saveSession(storedToken, res.data);
            } else {
              handleLogout();
            }
          }
        } catch (err) {
          if (!isMounted) return;

          if (err.response && err.response.status === 401) {
            // Token explicitly rejected by server — clear everything
            console.warn('[AuthContext] Session expired or invalid token — logging out');
            handleLogout();
          } else {
            // Network error / cold-start timeout — preserve cached session so
            // the user isn't logged out just because the server was slow
            console.warn(
              '[AuthContext] Network or cold-start error, retaining cached session:',
              err.message
            );
            if (storedUser && storedToken) {
              setUser(storedUser);
              setToken(storedToken);
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
   * Log in user — saves session and updates React state
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
   * Register user — auto-logs in after success
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
   * Log out user — clears both server session and local state
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout API errors — local state clear is primary
    } finally {
      handleLogout();
    }
  };

  // isAuthenticated is true only when BOTH user object AND token exist
  const isAuthenticated = Boolean(user && token);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
