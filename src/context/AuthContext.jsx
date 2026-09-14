import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('aura_access_token');
      if (token) {
        try {
          const res = await authApi.getProfile();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('aura_user', JSON.stringify(res.data));
          }
        } catch (e) {
          // If token expired, clear
          localStorage.removeItem('aura_access_token');
          localStorage.removeItem('aura_refresh_token');
          localStorage.removeItem('aura_user');
          setUser(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { user: userData, accessToken, refreshToken } = res.data;
    localStorage.setItem('aura_access_token', accessToken);
    localStorage.setItem('aura_refresh_token', refreshToken);
    localStorage.setItem('aura_user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.fullName}!`);
    return userData;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const userData = res.data;
    if (userData.accessToken) {
      localStorage.setItem('aura_access_token', userData.accessToken);
      localStorage.setItem('aura_refresh_token', userData.refreshToken);
      localStorage.setItem('aura_user', JSON.stringify(userData));
      setUser(userData);
    }
    toast.success('Account created successfully!');
    return userData;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('aura_access_token');
    localStorage.removeItem('aura_refresh_token');
    localStorage.removeItem('aura_user');
    setUser(null);
    toast.info('Logged out successfully.');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('aura_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStaff = ['ADMIN', 'WAITER', 'KITCHEN_STAFF'].includes(user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isStaff,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
