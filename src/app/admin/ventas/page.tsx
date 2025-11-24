// src/app/admin/ventas/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'

export default function SalesPage() {
  const { authorized, loading } = useAdminAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!authorized) return

    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, times_ordered, category')
        .order('times_ordered', { ascending: false })

      setProducts(data || [])
      setLoadingData(false)
    }

    fetchProducts()
  }, [authorized])

  if (loading || loadingData) {
    return <div className="pt-16 min-h-screen flex items-center justify-center">Cargando...</div>
  }

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
          <div>
            <h1 className="text-3xl font-bold text-white">Ventas y Popularidad</h1>
            <p className="text-blue-300">Ranking de productos más vendidos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Total productos</p>
            <p className="text-2xl font-bold text-white">{products.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Con ventas</p>
            <p className="text-2xl font-bold text-green-400">
              {products.filter(p => p.times_ordered > 0).length}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Más vendido</p>
            <p className="text-2xl font-bold text-cyan-300">
              {products[0]?.times_ordered || 0}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Total pedidos</p>
            <p className="text-2xl font-bold text-white">
              {products.reduce((sum, p) => sum + p.times_ordered, 0)}
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800 font-semibold text-slate-300 text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Producto</div>
            <div className="col-span-2">Categoría</div>
            <div className="col-span-2">Precio</div>
            <div className="col-span-3">Veces ordenado</div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Aún no hay datos de ventas</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {products.map((product, i) => (
                <div key={product.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-800/50">
                  <div className="col-span-1 text-cyan-300 font-bold">
                    {i + 1}
                  </div>
                  <div className="col-span-4 text-white font-medium">
                    {product.name}
                  </div>
                  <div className="col-span-2 text-slate-300">
                    {product.category === 'pc-completa' ? 'PC' :
                     product.category === 'componentes' ? 'Comp.' : 'Acc.'}
                  </div>
                  <div className="col-span-2 text-cyan-300">
                    ₡{Number(product.price).toLocaleString()}
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ 
                            width: `${Math.min((product.times_ordered / (products[0]?.times_ordered || 1)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-white font-medium w-12">
                        {product.times_ordered}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}