import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {

      // const foundUser = mockUsers[credentials.email];
      const foundUser = await authService.login(credentials.email, credentials.password);
      localStorage.setItem('accessToken', foundUser.token);
      
      if (!foundUser || !foundUser.token) {
        throw new Error('Invalid credentials');
      }

      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  const hasRole = (allowedRoles) => {
  if (!user?.roles) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;

  return allowedRoles.some(role => user.roles.includes(role));
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
