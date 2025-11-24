// src/components/AnimatedHero.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function AnimatedHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-4xl mx-auto"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Expertos en Tecnología en{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Costa Rica
        </span>
      </h1>
      <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
        Reparación, mantenimiento y venta de PCs y componentes de alta gama.
        Calidad, garantía y atención personalizada.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/tienda"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Ver Tienda
        </Link>
        <Link
          href="/servicios"
          className="border-2 border-blue-400 text-blue-200 hover:bg-blue-900/30 font-bold py-3 px-8 rounded-xl text-lg transition-all backdrop-blur-sm"
        >
          Nuestros Servicios
        </Link>
      </div>
    </motion.div>
  )
}