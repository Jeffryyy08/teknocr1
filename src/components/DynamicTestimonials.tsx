// src/components/DynamicTestimonials.tsx
'use client'

import { motion } from 'framer-motion'

interface Review {
  id: string
  name?: string
  rating: number
  comment?: string
  created_at: string
}

export function DynamicTestimonials({ reviews }: { reviews: Review[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
        >
          {/* Estrellas */}
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < review.rating ? 'text-yellow-400' : 'text-slate-600'
                }`}
                aria-label={`Estrella ${i + 1} de ${review.rating}`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Comentario */}
          <blockquote className="text-slate-300 italic text-sm md:text-base leading-relaxed mb-4">
            “{review.comment || 'Sin comentario'}”
          </blockquote>

          {/* Nombre */}
          <p className="text-white font-medium">
            — {review.name || 'Cliente anónimo'}
          </p>

          {/* Fecha */}
          <p className="text-slate-500 text-xs mt-2">
            {new Date(review.created_at).toLocaleDateString('es-CR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </motion.div>
      ))}
    </div>
  )
}