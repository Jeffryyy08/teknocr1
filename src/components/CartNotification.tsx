// src/components/CartNotification.tsx
'use client'

import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function CartNotification() {
  const { notification } = useCart()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ✅ Cargar sonido
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/add-to-cart.mp3')
      audioRef.current.volume = 0.3 // Volumen suave
    }
  }, [])

  // ✅ Reproducir sonido + mostrar notificación
  useEffect(() => {
    if (notification && audioRef.current) {
      // Intenta reproducir (algunos navegadores requieren interacción primero)
      audioRef.current.play().catch(e => {
        console.debug('Audio autoplay blocked (expected)', e)
      })
    }
  }, [notification])

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-16 right-6 z-50 pointer-events-none" // ✅ Debajo del navbar (pt-16 → top-16)
        >
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl p-4 flex items-center space-x-3 min-w-[300px] pointer-events-auto">
            <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm line-clamp-1">
                {notification.name}
              </p>
              <p className="text-cyan-300 text-sm">
                ₡{notification.price.toLocaleString('es-CR')} 
                <span className="text-slate-400 ml-1">× {notification.quantity}</span>
              </p>
            </div>
            <div className="bg-green-600/20 text-green-300 text-xs font-bold px-2 py-1 rounded">
              +1
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}