// src/components/auth/AuthGuard.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authorized, loading } = useAdminAuth()
  const router = useRouter()

  // ✅ Redirección segura con useEffect
  useEffect(() => {
    if (!loading && authorized === false) {
      // Mostrar alerta antes de redirigir
      alert('✅ Has cerrado sesión correctamente')
      router.push('/admin/login')
    }
  }, [authorized, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-200">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // ✅ Solo renderiza si está autorizado
  if (authorized) {
    return <>{children}</>
  }

  return null
}