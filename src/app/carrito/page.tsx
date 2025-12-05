// src/app/carrito/page.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingCart, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    addToCart,
  } = useCart()

  const [coupon, setCoupon] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const total = getTotalPrice()

  // ⭐ Categoría más frecuente del carrito
  const mainCategory = cart.length
    ? cart.reduce((acc: Record<string, number>, item: any) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1
      }
      return acc
    }, {})
    : null

  const mostCommonCategory = mainCategory
    ? Object.entries(mainCategory).sort((a, b) => b[1] - a[1])[0][0]
    : null


  // ⭐ Recomendados — lógica avanzada por subcategoría / categoría
  useEffect(() => {
    if (cart.length === 0) return

    const fetchRecommended = async () => {
      // Subcategorías válidas
      const subcategories = [
        ...new Set(cart.map(i => i.subcategory).filter(Boolean) as string[])
      ]

      // Categorías válidas
      const categories = [
        ...new Set(cart.map(i => i.category).filter(Boolean) as string[])
      ]

      const cartIds = cart.map(i => i.id)

      let filterMode = ""
      let filterValues: string[] = []

      // 1️⃣ SOLO UNA SUBCATEGORÍA
      if (subcategories.length === 1) {
        filterMode = "subcategory"
        filterValues = subcategories
      }

      // 2️⃣ VARIAS SUBCATEGORÍAS, PERO UNA SOLA CATEGORÍA
      else if (subcategories.length > 1 && categories.length === 1) {
        filterMode = "category"
        filterValues = categories
      }

      // 3️⃣ VARIAS SUBCATEGORÍAS Y EXACTAMENTE 2 CATEGORÍAS
      else if (subcategories.length > 1 && categories.length === 2) {
        filterMode = "category"
        filterValues = categories
      }

      // 4️⃣ VARIAS SUBCATEGORÍAS Y MÁS DE 2 CATEGORÍAS → dominante
      else if (subcategories.length > 1 && categories.length > 2) {
        const categoryCount = cart.reduce((acc: Record<string, number>, item: any) => {
          if (item.category) {
            acc[item.category] = (acc[item.category] || 0) + 1
          }
          return acc
        }, {})

        const dominantCategory = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])[0][0]

        filterMode = "category"
        filterValues = [dominantCategory]
      }

      // ---------------- QUERY SUPABASE ----------------
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)

      if (filterMode === "subcategory") {
        query = query.in("subcategory", filterValues)
      }

      if (filterMode === "category") {
        query = query.in("category", filterValues)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error en recomendaciones:", error)
        return
      }

      // Excluir productos en carrito
      let filtered = (data || []).filter(p => !cartIds.includes(p.id))

      // Random shuffle
      filtered = filtered.sort(() => Math.random() - 0.5)

      setRecommendations(filtered.slice(0, 12))
    }

    fetchRecommended()
  }, [cart])



  // --------------------------- UI VACÍO --------------------------- //
  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center overflow-hidden">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-blue-600/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-700/40">
            <ShoppingCart className="w-9 h-9 text-white" />
          </div>

          <p className="text-xl text-blue-100 font-semibold mb-2">
            Tu carrito está vacío
          </p>

          <Link
            href="/tienda"
            className="text-blue-300 hover:text-white font-medium transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  // --------------------------- UI PRINCIPAL --------------------------- //
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 overflow-hidden">

      {/* Botón mobile fijo */}
      <div className="fixed bottom-6 left-0 right-0 px-6 md:hidden z-50">
        <Link
          href="/carrito/checkout"
          className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl shadow-lg shadow-blue-900/40 font-semibold"
        >
          Finalizar compra — ₡{total.toLocaleString('es-CR')}
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* IZQUIERDA */}
        <div className="md:col-span-2">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-blue-200 hover:text-white hover:bg-slate-800/60 rounded-xl transition shadow-sm"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Carrito de Compras
            </h1>
          </div>

          {/* Lista productos */}
          <div className="space-y-5">
            {cart.map(item => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 shadow-xl hover:shadow-blue-900/20 transition"
              >
                <div className="flex items-center gap-4">

                  <img
                    src={item.image_url || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white flex-1 leading-tight">
                        {item.name}
                      </h3>

                      {item.is_promo && item.promo_label && (
                        <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow">
                          <Tag className="w-3 h-3" />
                          {item.promo_label}
                        </span>
                      )}
                    </div>

                    {item.is_promo ? (
                      <>
                        <p className="text-slate-400 text-xs line-through">
                          ₡{item.original_price?.toLocaleString('es-CR')}
                        </p>
                        <p className="text-cyan-300 text-lg font-bold">
                          ₡{item.price.toLocaleString('es-CR')}
                        </p>
                      </>
                    ) : (
                      <p className="text-cyan-300 text-lg font-bold mt-1">
                        ₡{item.price.toLocaleString('es-CR')}
                      </p>
                    )}
                  </div>

                  {/* Cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-slate-700/70 hover:bg-slate-600/70 rounded-full flex items-center justify-center text-white transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-white w-6 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-slate-700/70 hover:bg-slate-600/70 rounded-full flex items-center justify-center text-white transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Seguir comprando */}
          <button
            onClick={() => window.history.back()}
            className="block text-center text-blue-300 hover:text-white mt-6 font-medium transition"
          >
            ← Seguir Comprando
          </button>

          {/* ⭐⭐⭐ RECOMENDADOS ABAJO — CARDS PEQUEÑAS ⭐⭐⭐ */}
          {recommendations.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-white mb-4">
                Productos Similares
              </h2>

              <div className="relative">

                {/* Flecha izquierda */}
                <button
                  onClick={() => {
                    const scroller = document.getElementById("carousel-recs")
                    if (scroller) scroller.scrollBy({ left: -260, behavior: 'smooth' })
                  }}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 bg-slate-800/70 border border-slate-700 text-white p-2 rounded-full hover:bg-slate-700 transition hidden md:block z-20"
                >
                  ←
                </button>

                {/* Carrusel */}
                <div
                  id="carousel-recs"
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-3 pr-2 no-scrollbar"
                >
                  {recommendations.map(product => (
                    <div
                      key={product.id}
                      className="min-w-[170px] bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 shadow-lg hover:shadow-blue-900/30 hover:bg-slate-700/40 transition"
                    >
                      {/* Imagen */}
                      <img
                        src={product.image_url}
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />

                      {/* Nombre */}
                      <h4 className="text-white text-xs font-semibold leading-tight line-clamp-2">
                        {product.name}
                      </h4>

                      {/* Precio */}
                      <p className="text-cyan-300 font-bold text-sm mt-1">
                        ₡{product.price.toLocaleString('es-CR')}
                      </p>

                      {/* Botones */}
                      <div className="mt-2 flex flex-col gap-2">
                        <Link
                          href={`/tienda/${product.id}`}
                          className="text-center bg-blue-600 hover:bg-blue-700 text-xs text-white py-1.5 rounded-lg font-medium transition"
                        >
                          Ver
                        </Link>

                        <button
                          onClick={() => addToCart(product)}
                          className="text-center bg-slate-700 hover:bg-slate-600 text-xs text-white py-1.5 rounded-lg font-medium transition"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>


                {/* Flecha derecha */}
                <button
                  onClick={() => {
                    const scroller = document.getElementById("carousel-recs")
                    if (scroller) scroller.scrollBy({ left: 260, behavior: 'smooth' })
                  }}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-800/70 border border-slate-700 text-white p-2 rounded-full hover:bg-slate-700 transition hidden md:block z-20"
                >
                  →
                </button>
              </div>
            </div>
          )}



        </div>

        {/* DERECHA — RESUMEN */}
        <div className="space-y-6 md:sticky md:top-24">

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5">Resumen</h2>

            {/* Productos */}
            <div className="flex justify-between text-blue-200 mb-2">
              <span>Productos:</span>
              <span className="font-semibold">{getTotalItems()}</span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between text-blue-200 mb-2">
              <span>Subtotal:</span>
              <span className="font-semibold">
                ₡{total.toLocaleString('es-CR')}
              </span>
            </div>

            {/* Impuestos */}
            <div className="flex justify-between text-blue-200 mb-2">
              <span>Impuestos:</span>
              <span className="text-slate-400">Incluidos</span>
            </div>

            {/* Tiempo estimado de entrega */}
            <div className="flex justify-between text-blue-200 mb-2">
              <span>Entrega estimada:</span>
              <span className="text-slate-400">2–6 días aprox.</span>
            </div>

            {/* Total final */}
            <div className="flex justify-between text-blue-200 mt-6">
              <span>Total:</span>
              <span className="text-3xl font-bold text-cyan-300">
                ₡{total.toLocaleString('es-CR')}
              </span>
            </div>

            <Link
              href="/carrito/checkout"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-center font-semibold mt-6"
            >
              Generar Orden
            </Link>
          </div>

          {/* Cupón */}
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-3">
              Cupón de descuento
            </h3>

            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Escribe tu cupón"
              className="w-full p-3 rounded-xl bg-slate-700/70 text-white placeholder-slate-400 border border-slate-600 focus:border-blue-400 transition"
            />

            <button className="mt-3 w-full bg-slate-700/80 hover:bg-slate-600 text-white py-2 rounded-xl font-medium">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
