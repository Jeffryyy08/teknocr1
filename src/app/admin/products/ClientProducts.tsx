// src/app/admin/products/ClientProducts.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, AlertTriangle, Plus, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function ClientProducts({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [subcategoryFilter, setSubcategoryFilter] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // Filtros locales
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter
    const matchesSubcategory = subcategoryFilter === '' || product.subcategory === subcategoryFilter
    return matchesSearch && matchesCategory && matchesSubcategory
  })

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(products.filter(p => p.id !== id))
      alert('🗑️ Producto eliminado correctamente')
    } catch (error) {
      alert('❌ Error al eliminar el producto')
    } finally {
      setShowDeleteModal(false)
      setProductToDelete(null)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/admin/products/new" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </Link>
          <Link 
            href="/admin/products/bulk" 
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar en Lote</span>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-blue-200 mb-2">Buscar por Nombre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej: AMD Ryzen"
                className="w-full pl-10 pr-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-2">Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setSubcategoryFilter('')
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="pc-completa">PC Completa</option>
              <option value="componentes">Componentes</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-2">Subcategoría</label>
            <select
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              disabled={!categoryFilter}
            >
              <option value="">Todas las subcategorías</option>
              {categoryFilter === 'pc-completa' && (
                <>
                  <option value="gaming">Gaming</option>
                  <option value="oficina">Oficina</option>
                  <option value="streaming">Streaming</option>
                  <option value="hogar">Hogar</option>
                </>
              )}
              {categoryFilter === 'componentes' && (
                <>
                  <option value="procesadores">Procesadores</option>
                  <option value="tarjetas-graficas">Tarjetas Gráficas</option>
                  <option value="almacenamiento">Almacenamiento</option>
                  <option value="ram">RAM</option>
                  <option value="motherboards">Motherboards</option>
                  <option value="fuentes-poder">Fuentes de Poder</option>
                  <option value="gabinetes">Gabinetes</option>
                  <option value="refrigeracion">Refrigeración</option>
                </>
              )}
              {categoryFilter === 'accesorios' && (
                <>
                  <option value="monitores">Monitores</option>
                  <option value="teclados">Teclados</option>
                  <option value="mouse">Mouse</option>
                  <option value="audifonos">Audífonos</option>
                  <option value="sillas">Sillas</option>
                </>
              )}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setSubcategoryFilter('')
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700 shadow-lg">
              <div>
                <h3 className="text-white font-semibold">{product.name}</h3>
                <p className="text-cyan-300">₡{Number(product.price).toLocaleString()}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  product.is_active 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-red-900/50 text-red-300'
                }`}>
                  {product.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link 
                  href={`/admin/products/edit/${product.id}`} 
                  className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                >
                  Editar
                </Link>
                <button
                  onClick={() => {
                    setProductToDelete(product.id)
                    setShowDeleteModal(true)
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            {initialProducts.length > 0 
              ? 'No se encontraron productos con los filtros aplicados.' 
              : 'No hay productos aún.'
            }
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link 
              href="/admin/products/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg"
            >
              Crear Primer Producto
            </Link>
            <Link 
              href="/admin/products/bulk" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg"
            >
              Agregar en Lote
            </Link>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Eliminar producto?</h3>
              <p className="text-slate-400 mb-6">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => productToDelete && handleDelete(productToDelete)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}