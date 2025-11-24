// src/app/admin/reviews/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Star,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'

// Componente para el gráfico de calificaciones mensuales
function ReviewsChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-slate-400 w-16 text-sm">{item.month}</span>
          <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
              style={{ width: `${(item.count / max) * 100}%` }}
            ></div>
          </div>
          <span className="text-white w-8 text-right">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const { authorized, loading, logout } = useAdminAuth()
  const router = useRouter()

  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0
  })
  const [monthlyData, setMonthlyData] = useState<{ month: string; count: number }[]>([])
  const [search, setSearch] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    if (!authorized) return

    const fetchData = async () => {
      // === Estadísticas ===
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')

      const total = allReviews?.length || 0
      const sum = allReviews?.reduce((acc, r) => acc + r.rating, 0) || 0
      const average = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0

      const five = allReviews?.filter(r => r.rating === 5).length || 0
      const four = allReviews?.filter(r => r.rating === 4).length || 0
      const three = allReviews?.filter(r => r.rating === 3).length || 0
      const two = allReviews?.filter(r => r.rating === 2).length || 0
      const one = allReviews?.filter(r => r.rating === 1).length || 0

      setStats({ total, average, five, four, three, two, one })

      // === Calificaciones por mes (últimos 6 meses) ===
      const now = new Date()
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now)
        d.setMonth(d.getMonth() - i)
        return d
      }).reverse()

      const monthLabels = months.map(m =>
        m.toLocaleDateString('es-CR', { month: 'short' })
      )

      const monthly = await Promise.all(
        months.map(async (month) => {
          const start = new Date(month.getFullYear(), month.getMonth(), 1)
          const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
          const { count } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString())
          return { month: monthLabels[months.indexOf(month)], count: count ?? 0 }
        })
      )
      setMonthlyData(monthly)

      // === Lista de reseñas ===
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%`)
      }
      if (filterRating !== null) {
        query = query.eq('rating', filterRating)
      }

      const from = (currentPage - 1) * perPage
      const to = from + perPage - 1
      query = query.range(from, to)

      const { data } = await query
      setReviews(data || [])
    }

    fetchData()
  }, [authorized, search, filterRating, currentPage])

  // ✅ CORREGIDO: Eliminación real de la base de datos
  const deleteReview = async (id: string) => {
    if (!confirm('¿Eliminar esta reseña? Esta acción no se puede deshacer.')) return

    // ✅ Usa .select() vacío para ejecutar la consulta
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting review:', error)
      alert(`❌ Error al eliminar la reseña: ${error.message || 'Verifica la conexión'}`)
    } else {
      setReviews(reviews.filter(r => r.id !== id))
      alert('✅ Reseña eliminada permanentemente')
    }
  }

  if (loading) {
    return <div className="pt-16 min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Panel de Reseñas</h1>
                <p className="text-blue-300">Gestiona las calificaciones de tus clientes</p>
              </div>
            </div>
          </div>
          <Link
            href="/admin"
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            ← Volver al Dashboard
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Promedio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Calificación Promedio</h3>
            <div className="flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-3xl font-bold text-white">{stats.average}</span>
              <span className="text-slate-400 ml-1">/5</span>
            </div>
            <p className="text-slate-400 mt-1">{stats.total} reseñas</p>
          </motion.div>

          {/* Distribución */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Distribución</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats[rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one']
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 bg-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white w-8 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Tendencia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Últimos 6 Meses</h3>
            <ReviewsChart data={monthlyData} />
          </motion.div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o comentario..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterRating ?? ''}
              onChange={e => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las calificaciones</option>
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>
            <button
              onClick={() => { setSearch(''); setFilterRating(null) }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Lista de reseñas */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No se encontraron reseñas</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-700">
                {reviews.map(review => (
                  <div key={review.id} className="p-6 hover:bg-slate-800/50 transition">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                          <span className="text-slate-400 text-sm ml-2">
                            {new Date(review.created_at).toLocaleDateString('es-CR')}
                          </span>
                        </div>
                        <p className="text-slate-300 italic mb-3">
                          "{review.comment || 'Sin comentario'}"
                        </p>
                        <p className="text-white font-medium">
                          — {review.name || 'Anónimo'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition"
                        title="Eliminar reseña"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center p-4 border-t border-slate-700">
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.ceil(stats.total / perPage) },
                    (_, i) => i + 1
                  ).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Advertencia */}
        <div className="mt-8 p-4 bg-amber-900/20 border border-amber-800/50 rounded-xl flex items-center">
          <AlertTriangle className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
          <p className="text-amber-200">
            Recuerda: solo elimina reseñas que contengan groserias, spam o contenido inapropiado. 
            Las críticas constructivas deben mantenerse para mejorar tu servicio.
          </p>
        </div>
      </div>
    </div>
  )
}