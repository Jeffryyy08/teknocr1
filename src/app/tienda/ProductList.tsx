// src/app/tienda/ProductList.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  category: 'pc-completa' | 'componentes' | 'accesorios'
  subcategory?: string // ✅ Añadido (opcional)
  specifications?: any

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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      subcategory: product.subcategory
    })
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

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="flex flex-col">
            <Link href={`/tienda/${product.id}`} className="block flex-1">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                {product.image_url ? (
                  <div className="h-32 bg-slate-900 flex items-center justify-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-slate-900 flex items-center justify-center text-slate-600">
                    Sin imagen
                  </div>
                )}
                <div className="p-3">
                  <span className="text-xs text-blue-400 uppercase font-semibold">
                    {product.category === 'pc-completa' ? 'PC Completa' :
                      product.category === 'componentes' ? 'Componentes' : 'Accesorios'}
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-white mt-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-cyan-300 mt-2">
                    ₡{Number(product.price).toLocaleString('es-CR')}
                  </p>
                </div>
              </div>
            </Link>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 w-full flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-medium text-xs md:text-sm transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-3 h-3" />
              <span>Agregar</span>
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm md:text-base">No se encontraron productos.</p>
        </div>
      )}
    </>
  )
}