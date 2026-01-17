// src/app/admin/gallery/edit/[id]/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Trash2, AlertTriangle, Image as ImageIcon } from 'lucide-react'

interface GalleryPC {
    id: string
    title: string
    description: string | null
    budget: number
    image_url: string
    additional_images?: string[]
    is_active: boolean
}

export default function EditGalleryPC() {
    const router = useRouter()
    const params = useParams()
    const pcId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // ✅ Estado principal (array de strings)
    const [formData, setFormData] = useState<GalleryPC>({
        id: '',
        title: '',
        description: null,
        budget: 0,
        image_url: '',
        additional_images: [],
        is_active: true
    })

    // ✅ Estado temporal para el textarea (string sin procesar)
    const [tempAdditionalImages, setTempAdditionalImages] = useState('')

    useEffect(() => {
        if (!pcId) return

        const fetchPC = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery_pcs')
                    .select('*')
                    .eq('id', pcId)
                    .single()

                if (error) throw error

                const images = data.additional_images || []
                setFormData({
                    id: data.id,
                    title: data.title || '',
                    description: data.description,
                    budget: data.budget || 0,
                    image_url: data.image_url || '',
                    additional_images: images,
                    is_active: data.is_active
                })
                // ✅ Sincronizar estado temporal con datos reales
                setTempAdditionalImages(images.join(', '))
            } catch (error: any) {
                alert(`❌ Error al cargar la PC: ${error.message}`)
                router.push('/admin/gallery')
            } finally {
                setLoading(false)
            }
        }

        fetchPC()
    }, [pcId, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (!formData.title.trim()) throw new Error('El título es obligatorio')
            if (formData.budget <= 0) throw new Error('El presupuesto debe ser mayor a 0')
            if (!formData.image_url.trim()) throw new Error('La URL de la imagen principal es obligatoria')

            const { error } = await supabase
                .from('gallery_pcs')
                .update({
                    title: formData.title.trim(),
                    description: formData.description?.trim() || null,
                    budget: formData.budget,
                    image_url: formData.image_url.trim(),
                    additional_images: formData.additional_images,
                    updated_at: new Date().toISOString()
                })
                .eq('id', pcId)

            if (error) throw error

            router.push('/admin/gallery')
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const { error } = await supabase
                .from('gallery_pcs')
                .delete()
                .eq('id', pcId)

            if (error) throw error

            router.push('/admin/gallery')
        } catch (error: any) {
            alert(`❌ Error al eliminar: ${error.message}`)
        } finally {
            setDeleting(false)
            setShowDeleteModal(false)
        }
    }

    if (loading) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <AuthGuard>
            <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/gallery"
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Editar PC en Galería</h1>
                                <p className="text-blue-300">Modifica los detalles de esta PC armada</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={deleting}
                            className="flex items-center gap-2 bg-red-700/50 hover:bg-red-700 text-red-300 px-4 py-2.5 rounded-lg transition disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </button>
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
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value || null })}
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
                                    onChange={e => {
                                        const val = parseFloat(e.target.value)
                                        if (!isNaN(val)) {
                                            setFormData({ ...formData, budget: val })
                                        }
                                    }}
                                    min="1"
                                    step="1" // ✅ Ahora permite cualquier número entero
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
                                            // ✅ Procesar al perder foco
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
                                {formData.additional_images && formData.additional_images.length > 0 && (
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
                                            Actualizar PC
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal de confirmación */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">¿Eliminar PC?</h3>
                                <p className="text-slate-400 mb-6">
                                    Esta acción no se puede deshacer. La PC será eliminada permanentemente.
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
        </AuthGuard>
    )
}