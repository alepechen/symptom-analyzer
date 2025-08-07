'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react'
import { decodeToken } from '@/utils/decodeToken'

type AuthContextType = {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  user: { id: string; name: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; name: string } | null>(null)
  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    setToken(data.access_token)
    const decoded = decodeToken(data.access_token)
    if (decoded) {
      setUser({ id: decoded.id, name: decoded.name })
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        credentials: 'include', // 🔐 send/receive cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      }
    )

    if (!res.ok) throw new Error('Register failed')
    const data = await res.json()
    setToken(data.access_token)
    const decoded = decodeToken(data.access_token)
    if (decoded) {
      setUser({ id: decoded.id, name: decoded.name })
    }
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, user, setToken, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
