// src/app/admin/orders/page.tsx 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Link from 'next/link'
import { ArrowLeft, XCircle } from 'lucide-react'

export default function OrdersPage() {
  const { authorized, loading } = useAdminAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (!authorized) return

    const fetchOrders = async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      setOrders(orders || [])
    }
    fetchOrders()
  }, [authorized])

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('❌ Error al actualizar el estado')
    } else {
      setOrders(orders.map(order =>
        order.id === id ? { ...order, status } : order
      ))
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta orden?")) return

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      alert("❌ No se pudo eliminar")
    } else {
      setOrders(orders.filter(order => order.id !== id))
    }
  }

  if (loading) return <div className="pt-16 min-h-screen flex items-center justify-center">Cargando...</div>
  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/admin" className="p-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Gestión de Pedidos</h1>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No hay pedidos aún</p>
          </div>
        ) : (

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-14 gap-4 p-4 bg-slate-800 font-semibold text-slate-300 text-sm">
              <div className="col-span-3">Cliente</div>
              <div className="col-span-2">Teléfono</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Descuento</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1"></div>
            </div>

            {orders.map(order => (
              <div key={order.id} className="grid grid-cols-14 gap-4 p-4 border-t border-slate-700 hover:bg-slate-800/50">

                <div className="col-span-3 text-white">{order.customer_name}</div>
                <div className="col-span-2 text-slate-300">{order.customer_phone}</div>
                <div className="col-span-2 text-cyan-300">₡{Number(order.total).toLocaleString()}</div>

                {/* ✅ Columna de descuento */}
                <div className="col-span-2">
                  {order.discount && order.discount > 0 ? (
                    <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">
                      -₡{order.discount_amount?.toLocaleString() || '0'}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </div>
                <div className="col-span-2 text-slate-400">
                  {new Date(order.created_at).toLocaleDateString('es-CR')}
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="bg-slate-700 text-white text-sm rounded px-2 py-1"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                {/* VER + ELIMINAR */}
                <div className="col-span-1 flex items-center space-x-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Ver
                  </Link>

                  {/* BOTÓN ELIMINAR */}
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
