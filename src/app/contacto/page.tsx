// src/app/contacto/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Star, Send, Facebook, Instagram, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewName, setReviewName] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [recentReviews, setRecentReviews] = useState<any[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      setRecentReviews(reviews || [])
    }
    fetchReviews()
  }, [])

  // 🛡️ Filtro avanzado anti-groserías
  const blockedWords = [
    "puta", "puto", "pendejo", "mierda", "imbecil", "idiota",
    "estupido", "hijueputa", "hp", "ptm", "maricon", "verga",
    "bitch", "fuck", "fucker", "bastardo", "malparido", "picha", "perra",
  ]

  const charMap: Record<string, string> = {
    "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t",
    "@": "a", "$": "s", "¡": "", "!": "", "*": "", ".": "",
    "-": "", "_": ""
  }

  const normalize = (text: string) => {
    let t = text.toLowerCase()
    Object.keys(charMap).forEach(k => {
      const regex = new RegExp(`\\${k}`, "g")
      t = t.replace(regex, charMap[k])
    })
    t = t.replace(/\s+/g, "")
    return t
  }

  const fuzzyMatch = (word: string, target: string) => {
    const threshold = 0.75
    let matches = 0
    const minLength = Math.min(word.length, target.length)
    for (let i = 0; i < minLength; i++) {
      if (word[i] === target[i]) matches++
    }
    return matches / word.length >= threshold
  }

  const containsBadWords = (text: string) => {
    const clean = normalize(text)
    return blockedWords.some(bad => {
      const normalizedBad = normalize(bad)
      return clean.includes(normalizedBad) || fuzzyMatch(clean, normalizedBad)
    })
  }

  // ⛔ INTEGRACIÓN DEL FILTRO AQUÍ
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Filtro antes de enviar
    if (containsBadWords(reviewName) || containsBadWords(reviewComment)) {
      alert("⚠️ Tu nombre o comentario contiene palabras o caracteres no permitidos.")
      return
    }

    setSubmittingReview(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          name: reviewName,
          rating,
          comment: reviewComment
        })
      if (error) throw error

      alert('⭐ ¡Gracias por tu calificación!')

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentReviews(reviews || [])
      setReviewName('')
      setRating(0)
      setReviewComment('')
    } catch (error) {
      alert('❌ Error al enviar la calificación')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contáctanos</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. ¿Tienes dudas, sugerencias o quieres calificar tu experiencia?
          </p>
        </div>

        {/* Redes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Link
            href="https://www.facebook.com/profile.php?id=61581768092699"
            target="_blank"
            className="group bg-slate-800/70 border border-slate-700 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-blue-500/30 shadow-lg"
          >
            <Facebook className="w-10 h-10 mx-auto text-blue-400 group-hover:text-blue-500 transition-colors" />
            <h3 className="text-lg font-semibold text-white mt-3">Facebook</h3>
            <p className="text-slate-400 text-sm mt-1">Visita nuestra página oficial</p>
          </Link>

          <Link
            href="https://instagram.com/tekno.cr"
            target="_blank"
            className="group bg-slate-800/70 border border-slate-700 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:border-pink-500 hover:shadow-pink-500/30 shadow-lg"
          >
            <Instagram className="w-10 h-10 mx-auto text-pink-400 group-hover:text-pink-500 transition-colors" />
            <h3 className="text-lg font-semibold text-white mt-3">Instagram</h3>
            <p className="text-slate-400 text-sm mt-1">Mirá nuestras publicaciones</p>
          </Link>

          <Link
            href="https://wa.me/50671604429"
            target="_blank"
            className="group bg-slate-800/70 border border-slate-700 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:border-green-500 hover:shadow-green-500/30 shadow-lg"
          >
            <MessageCircle className="w-10 h-10 mx-auto text-green-400 group-hover:text-green-500 transition-colors" />
            <h3 className="text-lg font-semibold text-white mt-3">WhatsApp</h3>
            <p className="text-slate-400 text-sm mt-1">Escríbenos directamente</p>
          </Link>
        </div>

        {/* Formulario Reseñas */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-400" />
              Califica tu Experiencia
            </h2>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Tu Nombre</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Calificación *</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Comentario (opcional)</label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview || rating === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {submittingReview ? 'Enviando...' : 'Enviar Calificación'}
              </button>
            </form>
          </div>
        </div>

        {/* Últimas Calificaciones */}
        <div className="py-20 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 mt-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Lo Que Dicen Nuestros Clientes</h2>

            {recentReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-300 italic mb-4">"{review.comment || 'Sin comentario'}"</p>
                    <p className="text-white font-medium">— {review.name || 'Anónimo'}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(review.created_at).toLocaleDateString('es-CR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Aún no hay calificaciones. ¡Sé el primero!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
