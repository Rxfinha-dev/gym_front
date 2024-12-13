import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ redirectToLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
