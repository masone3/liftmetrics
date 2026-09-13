import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [sessionExpired, setSessionExpired] = useState(false); // NEW

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setSessionExpired(false); // clear the flag on a fresh login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    function handleUnauthorized() {
      setSessionExpired(true); // mark that this logout was involuntary
      logout();
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    sessionExpired, // NEW
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}