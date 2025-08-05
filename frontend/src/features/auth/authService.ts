'use client'
import { useAuth } from '@/features/auth/authContext'

export const login = async (email: string, password: string) => {
  const { setToken } = useAuth(); 
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
  
  export const register = async (name:string, email: string, password: string) => {
    const { setToken } = useAuth();
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