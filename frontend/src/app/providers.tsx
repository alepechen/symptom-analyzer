// app/providers.tsx
'use client'

import { AuthProvider } from '@/features/auth/authContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
