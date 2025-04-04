// Make sure your AuthContext.jsx looks like this:
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs when the component mounts
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // Important: Make sure this is being set correctly
      setCurrentUser({ userId, token });
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    logout,
    loading,
    // Add a function to force-update the auth state
    checkAuth: () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token && userId) {
        setCurrentUser({ userId, token });
        return true;
      }
      return false;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);