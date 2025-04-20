// Make sure your AuthContext.jsx looks like this:
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userString = localStorage.getItem('user');

    
    if (token && userId && userString) {
      try {
        setCurrentUser({
          token,
          userId,
          user: JSON.parse(userString) // ← Parse here
          
        },);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };


  const ensureUserData = (userData) => {
    // Make sure we have a valid user object
    if (!userData) return null;
    
    // Ensure following array exists
    if (!userData.following) {
      userData.following = [];
    }
    
    return userData;
  };
  
  // Example usage in login function:
  const login = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Ensure user data has required fields
        const enhancedUserData = ensureUserData(data.user);
        
        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(enhancedUserData));
        
        // Update context
        setCurrentUser(enhancedUserData);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    logout,
    loading,
    // Add a function to force-update the auth state
    checkAuth: () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userString = localStorage.getItem('user');
      
      if (token && userId && userString) {
        try {
          setCurrentUser({
            userId,
            token,
            user: JSON.parse(userString)
          });
          return true;
        } catch (error) {
          console.error("Failed to parse user data:", error);
          return false;
        }
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