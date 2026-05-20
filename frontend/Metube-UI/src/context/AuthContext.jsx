import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../service/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getCurrentUser(); //

        setUser(data.user);
      } catch (err) {
        console.log("Not authenticated hoặc Token hết hạn");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: loginUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
