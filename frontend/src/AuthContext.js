import React, { createContext, useState, useEffect } from 'react';
import api from './services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tự động kiểm tra đăng nhập khi vừa vào web
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('ichi_token');
        if (token) {
          const res = await api.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.user);
          }
        }
      } catch (error) {
        console.error("Auth Error:", error);
        localStorage.removeItem('ichi_token');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('ichi_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ichi_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
