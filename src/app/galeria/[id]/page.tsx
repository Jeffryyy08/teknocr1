// src/app/galeria/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'

interface GalleryPC {
  id: string
  title: string
  description: string | null
  budget: number
  image_url: string
  additional_images?: string[] // ✅ Añadido
  is_active: boolean
  created_at: string
}

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const [pc, setPc] = useState<GalleryPC | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPC = async () => {
      const resolvedParams = await params
      const { id } = resolvedParams

      if (!id) return notFound()

      const { data, error } = await supabase
        .from('gallery_pcs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        notFound()
        return
      }

      setPc(data)
      setLoading(false)
    }

    fetchPC()
  }, [params])

  const handleRequestInfo = () => {
    if (!pc) return

    const message =
      `Hola, estoy interesado en obtener más información sobre esta PC armada:\n\n` +
      `Título: ${pc.title}\n` +
      `Presupuesto: ₡${Number(pc.budget).toLocaleString()}\n` +
      `${pc.description ? `\nDescripción:\n${pc.description}\n` : ''}` +
      `\n¿Podrían darme más detalles técnicos o disponibilidad?`

    const whatsappUrl = `https://wa.me/50671604429?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!pc) return null

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botón "Volver" */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la galería
        </button>

        {/* Contenedor principal */}
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
          {/* ✅ Galería de imágenes */}
          <div className="p-4">
            {pc.additional_images && pc.additional_images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Imagen principal (más grande) */}
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  {pc.image_url ? (
                    <img
                      src={pc.image_url}
                      alt={pc.title}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-slate-600">Sin imagen</div>
                  )}
                </div>
                
                {/* Imágenes adicionales */}
                <div className="grid grid-cols-2 gap-4">
                  {pc.additional_images.map((url, i) => (
                    <div key={i} className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={url}
                        alt={`Detalle ${i + 1}`}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Solo imagen principal
              <div className="h-80 md:h-96 bg-slate-900 flex items-center justify-center">
                {pc.image_url ? (
                  <img
                    src={pc.image_url}
                    alt={pc.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-slate-600 text-lg">Sin imagen disponible</div>
                )}
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{pc.title}</h1>
                <p className="text-cyan-300 text-xl font-bold mt-2">
                  Presupuesto: ₡{Number(pc.budget).toLocaleString()}
                </p>
              </div>
              <span className="inline-block bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                Disponible para armado
              </span>
            </div>

            {pc.description && (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-white mb-3">Descripción</h2>
                <p className="text-slate-300 whitespace-pre-line">
                  {pc.description}
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-medium text-white mb-4">¿Te interesa esta configuración?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRequestInfo}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Información
                </button>
                <Link
                  href="/tienda"
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                  Ver Productos
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>
            ¿Quieres una PC personalizada?{' '}
            <Link href="/contacto" className="text-blue-400 hover:text-blue-300">
              Contáctanos
            </Link>{' '}
            y arma tu propia configuración.
          </p>
        </div>
      </div>
    </div>
  )
}