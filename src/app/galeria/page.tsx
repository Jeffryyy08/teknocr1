// src/app/galeria/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'

interface GalleryPC {
  id: string
  title: string
  description: string | null
  budget: number
  image_url: string
  additional_images?: string[]
  is_active: boolean
  created_at: string
}

export default function GalleryPage() {
  const [pcs, setPcs] = useState<GalleryPC[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPcs()
  }, [])

  const fetchPcs = async () => {
    const { data } = await supabase
      .from('gallery_pcs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setPcs(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (pcs.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-8-8l4.586 4.586a2 2 0 012.828 0L16 8m-8 8v6m0 0l4.586-4.586M16 16l-4.586 4.586" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Galería de PCs Armadas</h1>
          <p className="text-slate-300 mb-6">
            Aún no hay PCs en la galería. ¡Pronto las agregaremos!
          </p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Nuestra Galería de PCs Armadas
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl">
            Descubre nuestras creaciones personalizadas, diseñadas para cada necesidad.
          </p>
        </div>

        {/* Grid de PCs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pcs.map(pc => (
            <div
              key={pc.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300"
            >
              {/* Imagen principal (cuadrada, centrada) */}
              <div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
                {pc.image_url ? (
                  <img
                    src={pc.image_url}
                    alt={pc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-slate-600">Sin imagen</div>
                )}
              </div>

              {/* Contenido (siempre visible, debajo de la imagen) */}
              <div className="p-4 bg-slate-800/70">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-white line-clamp-1">{pc.title}</h3>
                  <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                    Activa
                  </span>
                </div>
                <p className="text-cyan-300 font-bold mb-2">
                  ₡{Number(pc.budget).toLocaleString()}
                </p>
                {pc.description && (
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {pc.description}
                  </p>
                )}

                {/* Botón "Ver detalles" */}
                <div className="mt-3">
                  <Link
                    href={`/galeria/${pc.id}`}
                    className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 text-sm"
                  >
                    Ver detalles
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Etiqueta de presupuesto en esquina superior derecha */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                ₡{Number(pc.budget).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Botón "Volver" */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}