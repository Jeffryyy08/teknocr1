// src/app/admin/gallery/page.tsx
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Plus, Eye, Edit3, Trash2, Image as ImageIcon } from 'lucide-react'

interface GalleryPC {
  id: string
  title: string
  description: string | null
  budget: number
  image_url: string
  is_active: boolean
  created_at: string
}

export default function AdminGallery() {
  const [pcs, setPcs] = useState<GalleryPC[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPcs()
  }, [])

  const fetchPcs = async () => {
    const { data } = await supabase
      .from('gallery_pcs')
      .select('*')
      .order('created_at', { ascending: false })

    setPcs(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta PC de la galería?')) return

    const { error } = await supabase
      .from('gallery_pcs')
      .delete()
      .eq('id', id)

    if (!error) {
      setPcs(pcs.filter(pc => pc.id !== id))
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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Galería de PCs Armadas</h1>
              <p className="text-blue-300">Muestra tu trabajo profesional a los clientes</p>
            </div>
            <Link
              href="/admin/gallery/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Nueva PC
            </Link>
          </div>

          {pcs.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Aún no has agregado PCs a la galería.</p>
              <Link
                href="/admin/gallery/new"
                className="mt-4 inline-block text-blue-400 hover:text-blue-300"
              >
                + Agregar tu primera PC
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pcs.map(pc => (
                <div key={pc.id} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-xl transition">
                  <div className="h-48 bg-slate-900 flex items-center justify-center">
                    {pc.image_url ? (
                      <img
                        src={pc.image_url}
                        alt={pc.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-600">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold line-clamp-1">{pc.title}</h3>
                      {pc.is_active && (
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                          Activa
                        </span>
                      )}
                    </div>
                    <p className="text-cyan-300 font-bold">₡{Number(pc.budget).toLocaleString()}</p>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {pc.description || 'Sin descripción'}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/admin/gallery/edit/${pc.id}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded text-sm"
                      >
                        <Edit3 className="w-3 h-3" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(pc.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-700/50 hover:bg-red-700 text-red-300 py-1.5 rounded text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}