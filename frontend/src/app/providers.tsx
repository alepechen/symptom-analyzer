// app/providers.tsx
'use client'

import { AuthProvider } from '@/features/auth/authContext'
import { usePathname } from 'next/navigation'; 
import NavBar from '@/components/Navbar';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
   const isAuthPage = pathname === '/login' || pathname === '/register'
  return ( <AuthProvider>
     {!isAuthPage && <NavBar />}
    {children}
    </AuthProvider>
)}
