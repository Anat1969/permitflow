import React, { createContext, useContext } from 'react';

// גרסה עצמאית: אין שכבת התחברות של Base44 — האפליקציה נפתחת ישירות.
const AuthContext = createContext({ user: null, isAuthenticated: true });

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{ user: null, isAuthenticated: true }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
