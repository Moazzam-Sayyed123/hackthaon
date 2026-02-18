import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call - in production, verify credentials with backend
      const generateAddress = () => {
        const house = Math.floor(Math.random() * 900) + 100;
        return `${house} MG Road, Shivaji Nagar, Pune, Maharashtra, India`;
      };

      const userData = {
        id: Math.random().toString(),
        email,
        role, // "vendor" or "user"
        name: email.split("@")[0],
        address: role === "user" ? generateAddress() : "",
        walletBalance: 5000,
        createdAt: new Date()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const checkAuth = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
