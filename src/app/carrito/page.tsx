// src/app/carrito/page.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingCart, CheckCircle, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, addToCart } = useCart()

  const [coupon, setCoupon] = useState('')
  const total = getTotalPrice()

  // 🔥 ✅ Calcula subtotal con descuento (solo componentes/accesorios)
  const subtotalWithDiscount = cart
    .filter(item => item.category !== 'pc-completa')
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const hasDiscount = subtotalWithDiscount >= 50000
  const discountAmount = hasDiscount ? Math.round(subtotalWithDiscount * 0.05) : 0
  const finalTotal = hasDiscount ? (total - discountAmount) : total

  // 🔥 Producto sugerido (solo basado en subtotal con descuento)
  const [suggestedForPromo, setSuggestedForPromo] = useState<any>(null)

  useEffect(() => {
    const findSuggestion = async () => {
      if (subtotalWithDiscount >= 50000 || cart.length === 0) {
        setSuggestedForPromo(null)
        return
      }

      const amountNeeded = 50000 - subtotalWithDiscount
      const tolerance = 5000

      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_url, category, subcategory')
        .eq('is_active', true)
        .neq('category', 'pc-completa') // ✅ Solo componentes/accesorios
        .gte('price', amountNeeded - tolerance)
        .lte('price', amountNeeded + tolerance)
        .order('price', { ascending: true })
        .limit(1)

      if (data && data.length > 0) {
        setSuggestedForPromo(data[0])
      } else {
        const { data: fallback } = await supabase
          .from('products')
          .select('id, name, price, image_url, category, subcategory')
          .eq('is_active', true)
          .neq('category', 'pc-completa')
          .gte('price', amountNeeded)
          .order('price', { ascending: true })
          .limit(1)

        setSuggestedForPromo(fallback?.[0] || null)
      }
    }

    findSuggestion()
  }, [subtotalWithDiscount, cart])

  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center overflow-hidden">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-white mb-2">Tu carrito está vacío</p>
          <Link href="/tienda" className="text-blue-300 hover:text-blue-200 mt-4 inline-block">
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* IZQUIERDA - Productos */}
        <div className="md:col-span-2">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Carrito de Compras
            </h1>
          </div>

          {/* ✅ PROMO DE APERTURA (con regla clara) */}
          {!hasDiscount && (
            <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/20 border border-cyan-800/50 rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-cyan-200 flex items-center gap-2">
                    🎉 ¡Promoción de Apertura!
                  </h3>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <p className="text-cyan-100">
                        <span className="font-bold">Las PCs completas no generan descuento.</span> Solo los productos adicionales suman para el 5% de descuento en compras mayores a ₡50.000.
                      </p>
                    </div>
                  </div>

                  <p className="text-cyan-100 mb-2">
                    Subtotal con descuento: <span className="font-bold text-cyan-300">₡{subtotalWithDiscount.toLocaleString()}</span>
                  </p>

                  {/* Barra de progreso (solo del subtotal con descuento) */}
                  <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotalWithDiscount / 50000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Faltan: <span className="font-semibold text-cyan-300">₡{(50000 - subtotalWithDiscount).toLocaleString()}</span>
                  </p>
                </div>

                {/* Producto sugerido */}
                {suggestedForPromo && (
                  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 w-full md:w-64 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={suggestedForPromo.image_url || '/placeholder.png'}
                        alt={suggestedForPromo.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-white font-medium text-sm line-clamp-1">
                          {suggestedForPromo.name}
                        </p>
                        <p className="text-cyan-300 font-bold text-sm">
                          ₡{suggestedForPromo.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart({
                        id: suggestedForPromo.id,
                        name: suggestedForPromo.name,
                        price: suggestedForPromo.price,
                        image_url: suggestedForPromo.image_url,
                        category: suggestedForPromo.category,
                        subcategory: suggestedForPromo.subcategory
                      })}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar al carrito
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ✅ Mensaje cuando ya tienes descuento */}
          {hasDiscount && (
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-800/30 border border-emerald-700/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-200 font-medium">
                    ✅ ¡Felicidades! Tienes <span className="font-bold">5% de descuento</span> en productos adicionales
                  </p>
                  <p className="text-emerald-300 text-sm">
                    Aplicado a: ₡{subtotalWithDiscount.toLocaleString()} → Ahorras ₡{discountAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lista de productos */}
          <div className="space-y-5">
            {cart.map(item => (
              <div key={item.id} className="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 shadow-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url || '/placeholder.png'}
                    alt={item.name}
                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-white line-clamp-2">
                      {item.name}
                      {item.category === 'pc-completa' && (
                        <span className="ml-2 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                          Sin descuento
                        </span>
                      )}
                    </h3>
                    <p className="text-cyan-300 text-sm md:text-base">
                      ₡{item.price.toLocaleString('es-CR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 ml-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.history.back()}
            className="block text-center text-blue-300 hover:text-blue-200 mt-5"
          >
            ← Seguir Comprando
          </button>
        </div>

        {/* DERECHA – Resumen */}
        <div className="space-y-6 md:sticky md:top-20">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Resumen</h2>

            <div className="flex justify-between text-blue-200 mb-2">
              <span>Productos:</span>
              <span>{getTotalItems()}</span>
            </div>

            <div className="flex justify-between text-blue-200 mb-4">
              <span>Total sin descuento:</span>
              <span>₡{total.toLocaleString('es-CR')}</span>
            </div>

            {/* ✅ Descuento solo si aplica */}
            {hasDiscount && (
              <>
                <div className="flex justify-between text-blue-200 mb-2">
                  <span>Descuento aplicable a:</span>
                  <span>₡{subtotalWithDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-300 mb-4">
                  <span>Descuento (5%):</span>
                  <span>-₡{discountAmount.toLocaleString()}</span>
                </div>
              </>
            )}

            <div className="h-px w-full bg-slate-600 mb-4"></div>

            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">Total a pagar:</span>
              <span className="text-2xl font-bold text-cyan-300">
                ₡{finalTotal.toLocaleString('es-CR')}
              </span>
            </div>

            <Link
              href="/carrito/checkout"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-center font-semibold transition-all shadow-lg mt-6"
            >
              Generar Orden
            </Link>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Cupón de descuento</h3>
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Escribe tu cupón"
              className="w-full p-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 outline-none"
            />
            <button className="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl transition">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}