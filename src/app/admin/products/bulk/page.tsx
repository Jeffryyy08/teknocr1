// src/app/admin/products/bulk/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Plus, Save, Trash2, Tag, Calendar, Percent } from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const categories = [
  { value: 'pc-completa', label: 'PC Completa' },
  { value: 'componentes', label: 'Componentes' },
  { value: 'accesorios', label: 'Accesorios' }
]

const subcategories = {
  'pc-completa': ['gaming', 'oficina', 'streaming', 'hogar'],
  'componentes': ['procesadores', 'tarjetas-graficas', 'almacenamiento', 'ram', 'motherboards', 'fuentes-poder', 'gabinetes', 'refrigeracion'],
  'accesorios': ['monitores', 'teclados', 'mouse', 'audifonos', 'sillas']
}

export default function BulkProductCreate() {
  const { authorized, loading: authLoading } = useAdminAuth()
  const router = useRouter()

  // ✅ Configuración rápida
  const [bulkPrefix, setBulkPrefix] = useState('')
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkSubcategory, setBulkSubcategory] = useState('')
  // ✅ Campos de promoción por defecto
  const [bulkPromoPrice, setBulkPromoPrice] = useState('')
  const [bulkPromoLabel, setBulkPromoLabel] = useState('Oferta')

  const [products, setProducts] = useState([{
    name: bulkPrefix,
    description: '',
    price: '',
    // ✅ Campos de promoción
    promo_price: bulkPromoPrice,
    promo_start: '',
    promo_end: '',
    promo_label: bulkPromoLabel,
    category: bulkCategory,
    subcategory: bulkSubcategory,
    is_featured: false,
    is_active: true,
    image_url: '',
    specifications: {
      procesador: '',
      tarjeta_grafica: '',
      ram: '',
      almacenamiento: '',
      fuente_poder: '',
      gabinete: '',
      motherboard: '',
      sistema_operativo: ''
    }
  }])
  const [saving, setSaving] = useState(false)

  if (authLoading) return <div>Cargando...</div>
  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  const addProduct = () => {
    setProducts([...products, {
      name: bulkPrefix,
      description: '',
      price: '',
      promo_price: bulkPromoPrice,
      promo_start: '',
      promo_end: '',
      promo_label: bulkPromoLabel,
      category: bulkCategory,
      subcategory: bulkSubcategory,
      is_featured: false,
      is_active: true,
      image_url: '',
      specifications: {
        procesador: '',
        tarjeta_grafica: '',
        ram: '',
        almacenamiento: '',
        fuente_poder: '',
        gabinete: '',
        motherboard: '',
        sistema_operativo: ''
      }
    }])
  }

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const updateProduct = (index: number, field: string, value: any) => {
    setProducts(products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ))
  }

  const updateSpec = (index: number, key: string, value: string) => {
    setProducts(products.map((product, i) => 
      i === index 
        ? { ...product, specifications: { ...product.specifications, [key]: value } }
        : product
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const productsToInsert = products.map(p => ({
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        // ✅ Datos de promoción
        promo_price: p.promo_price ? parseFloat(p.promo_price) : null,
        promo_start: p.promo_start || null,
        promo_end: p.promo_end || null,
        promo_label: p.promo_label || 'Oferta',
        category: p.category,
        subcategory: p.subcategory,
        is_featured: p.is_featured,
        is_active: p.is_active,
        image_url: p.image_url || null,
        specifications: p.specifications
      }))

      // ✅ Validación previa
      for (const p of productsToInsert) {
        if (p.promo_price && p.promo_price >= p.price) {
          throw new Error(`El precio promocional debe ser menor al precio normal para "${p.name}"`)
        }
      }

      const { error } = await supabase
        .from('products')
        .insert(productsToInsert)

      if (error) throw error

      alert(`✅ ${products.length} producto${products.length > 1 ? 's' : ''} creados correctamente`)
      router.push('/admin/products')
    } catch (error: any) {
      const errorMsg = error.message || 'Error al crear los productos'
      alert(`❌ ${errorMsg}`)
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products" className="text-white hover:text-blue-300">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Agregar Productos en Lote</h1>
          </div>
          <button
            onClick={addProduct}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
          </button>
        </div>

        {/* ✅ Configuración rápida con promoción */}
        <div className="bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-600">
          <h3 className="font-medium text-blue-200 mb-3">Configuración Rápida (opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-blue-200">Prefijo de Nombre</label>
              <input 
                type="text" 
                value={bulkPrefix}
                onChange={e => setBulkPrefix(e.target.value)}
                placeholder="Ej: AMD Ryzen"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200">Categoría</label>
              <select
                value={bulkCategory}
                onChange={e => {
                  setBulkCategory(e.target.value)
                  setBulkSubcategory('')
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option value="">Seleccionar</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-blue-200">Subcategoría</label>
              <select
                value={bulkSubcategory}
                onChange={e => setBulkSubcategory(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                disabled={!bulkCategory}
              >
                <option value="">Seleccionar</option>
                {bulkCategory && subcategories[bulkCategory as keyof typeof subcategories]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-amber-300 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Etiqueta Promoción
              </label>
              <input
                type="text"
                value={bulkPromoLabel}
                onChange={e => setBulkPromoLabel(e.target.value)}
                placeholder="Oferta"
                className="w-full bg-slate-700 border border-amber-900/50 rounded px-3 py-2 text-amber-300"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {products.map((product, index) => (
            <div key={index} className="bg-slate-800/70 p-6 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Producto {index + 1}</h3>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={e => updateProduct(index, 'name', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Precio Normal (₡) *</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={e => updateProduct(index, 'price', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-300 mb-2 flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    Precio Promocional (₡)
                  </label>
                  <input
                    type="number"
                    value={product.promo_price}
                    onChange={e => updateProduct(index, 'promo_price', e.target.value)}
                    className="w-full bg-slate-700 border border-amber-900/50 rounded px-3 py-2 text-amber-300"
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Categoría *</label>
                  <select
                    value={product.category}
                    onChange={e => updateProduct(index, 'category', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Subcategoría</label>
                  <select
                    value={product.subcategory}
                    onChange={e => updateProduct(index, 'subcategory', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    disabled={!product.category}
                  >
                    <option value="">Seleccionar</option>
                    {product.category && subcategories[product.category as keyof typeof subcategories]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">URL de Imagen</label>
                  <input
                    type="url"
                    value={product.image_url}
                    onChange={e => updateProduct(index, 'image_url', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm text-blue-200 mb-2">Descripción</label>
                  <textarea
                    value={product.description}
                    onChange={e => updateProduct(index, 'description', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    rows={3}
                  />
                </div>
              </div>

              {/* ✅ Fechas de promoción */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-amber-300 mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Fecha Inicio Promo
                  </label>
                  <input
                    type="date"
                    value={product.promo_start}
                    onChange={e => updateProduct(index, 'promo_start', e.target.value)}
                    className="w-full bg-slate-700 border border-amber-900/50 rounded px-3 py-2 text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-300 mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Fecha Fin Promo
                  </label>
                  <input
                    type="date"
                    value={product.promo_end}
                    onChange={e => updateProduct(index, 'promo_end', e.target.value)}
                    className="w-full bg-slate-700 border border-amber-900/50 rounded px-3 py-2 text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-300 mb-2">Etiqueta Personalizada</label>
                  <input
                    type="text"
                    value={product.promo_label}
                    onChange={e => updateProduct(index, 'promo_label', e.target.value)}
                    placeholder="Oferta"
                    maxLength={20}
                    className="w-full bg-slate-700 border border-amber-900/50 rounded px-3 py-2 text-amber-300"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-blue-200">
                  <input
                    type="checkbox"
                    checked={product.is_featured}
                    onChange={e => updateProduct(index, 'is_featured', e.target.checked)}
                    className="rounded"
                  />
                  <span>Destacado</span>
                </label>
                <label className="flex items-center space-x-2 text-blue-200">
                  <input
                    type="checkbox"
                    checked={product.is_active}
                    onChange={e => updateProduct(index, 'is_active', e.target.checked)}
                    className="rounded"
                  />
                  <span>Activo</span>
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Crear {products.length} Producto{products.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}