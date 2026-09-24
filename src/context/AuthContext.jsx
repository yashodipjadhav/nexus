import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to parse stored user session", e);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);

    if (data && data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    }

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
