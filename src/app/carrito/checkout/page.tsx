// src/app/carrito/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Send, Tag } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const total = getTotalPrice()

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
      const serializedProducts = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        subcategory: item.subcategory || null,
        image_url: item.image_url || null,
        is_promo: item.is_promo,
        original_price: item.original_price,
        promo_label: item.promo_label
      }))

      const { data: order, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address,
            customer_email: formData.email,
            products: serializedProducts,
            total
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      const incrementPromises = cart.map(item =>
        supabase.rpc('increment_product_count', {
          product_id: item.id,
          qty: item.quantity
        })
      )

      const results = await Promise.allSettled(incrementPromises)
      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          console.warn(`No se pudo actualizar popularidad de ${cart[i].name}:`, res.reason)
        }
      })

      let message = `📦 NUEVO PEDIDO #${order.id.substring(0, 8)}\n\n`
      message += cart
        .map(item => {
          const original = item.original_price
            ? ` (antes ₡${item.original_price.toLocaleString()})`
            : ''
          return `- ${item.name}${original} x${item.quantity} = ₡${(
            item.price * item.quantity
          ).toLocaleString()}`
        })
        .join('\n')

      message += `\n\nTotal: ₡${total.toLocaleString()}\n\n`
      message += `Nombre: ${formData.name}\nTeléfono: ${formData.phone}`
      if (formData.address) message += `\nDirección: ${formData.address}`
      if (formData.email) message += `\nEmail: ${formData.email}`

      window.open(
        `https://wa.me/50671604429?text=${encodeURIComponent(message)}`,
        '_blank'
      )

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
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/carrito"
            className="p-2 text-blue-200 hover:text-white hover:bg-slate-800/60 rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <h1 className="text-3xl font-bold text-white tracking-tight">
            Finalizar Pedido
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/60 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Ej: 8888-8888"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                placeholder="Ej: 200m norte de la escuela..."
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Ej: correo@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>


            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition shadow-lg shadow-blue-900/40 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Pedido por WhatsApp
                </>
              )}
            </button>

          </form>
        </div>

        {/* Resumen */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/60 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-5">
            Resumen del Pedido
          </h2>

          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url || '/placeholder.png'}
                    className="w-12 h-12 object-cover rounded-xl"
                  />

                  <div>
                    <p className="text-white font-medium">{item.name}</p>

                    {item.is_promo && item.promo_label && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-0.5 rounded-lg shadow">
                        <Tag className="w-3 h-3" />
                        {item.promo_label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {item.is_promo ? (
                    <>
                      <p className="text-slate-500 text-xs line-through">
                        ₡{(item.original_price! * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-cyan-300 font-bold">
                        ₡{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-cyan-300 font-bold">
                      ₡{(item.price * item.quantity).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-slate-700 pt-4 mt-4 flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-cyan-300">
                ₡{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
