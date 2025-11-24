// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  LogOut,
  Package,
  BarChart3,
  Plus,
  Star,
  ShoppingCart,
  Calendar,
  Clock,
  Info,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { OrdersChart } from '@/components/charts/OrdersChart'
import { RevenueChart } from '@/components/charts/RevenueChart'

export default function AdminDashboard() {
  const { authorized, loading, logout } = useAdminAuth()
  const router = useRouter()
  const [chartData, setChartData] = useState({
    orders: { labels: [] as string[], completed: [] as number[], pending: [] as number[] },
    revenue: { labels: [] as string[], revenue: [] as number[] }
  })

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
    mostOrderedProducts: [] as any[]
  })
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!authorized) return

      // === Estadísticas generales ===
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      const { count: featuredProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)

      // === Estadísticas de pedidos (en UTC-6) ===
      const now = new Date()
      const crNow = new Date(now.getTime() + (now.getTimezoneOffset() + 360) * 60000)
      const startOfMonth = new Date(crNow.getFullYear(), crNow.getMonth(), 1)
      const startOfMonthUTC = new Date(startOfMonth.getTime() - 360 * 60000).toISOString()

      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      const { count: completedOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completado')

      const { data: totalRevenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completado')

      const totalRevenue = totalRevenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

      const { count: ordersThisMonth } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonthUTC)

      const { data: revenueThisMonthData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completado')
        .gte('created_at', startOfMonthUTC)

      const revenueThisMonth = revenueThisMonthData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

      // === Datos para listas ===
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      // ✅ Últimos 4 productos
      const { data: products } = await supabase
        .from('products')
        .select('id, name, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(4)

      // ✅ Productos más vendidos
      const { data: mostOrdered } = await supabase
        .from('products')
        .select('id, name, price, times_ordered, image_url')
        .order('times_ordered', { ascending: false })
        .limit(10)

      // === Datos para gráficos (últimos 6 meses, en UTC-6) ===
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(crNow)
        d.setUTCMonth(d.getUTCMonth() - i)
        return d
      }).reverse()

      const monthLabels = months.map(m =>
        m.toLocaleDateString('es-CR', { month: 'short', year: '2-digit' })
      )

      const ordersByMonth = await Promise.all(
        months.map(async (month) => {
          const start = new Date(month.getUTCFullYear(), month.getUTCMonth(), 1)
          const end = new Date(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)
          const startUTC = new Date(start.getTime() - 360 * 60000).toISOString()
          const endUTC = new Date(end.getTime() - 360 * 60000).toISOString()

          const { count: completed } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completado')
            .gte('created_at', startUTC)
            .lte('created_at', endUTC)

          const { count: pending } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendiente')
            .gte('created_at', startUTC)
            .lte('created_at', endUTC)

          return {
            completed: completed ?? 0,
            pending: pending ?? 0
          }
        })
      )

      const revenueByMonth = await Promise.all(
        months.map(async (month) => {
          const start = new Date(month.getUTCFullYear(), month.getUTCMonth(), 1)
          const end = new Date(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)
          const startUTC = new Date(start.getTime() - 360 * 60000).toISOString()
          const endUTC = new Date(end.getTime() - 360 * 60000).toISOString()

          const { data } = await supabase
            .from('orders')
            .select('total')
            .eq('status', 'completado')
            .gte('created_at', startUTC)
            .lte('created_at', endUTC)

          return data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
        })
      )

      setChartData({
        orders: {
          labels: monthLabels,
          completed: ordersByMonth.map(m => m.completed),
          pending: ordersByMonth.map(m => m.pending)
        },
        revenue: {
          labels: monthLabels,
          revenue: revenueByMonth
        }
      })

      setStats({
        totalProducts: totalProducts ?? 0,
        activeProducts: activeProducts ?? 0,
        featuredProducts: featuredProducts ?? 0,
        totalOrders: totalOrders ?? 0,
        completedOrders: completedOrders ?? 0,
        totalRevenue,
        ordersThisMonth: ordersThisMonth ?? 0,
        revenueThisMonth,
        mostOrderedProducts: mostOrdered || []
      })
      setRecentReviews(reviews || [])
      setRecentOrders(orders || [])
      setRecentProducts(products || [])
    }

    fetchData()
  }, [authorized])

  useEffect(() => {
    if (authorized === false) {
      alert('✅ Has cerrado sesión correctamente')
      router.push('/admin/login')
    }
  }, [authorized, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (authorized === false) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden p-6 pt-20">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0L0 0 0 80" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
              <p className="text-blue-300">Bienvenido de vuelta, admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => logout()}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition shadow"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline-block">Cerrar sesión</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link href="/admin/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:scale-102 transition">
            Productos
          </Link>
          <Link
            href="/admin/ventas"
            className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-800/50 text-amber-300 px-4 py-2 rounded-lg shadow hover:brightness-105 transition"
          >
            <TrendingUp className="w-4 h-4" />
            Ventas
          </Link>
          <Link href="/admin/orders" className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 text-white px-4 py-2 rounded-lg shadow hover:brightness-105 transition">
            Pedidos
          </Link>
          <Link href="/admin/reviews" className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 text-white px-4 py-2 rounded-lg shadow hover:brightness-105 transition">
            Reviews
          </Link>
          
        </div>

        {/* ✅ Productos más vendidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="md:col-span-2 lg:col-span-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Productos Más Vendidos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.mostOrderedProducts.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        ₡{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-cyan-300 font-bold text-sm">
                      {product.times_ordered} veces
                    </p>
                  </div>
                </motion.div>
              ))}
              {stats.mostOrderedProducts.length === 0 && (
                <p className="text-slate-400 col-span-full text-center py-4">
                  Aún no hay ventas registradas
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ✅ Productos Agregados Recientemente */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Productos Agregados Recientemente
            </h2>
            <Link
              href="/admin/products"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              Ver todos →
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No hay productos aún</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/edit/${product.id}`}
                  className="block"
                >
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 8px 20px -4px rgba(0,0,0,0.4)' }}
                    className="bg-slate-700/40 border border-slate-600 rounded-xl overflow-hidden transition-all"
                  >
                    <div className="h-32 bg-slate-800 flex items-center justify-center p-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-slate-500 text-sm">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-white font-medium text-sm line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        {new Date(product.created_at).toLocaleDateString('es-CR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* Gráficos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Pedidos (últimos 6 meses)</h3>
            <OrdersChart data={chartData.orders} />
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Ingresos (últimos 6 meses)</h3>
            <RevenueChart data={chartData.revenue} />
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-amber-600' },
            { title: 'Completados', value: `${Math.round((stats.completedOrders / Math.max(1, stats.totalOrders)) * 100)}%`, icon: Star, color: 'bg-green-600' },
            { title: 'Ganancias', value: `₡${Number(stats.totalRevenue).toLocaleString()}`, icon: BarChart3, color: 'bg-cyan-600' },
            { title: 'Este mes', value: stats.ordersThisMonth, icon: Calendar, color: 'bg-purple-600' }
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="relative bg-slate-800/60 rounded-xl p-4 border border-slate-700 shadow-md overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-28 h-28 ${s.color} opacity-10 rounded-full blur-xl`} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">{s.title}</p>
                  <p className="text-lg font-bold text-white">{s.value}</p>
                </div>
                <div className={`${s.color} p-3 rounded-lg`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Estadísticas de Descuento de Apertura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Descuento de Apertura
            </h3>

            {(() => {
              const ordersWithDiscount = recentOrders.filter(o =>
                o.discount && o.discount > 0
              )
              const totalDiscount = ordersWithDiscount.reduce(
                (sum, o) => sum + (o.discount_amount || 0), 0
              )

              return (
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Pedidos con descuento</p>
                    <p className="text-2xl font-bold text-white">{ordersWithDiscount.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Ahorro total</p>
                    <p className="text-xl font-bold text-green-400">
                      ₡{totalDiscount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    <Info className="w-3 h-3 inline mr-1" />
                    Solo en productos adicionales (no PCs)
                  </div>
                </div>
              )
            })()}
          </div>
        </motion.div>

        {/* Recent lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Últimas Calificaciones */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> Últimas Calificaciones</h2>
            {recentReviews.length === 0 ? (
              <p className="text-slate-400">No hay calificaciones aún</p>
            ) : (
              <div className="space-y-3">
                {recentReviews.map(review => (
                  <div key={review.id} className="p-3 bg-slate-700/50 rounded-lg flex items-start gap-3">
                    <div className="w-10">
                      <div className="bg-yellow-400/10 text-yellow-300 rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold">
                        {String(review.rating || 0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 italic mb-1">"{review.comment || 'Sin comentario'}"</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-medium">— {review.name || 'Anónimo'}</p>
                        <p className="text-slate-500 text-xs">{new Date(review.created_at).toLocaleDateString('es-CR')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/admin/reviews" className="text-blue-400 hover:text-blue-300 text-sm mt-4 inline-block">Ver todas las calificaciones →</Link>
          </motion.section>

          {/* Últimos Pedidos */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-amber-400" /> Últimos Pedidos</h2>
            {recentOrders.length === 0 ? (
              <p className="text-slate-400">No hay pedidos aún</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-slate-400 text-sm">₡{Number(order.total).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'pendiente' ? 'bg-yellow-900/50 text-yellow-300' :
                          order.status === 'en proceso' ? 'bg-blue-900/50 text-blue-300' :
                            order.status === 'cancelado' ? 'bg-red-900/50 text-red-300' :
                              'bg-green-900/50 text-green-300'
                          }`}>
                          {order.status}
                        </span>
                        <p className="text-slate-500 text-xs mt-1">{new Date(order.created_at).toLocaleDateString('es-CR')}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 text-sm mt-4 inline-block">Ver todos los pedidos →</Link>
          </motion.section>
        </div>

        {/* Floating Add Button */}
        <div className="fixed right-6 bottom-6 z-50">
          <Link href="/admin/products/new" className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg transform hover:scale-105 transition">
            <Plus className="w-6 h-6 text-white" />
            <span className="sr-only">Nuevo producto</span>
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-30 transition" />
          </Link>
        </div>
      </div>
    </div>
  )
}