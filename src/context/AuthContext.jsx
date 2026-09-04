import { createContext, useContext, useState } from "react";

const API_BASE = "http://localhost:3001";
const STORAGE_KEY = "stockhub-auth";
const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const login = async (username, password) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login gagal.");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setAuth(result);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.token || null,
        isAdmin: auth?.user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
