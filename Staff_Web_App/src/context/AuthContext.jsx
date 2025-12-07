import React, { createContext, useContext, useState, useEffect } from 'react';

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
      // In production, this would be an API call
      // For demo, using mock authentication
      const mockUsers = {
        'admin@hospital.com': { 
          id: 1, 
          name: 'Dr. Sarah Johnson', 
          email: 'admin@hospital.com', 
          role: 'admin',
          password: 'admin123'
        },
        'doctor@hospital.com': { 
          id: 2, 
          name: 'Dr. Michael Chen', 
          email: 'doctor@hospital.com', 
          role: 'doctor',
          password: 'doctor123'
        },
        'radiologist@hospital.com': { 
          id: 3, 
          name: 'Dr. Emily Davis', 
          email: 'radiologist@hospital.com', 
          role: 'radiologist',
          password: 'radio123'
        },
        'finance@hospital.com': { 
          id: 4, 
          name: 'Robert Martinez', 
          email: 'finance@hospital.com', 
          role: 'finance',
          password: 'finance123'
        },
        'management@hospital.com': { 
          id: 5, 
          name: 'Jennifer Lee', 
          email: 'management@hospital.com', 
          role: 'management',
          password: 'manage123'
        },
      };

      const foundUser = mockUsers[credentials.email];
      
      if (!foundUser || foundUser.password !== credentials.password) {
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
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
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
