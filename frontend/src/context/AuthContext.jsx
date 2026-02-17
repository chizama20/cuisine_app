import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUserFromToken,
  isTokenExpired,
} from '../services/token.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getUserFromToken());

  // Check expiry on mount — auto-logout if token is stale
  useEffect(() => {
    if (token && isTokenExpired()) {
      removeToken();
      setToken(null);
      setUser(null);
      navigate('/login');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback((newToken) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(getUserFromToken());
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = !!token && !isTokenExpired();

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
