import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Auth token validation failed:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for unauthorized events from api interceptor
    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const demoLogin = async (role = 'customer') => {
    const res = await authService.demoLogin(role);
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Demo login failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserEcoStats = (pointsEarned) => {
    if (!user) return;
    setUser((prev) => {
      const newPoints = (prev.ecoPoints || 0) + pointsEarned;
      let newStage = 'Seed';
      if (newPoints >= 600) newStage = 'Earth Keeper';
      else if (newPoints >= 300) newStage = 'Grower';
      else if (newPoints >= 100) newStage = 'Sprout';

      return {
        ...prev,
        ecoPoints: newPoints,
        ecoJourneyStage: newStage,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        demoLogin,
        logout,
        updateUserEcoStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
