// src/app/tienda/ProductList.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Plus, Tag } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  category: 'pc-completa' | 'componentes' | 'accesorios'
  subcategory?: string
  specifications?: any
  // ✅ Campos de promoción
  promo_price?: number | null
  promo_label?: string
  promo_start?: string
  promo_end?: string
}

interface ProductListProps {
  products: Product[]
  page: number
  totalPages: number
  perPage: number
  search?: string
  category?: string
  sort?: string
}

export default function ProductList({
  products,
  page,
  totalPages,
  perPage,
  search,
  category,
  sort
}: ProductListProps) {
  const { addToCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }



  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  const setPerPage = (newPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('perPage', newPerPage.toString())
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  // ✅ Helper para verificar si la promoción está activa
  const isPromoActive = (product: Product) => {
    if (!product.promo_price || product.promo_price >= product.price) return false

    const now = new Date()
    const start = product.promo_start ? new Date(product.promo_start) : null
    const end = product.promo_end ? new Date(product.promo_end) : null

    if (start && now < start) return false
    if (end && now > end) return false

    return true
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => {
          const isActivePromo = isPromoActive(product)
          const displayPrice = isActivePromo ? product.promo_price! : product.price
          const originalPrice = isActivePromo ? product.price : null

          return (
            <div key={product.id} className="flex flex-col">
              <Link href={`/tienda/${product.id}`} className="block flex-1">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 relative">
                  {/* ✅ Etiqueta de promoción */}
                  {isActivePromo && product.promo_label && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                      {product.promo_label}
                    </div>
                  )}

                  {product.image_url ? (
                    <div className="h-36 md:h-40 bg-slate-900 flex items-center justify-center p-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-36 md:h-40 bg-slate-900 flex items-center justify-center text-slate-600">
                      <span className="text-sm">Sin imagen</span>
                    </div>
                  )}
                  <div className="p-3">
                    <span className="text-xs text-blue-400 uppercase font-semibold truncate">
                      {product.category === 'pc-completa' ? 'PC Completa' :
                        product.category === 'componentes' ? 'Componente' : 'Accesorio'}
                    </span>
                    <h3 className="text-sm md:text-base font-semibold text-white mt-1 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* ✅ Precios con promoción */}
                    <div className="mt-2">
                      {originalPrice ? (
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500 line-through">
                            ₡{originalPrice.toLocaleString('es-CR')}
                          </p>
                          <p className="text-lg md:text-xl font-bold text-cyan-300">
                            ₡{displayPrice.toLocaleString('es-CR')}
                          </p>
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-400" />
                            <span className="text-xs text-amber-400 font-medium">
                              -{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg md:text-xl font-bold text-cyan-300">
                          ₡{displayPrice.toLocaleString('es-CR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 w-full flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-medium text-xs md:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={!product.id}
              >
                <Plus className="w-3 h-3" />
                <span>Agregar</span>
              </button>
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
            </svg>
          </div>
          <p className="text-slate-400 text-base md:text-lg">No se encontraron productos.</p>
          <p className="text-slate-500 text-sm mt-1">Intenta ajustar los filtros o buscar con otras palabras.</p>
        </div>
      )}
    </>
  )
}