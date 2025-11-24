// src/app/admin/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Order } from '@/types'

export default function OrderDetailPage() {
  const { authorized, loading } = useAdminAuth()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const orderId = params.id

  const [order, setOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  // ✅ Validación temprana del ID
  useEffect(() => {
    if (!orderId) {
      router.push('/admin/orders')
      return
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (typeof orderId !== 'string' || !uuidRegex.test(orderId)) {
      router.push('/admin/orders')
      return
    }
  }, [orderId, router])

  // ✅ Fetch con manejo de errores
  useEffect(() => {
    if (!authorized || !orderId) return

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (error) throw error
        setOrder(data)
      } catch (error: any) {
        console.error('Error fetching order:', error)
        alert('❌ Pedido no encontrado')
        router.push('/admin/orders')
      }
    }

    fetchOrder()
  }, [authorized, orderId, router])

  // ✅ Update con tipado seguro
  const updateOrderStatus = async (status: string) => {
    if (!order) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id);

      if (error) throw error;


      setOrder(prev => (prev ? { ...prev, status } : null) as Order | null);
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert(`❌ Error: ${error.message || 'No se pudo actualizar el estado'}`);
    } finally {
      setUpdating(false);
    }

  }

  if (loading) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-blue-200">Cargando pedido...</p>
      </div>
    </div>
  )

  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  if (!order) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400">Pedido no encontrado</p>
        <Link href="/admin/orders" className="text-blue-400 hover:underline mt-4 inline-block">
          ← Volver a pedidos
        </Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/admin/orders"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Detalle del Pedido</h1>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-slate-700 shadow-xl">
          {/* Información del cliente */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Información del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Nombre</p>
                <p className="text-white">{order.customer_name || '—'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Teléfono</p>
                <p className="text-white">{order.customer_phone || '—'}</p>
              </div>
              {order.customer_address && (
                <div className="md:col-span-2">
                  <p className="text-slate-400 text-sm">Dirección</p>
                  <p className="text-white">{order.customer_address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Productos ({order.products?.length || 0})
            </h2>
            {order.products && order.products.length > 0 ? (
              <div className="space-y-3">
                {order.products.map((product, i) => (
                  <div key={i} className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-slate-400 text-sm">x{product.quantity || 1}</p>
                    </div>
                    <p className="text-cyan-300 font-semibold">
                      ₡{Number(product.price * (product.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No hay productos en este pedido</p>
            )}
          </div>

          {/* Resumen */}
          <div className="border-t border-slate-700 pt-5">
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Subtotal:</span>
              <span className="text-slate-300">₡{order.discount ?
                Math.round(order.total + (order.discount_amount || 0)).toLocaleString()
                : order.total.toLocaleString()}</span>
            </div>

            {/* ✅ Descuento */}
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between text-green-400 mb-2">
                <span>Descuento de apertura:</span>
                <span>-₡{(order.discount_amount || 0).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-white mb-6">
              <span>Total:</span>
              <span className="text-2xl text-cyan-300">₡{Number(order.total).toLocaleString()}</span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Estado del Pedido
              </label>
              <select
                value={order.status}
                onChange={e => !updating && updateOrderStatus(e.target.value)}
                disabled={updating}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En proceso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {updating && (
                <p className="text-blue-400 text-sm mt-2 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}