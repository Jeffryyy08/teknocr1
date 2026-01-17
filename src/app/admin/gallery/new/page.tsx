// src/app/admin/gallery/new/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'

export default function NewGalleryPC() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  
  // ✅ Estado principal (array de strings)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    image_url: '',
    additional_images: [] as string[]
  })

  // ✅ Estado temporal para el textarea (string sin procesar)
  const [tempAdditionalImages, setTempAdditionalImages] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validaciones
      if (!formData.title.trim()) throw new Error('El título es obligatorio')
      if (!formData.budget || parseFloat(formData.budget) <= 0) throw new Error('El presupuesto debe ser mayor a 0')
      if (!formData.image_url.trim()) throw new Error('La URL de la imagen principal es obligatoria')

      const { error } = await supabase
        .from('gallery_pcs')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          budget: parseFloat(formData.budget),
          image_url: formData.image_url.trim(),
          additional_images: formData.additional_images // ✅ Array de URLs
        })

      if (error) throw error

      router.push('/admin/gallery')
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/gallery"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Nueva PC en Galería</h1>
              <p className="text-blue-300">Agrega una PC armada para mostrar a tus clientes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Título de la PC *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: PC Gaming RTX 4070"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe los componentes principales, uso recomendado, etc."
                />
              </div>

              {/* Presupuesto */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Presupuesto (₡) *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  min="1"
                  step="1000"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="850000"
                  required
                />
              </div>

              {/* Imagen principal */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Imagen Principal *
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://i.imgur.com/abc123.jpg"
                    required
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Usa una URL directa (Imgur, Google Drive público, etc.)
                </p>
                
                {/* Vista previa */}
                {formData.image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-blue-300 mb-2">Vista previa:</p>
                    <img
                      src={formData.image_url}
                      alt="Vista previa"
                      className="w-32 h-32 object-cover rounded-lg border border-slate-600"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Imágenes adicionales - ✅ Versión robusta */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Imágenes Adicionales (opcional)
                </label>
                <p className="text-slate-400 text-xs mb-2">
                  Separa las URLs con comas. Ej: https://i.imgur.com/a.jpg, https://i.imgur.com/b.jpg
                </p>
                <div className="relative">
                  <textarea
                    value={tempAdditionalImages}
                    onChange={e => setTempAdditionalImages(e.target.value)}
                    onBlur={() => {
                      // ✅ Procesar solo cuando pierde foco
                      const urls = tempAdditionalImages
                        .split(',')
                        .map(url => url.trim())
                        .filter(url => url.startsWith('http'))
                      setFormData(prev => ({ ...prev, additional_images: urls }))
                    }}
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="https://i.imgur.com/foto1.jpg, https://i.imgur.com/foto2.jpg"
                  />
                </div>
                {formData.additional_images.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {formData.additional_images.map((url, i) => (
                      <img 
                        key={i} 
                        src={url} 
                        alt={`Adicional ${i + 1}`} 
                        className="w-16 h-16 object-cover rounded border border-slate-600"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-4 pt-4">
                <Link
                  href="/admin/gallery"
                  className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl font-semibold transition"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Crear PC
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  )
}