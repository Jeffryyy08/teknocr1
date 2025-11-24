// src/app/arma-tu-pc/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Cpu, Zap, MemoryStick, HardDrive, Monitor, Headphones, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden pt-16">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0L0 0 0 80" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6"
          >
            <Cpu className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Arma tu PC</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
            Estamos construyendo una herramienta revolucionaria para que configures tu PC ideal, paso a paso, con los mejores componentes de TeknoCR.
          </p>
        </motion.div>

        {/* Componentes animados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-16"
        >
          {[
            { icon: Cpu, label: 'Procesador' },
            { icon: Zap, label: 'GPU' },
            { icon: MemoryStick, label: 'RAM' },
            { icon: HardDrive, label: 'Almacenamiento' },
            { icon: Monitor, label: 'Gabinete' },
            { icon: ShieldCheck, label: 'Fuente' }
          ].map((comp, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.6 + i * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 12
              }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <comp.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-slate-300 text-center text-sm font-medium">{comp.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mensaje principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              ¿Qué harás en <span className="text-cyan-300">Arma tu PC</span>?
            </h2>
            <ul className="text-slate-300 space-y-3 text-left max-w-2xl mx-auto">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Selecciona componentes 100% compatibles y en stock.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Recibe recomendaciones inteligentes según tu presupuesto y uso (gaming, oficina, streaming).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Visualiza en tiempo real el rendimiento estimado de tu configuración.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Genera tu orden con un solo clic y recibe soporte técnico personalizado.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-16"
        >
          <p className="text-blue-200 mb-6">
            ¿Quieres ser el primero en probarlo?
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              href="/tienda"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Explora nuestra tienda
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-4 bg-slate-800/70 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 shadow-lg hover:shadow-xl transition-all"
            >
              Déjanos tus sugerencias
            </Link>
          </div>
        </motion.div>

        {/* Footer pequeño */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-24 text-center text-slate-500 text-sm"
        >
          <p>
            Construyendo el futuro de las PCs en Costa Rica 🇨🇷 | TeknoCR
          </p>
        </motion.div>
      </div>

      {/* Animación de partículas flotantes (opcional) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}