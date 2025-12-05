// src/app/admin/products/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Tag, Calendar, Percent } from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const categories = [
  { value: 'pc-completa', label: 'PC Completa' },
  { value: 'componentes', label: 'Componentes' },
  { value: 'accesorios', label: 'Accesorios' }
]

const subcategories = {
  'pc-completa': [
    { value: 'gaming', label: 'Gaming' },
    { value: 'oficina', label: 'Oficina' },
  ],
  'componentes': [
    { value: 'procesadores', label: 'Procesadores' },
    { value: 'tarjetas-graficas', label: 'Tarjetas Gráficas' },
    { value: 'almacenamiento', label: 'Almacenamiento' },
    { value: 'ram', label: 'RAM' },
    { value: 'motherboards', label: 'Motherboards' },
    { value: 'fuentes-poder', label: 'Fuentes de Poder' },
    { value: 'gabinetes', label: 'Gabinetes' },
    { value: 'refrigeracion', label: 'Refrigeración' }
  ],
  'accesorios': [
    { value: 'monitores', label: 'Monitores' },
    { value: 'teclados', label: 'Teclados' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'audifonos', label: 'Audífonos' },
    { value: 'sillas', label: 'Sillas' }
  ]
}

export default function NewProduct() {
  const { authorized, loading: authLoading } = useAdminAuth()
  const router = useRouter()

  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    // ✅ Campos de promoción
    promo_price: '',
    promo_start: '',
    promo_end: '',
    promo_label: 'Oferta',
    category: '',
    subcategory: '',
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
  })

  // Protección de ruta
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-200">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const insertData: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        specifications: formData.specifications,
        image_url: formData.image_url || null,
        // ✅ Datos de promoción
        promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
        promo_start: formData.promo_start || null,
        promo_end: formData.promo_end || null,
        promo_label: formData.promo_label || 'Oferta'
      }

      // ✅ Validación: si hay precio promocional, debe ser menor al normal
      if (formData.promo_price && parseFloat(formData.promo_price) >= parseFloat(formData.price)) {
        throw new Error('El precio promocional debe ser menor al precio normal')
      }

      const { error } = await supabase
        .from('products')
        .insert(insertData)

      if (error) throw error

      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert('Error al crear el producto: ' + (error.message || 'Verifica los datos'))
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSpecChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/products"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Nuevo Producto</h1>
              <p className="text-blue-200">Completa la información del nuevo producto</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de URL de imagen */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">URL de la Imagen</h2>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-slate-400 text-sm mt-2">
              Usa una URL directa (Imgur, Google Drive público, etc.)
            </p>
          </div>

          {/* Información básica */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Nombre *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Precio Normal (₡) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Categoría *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Subcategoría</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.category}
                >
                  <option value="">Seleccionar</option>
                  {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-blue-200">Producto destacado</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-blue-200">Producto activo</label>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-blue-200 mb-2">Descripción *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* ✅ PROMOCIONES */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              Promoción (Opcional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2 flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  Precio Promocional (₡)
                </label>
                <input
                  type="number"
                  name="promo_price"
                  value={formData.promo_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="Ej: 350000"
                  className="w-full px-4 py-3 bg-slate-700 border border-amber-900/50 rounded-lg text-amber-300 placeholder-amber-500 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  name="promo_start"
                  value={formData.promo_start}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-amber-900/50 rounded-lg text-amber-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  name="promo_end"
                  value={formData.promo_end}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-amber-900/50 rounded-lg text-amber-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">Etiqueta</label>
                <input
                  type="text"
                  name="promo_label"
                  value={formData.promo_label}
                  onChange={handleInputChange}
                  placeholder="Oferta"
                  maxLength={20}
                  className="w-full px-4 py-3 bg-slate-700 border border-amber-900/50 rounded-lg text-amber-300 placeholder-amber-500 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
              <p className="text-amber-400 text-sm">
                <span className="font-medium">💡 Consejo:</span> El precio promocional debe ser menor al precio normal. 
                La etiqueta aparecerá en la esquina superior derecha del producto.
              </p>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          {formData.category === 'pc-completa' && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Procesador</label>
                  <input
                    type="text"
                    value={formData.specifications.procesador}
                    onChange={(e) => handleSpecChange('procesador', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Tarjeta Gráfica</label>
                  <input
                    type="text"
                    value={formData.specifications.tarjeta_grafica}
                    onChange={(e) => handleSpecChange('tarjeta_grafica', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">RAM</label>
                  <input
                    type="text"
                    value={formData.specifications.ram}
                    onChange={(e) => handleSpecChange('ram', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Almacenamiento</label>
                  <input
                    type="text"
                    value={formData.specifications.almacenamiento}
                    onChange={(e) => handleSpecChange('almacenamiento', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Fuente de Poder</label>
                  <input
                    type="text"
                    value={formData.specifications.fuente_poder}
                    onChange={(e) => handleSpecChange('fuente_poder', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Gabinete</label>
                  <input
                    type="text"
                    value={formData.specifications.gabinete}
                    onChange={(e) => handleSpecChange('gabinete', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Motherboard</label>
                  <input
                    type="text"
                    value={formData.specifications.motherboard}
                    onChange={(e) => handleSpecChange('motherboard', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Sistema Operativo</label>
                  <input
                    type="text"
                    value={formData.specifications.sistema_operativo}
                    onChange={(e) => handleSpecChange('sistema_operativo', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Crear Producto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}