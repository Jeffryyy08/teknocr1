// src/app/admin/products/edit/[id]/page.tsx (versión final y corregida)
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react'
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
    { value: 'streaming', label: 'Streaming' },
    { value: 'hogar', label: 'Hogar' }
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

export default function EditProduct() {
  const { authorized, loading: authLoading } = useAdminAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    is_featured: false,
    is_active: true,
    image_url: '',
    times_ordered: 0,
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

  useEffect(() => {
    if (!productId || authLoading || authorized === false) return

    const fetchProduct = async () => {
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) throw error

        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            category: product.category || '',
            subcategory: product.subcategory || '',
            is_featured: product.is_featured || false,
            is_active: product.is_active || true,
            image_url: product.image_url || '',
            times_ordered: product.times_ordered ?? 0,
            specifications: product.specifications || {
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
        }
      } catch (error) {
        console.error('Error loading product:', error)
        alert('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, authLoading, authorized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // ✅ Validación de precio
      const price = parseFloat(formData.price)
      if (isNaN(price) || price < 0) {
        throw new Error('El precio debe ser un número positivo')
      }

      // ✅ Construir datos seguros
      const updateData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        category: formData.category,
        subcategory: formData.subcategory || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        image_url: formData.image_url || '',
        times_ordered: formData.times_ordered ?? 0,
        updated_at: new Date().toISOString()
      }

      // ✅ Solo incluir especificaciones si es PC completa
      if (formData.category === 'pc-completa') {
        updateData.specifications = formData.specifications
      } else {
        updateData.specifications = {} // o null, según tu esquema
      }

      // ✅ Depuración útil
      console.log('📝 Enviando actualización:', { productId, updateData })

      const { error, data } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select() // ✅ Para obtener feedback inmediato

      if (error) {
        // ✅ Mensaje claro y útil
        const msg = error.message || JSON.stringify(error)
        throw new Error(`Supabase: ${msg}`)
      }

      if (!data || data.length === 0) {
        throw new Error('No se encontró el producto (¿ID incorrecto o RLS bloqueando?)')
      }

      alert('✅ Producto actualizado correctamente')
      router.push('/admin/products')
    } catch (error: any) {
      // ✅ Error legible y con contexto
      const errorMsg = error?.message || 'Error desconocido'
      console.error('❌ Error detallado al actualizar producto:', {
        error,
        productId,
        formData
      })
      alert(`❌ Error: ${errorMsg}\n\n💡 Verifica las políticas RLS en Supabase para la tabla 'products'.`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      alert('🗑️ Producto eliminado correctamente')
      router.push('/admin/products')
    } catch (error: any) {
      const errorMsg = error?.message || 'Error al eliminar'
      console.error('❌ Error eliminando producto:', error)
      alert(`❌ ${errorMsg}`)
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-200">
            {authLoading ? 'Verificando acceso...' : 'Cargando producto...'}
          </p>
        </div>
      </div>
    )
  }

  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/products"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Editar Producto</h1>
              <p className="text-blue-300">Modifica o elimina este producto</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campo de URL de imagen */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">URL de la Imagen</h2>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.image_url && (
              <div className="mt-4">
                <img
                  src={formData.image_url}
                  alt="Vista previa"
                  className="w-32 h-32 object-contain rounded-lg border border-slate-600"
                />
              </div>
            )}
          </div>

          {/* Información Básica */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: PC Gamer Ryzen 5 + RTX 3060"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Precio (₡) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="450000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Subcategoría
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.category}
                >
                  <option value="">Seleccionar subcategoría</option>
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
                <label className="text-sm font-medium text-blue-200">
                  Producto destacado
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-blue-200">
                  Producto activo
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe el producto en detalle..."
              />
            </div>
          </div>

          {/* Especificaciones */}
          {formData.category === 'pc-completa' && (
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Procesador</label>
                  <input
                    type="text"
                    value={formData.specifications.procesador}
                    onChange={(e) => handleSpecChange('procesador', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: AMD Ryzen 5 5600X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Tarjeta Gráfica</label>
                  <input
                    type="text"
                    value={formData.specifications.tarjeta_grafica}
                    onChange={(e) => handleSpecChange('tarjeta_grafica', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: NVIDIA RTX 3060 12GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">RAM</label>
                  <input
                    type="text"
                    value={formData.specifications.ram}
                    onChange={(e) => handleSpecChange('ram', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 16GB DDR4 3200MHz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Almacenamiento</label>
                  <input
                    type="text"
                    value={formData.specifications.almacenamiento}
                    onChange={(e) => handleSpecChange('almacenamiento', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 1TB NVMe SSD"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex gap-3">
              <Link
                href="/admin/products"
                className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </Link>
            </div>
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
                  <span>Actualizar Producto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Eliminar producto?</h3>
              <p className="text-slate-400 mb-6">
                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}