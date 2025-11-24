// src/hooks/useAdminAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminAuth() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {  data, error } = await supabase.auth.getSession()
        if (error) throw error

        const session = data?.session
        if (!session) {
          setAuthorized(false)
          setLoading(false)
          return
        }

        const {   data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .eq('is_active', true)
          .single()

        setAuthorized(!!adminData && !adminError)
        setLoading(false)
      } catch (err) {
        console.error('Error checking admin status:', err)
        setAuthorized(false)
        setLoading(false)
      }
    }

    checkAdmin()

    // ✅ CORRECCIÓN: onAuthStateChange devuelve un objeto con { data: { subscription } }
    const {  data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthorized(false)
      } else {
        supabase
          .from('admins')
          .select('email')
          .eq('email', session.user.email)
          .eq('is_active', true)
          .single()
          .then(({ data, error }) => {
            setAuthorized(!!data && !error)
          })
      }
    })

    // ✅ Ahora subscription.unsubscribe() SÍ es una función
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setAuthorized(false)
  }

  return { authorized, loading, logout }
}