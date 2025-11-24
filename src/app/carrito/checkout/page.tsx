// src/app/carrito/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Send, Info } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const subtotalWithDiscount = cart
    .filter(item => item.category !== 'pc-completa')
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const hasDiscount = subtotalWithDiscount >= 50000
  const discountRate = hasDiscount ? 0.05 : 0
  const discountAmount = hasDiscount ? Math.round(subtotalWithDiscount * 0.05) : 0
  const total = getTotalPrice() - discountAmount

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ✅ 1. Serializar carrito (solo campos primitivos)
      const serializedProducts = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        subcategory: item.subcategory || null,
        image_url: item.image_url || null
      }))

      // ✅ 2. Crear orden
      const {  data: order, error: insertError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_email: formData.email,
          products: serializedProducts,
          total,
          discount: discountRate,
          discount_amount: discountAmount
        }])
        .select()
        .single()

      if (insertError) throw insertError

      // ✅ 3. Incrementar times_ordered (seguro y rápido)
      const incrementPromises = cart.map(item =>
        supabase.rpc('increment_product_count', {
          product_id: item.id,
          qty: item.quantity
        })
      )

      // ✅ Ejecutar en paralelo (no bloquea la UX)
      const results = await Promise.allSettled(incrementPromises)
      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          console.warn(`No se pudo actualizar popularidad de ${cart[i].name}:`, res.reason)
        }
      })

      // ✅ 4. WhatsApp con ID de pedido
      let message = `📦 NUEVO PEDIDO #${order.id.substring(0, 8)}\n\n`
      message += cart.map(item => {
        const label = item.category === 'pc-completa' ? ' (PC, sin descuento)' : ''
        return `- ${item.name}${label} x${item.quantity} = ₡${(item.price * item.quantity).toLocaleString()}`
      }).join('\n')

      message += `\n\nSubtotal: ₡${getTotalPrice().toLocaleString()}`
      if (hasDiscount) {
        message += `\n✅ Descuento (5%): -₡${discountAmount.toLocaleString()}`
      }
      message += `\nTotal: ₡${total.toLocaleString()}\n\n`
      message += `Nombre: ${formData.name}\nTeléfono: ${formData.phone}`
      if (formData.address) message += `\nDirección: ${formData.address}`
      if (formData.email) message += `\nEmail: ${formData.email}`

      window.open(`https://wa.me/50671604429?text=${encodeURIComponent(message)}`, '_blank')
      clearCart()
      router.push('/gracias')
    } catch (error: any) {
      console.error('Error en checkout:', error)
      alert(`❌ Error: ${error.message || 'No se pudo crear el pedido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/carrito"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Finalizar Pedido</h1>
        </div>

        {/* Formulario */}
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 8000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Calle Principal, San José"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: juan@ejemplo.com"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Pedido por WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Resumen del Pedido</h2>

          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 mb-4 text-sm">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-300">
                <span className="font-medium text-cyan-200">Nota:</span> Las PCs completas no generan descuento. Solo componentes y accesorios suman para el 5%.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image_url || '/placeholder.png'}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <span className="text-white">{item.name}</span>
                    <p className="text-slate-400 text-xs">
                      {item.category === 'pc-completa' ? 'Sin descuento' : 'Con descuento'}
                    </p>
                  </div>
                </div>
                <span className="text-cyan-300">₡{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t border-slate-600 pt-3 mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Total sin descuento:</span>
                <span className="text-slate-300">₡{getTotalPrice().toLocaleString()}</span>
              </div>

              {hasDiscount && (
                <>
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal con descuento:</span>
                    <span>₡{subtotalWithDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Descuento (5%):</span>
                    <span>-₡{discountAmount.toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-xl font-bold border-t border-slate-600 pt-3">
                <span>Total a pagar:</span>
                <span className="text-cyan-300">₡{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}