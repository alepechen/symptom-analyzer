'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  login: (email: string, password: string) => void;
  register: (name:string, email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          credentials: "include", // 🔐 send/receive cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
      
        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        setToken(data.access_token);
    };
    
  const register = async (name:string, email: string, password: string) => {
      const res = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          credentials: "include", // 🔐 send/receive cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email, password }),
        });
      
        if (!res.ok) throw new Error("Register failed");
        const data = await res.json();
        setToken(data.access_token);
    };
  const logout = () => {  
    setToken(null);
  };
  return (
    <AuthContext.Provider value={{ token, setToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
