// src/app/tienda/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ProductActions } from '@/components/ProductActions'
import { Star, Send } from 'lucide-react'

// ✅ Lista de palabras prohibidas
const BAD_WORDS = [
  'puta', 'puto', 'mierda', 'chinga', 'verga', 'pendejo', 'pendeja',
  'culero', 'culera', 'joto', 'maricón', 'maricona', 'pinche', 'wey',
  'huevón', 'huevona', 'idiota', 'estúpido', 'estúpida'
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    comment: ''
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    const fetchProductAndMore = async () => {
      const resolvedParams = await params
      const { id } = resolvedParams

      if (!id) return notFound()

      const [productRes, reviewsRes, relatedRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single(),
        supabase
          .from('reviewsprod')
          .select('*')
          .eq('product_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('products')
          .select('id, name, price, image_url, category, subcategory')
          .eq('subcategory', product?.subcategory || '')
          .neq('id', id)
          .eq('is_active', true)
          .limit(4)
      ])

      if (productRes.error || !productRes.data) return notFound()

      setProduct(productRes.data)
      setReviews(reviewsRes.data || [])
      setRelatedProducts(relatedRes.data || [])
      setLoading(false)
    }

    fetchProductAndMore()
  }, [params, product?.subcategory])

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess(false)

    const { name, rating, comment } = reviewForm

    // ✅ Validaciones
    if (!name.trim()) return setFormError('El nombre es obligatorio')
    if (!comment.trim()) return setFormError('El comentario es obligatorio')
    if (rating < 1 || rating > 5) return setFormError('Selecciona una calificación válida')

    // ✅ Filtro de palabras inadecuadas
    const lowerComment = comment.toLowerCase()
    const badWord = BAD_WORDS.find(word => 
      lowerComment.includes(word) || 
      name.toLowerCase().includes(word)
    )

    if (badWord) {
      return setFormError(`❌ Evita palabras inapropiadas como: "${badWord}"`)
    }

    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('reviewsprod')
        .insert({
          product_id: product.id,
          name: name.trim(),
          rating: Number(rating),
          comment: comment.trim()
        })

      if (error) throw error

      // ✅ Actualizar UI sin recargar
      const newReview = {
        id: crypto.randomUUID(),
        product_id: product.id,
        name: name.trim(),
        rating: Number(rating),
        comment: comment.trim(),
        created_at: new Date().toISOString()
      }

      setReviews(prev => [newReview, ...prev])
      setReviewForm({ name: '', rating: 5, comment: '' })
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 3000)
    } catch (err: any) {
      const errorMessage = err?.message || 'Error desconocido'
      setFormError(`❌ No se pudo guardar la reseña: ${errorMessage}`)
      console.error('Error completo:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* ✅ Botón "Volver a la tienda" */}
        <button
          onClick={() => window.history.back()}
          className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-1"
        >
          ← Volver
        </button>

        {/* ✅ Contenedor principal: Imagen a la izquierda, detalles a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Imagen */}
          <div>
            <div className="bg-slate-800 rounded-2xl p-6">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-[500px] mx-auto"
                />
              ) : (
                <div className="text-slate-500 text-lg text-center py-12">
                  Sin imagen disponible
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Detalles del producto */}
          <div>
            <span className="text-sm text-blue-400 uppercase font-semibold">
              {product.category === 'pc-completa'
                ? 'PC Completa'
                : product.category === 'componentes'
                  ? 'Componente'
                  : 'Accesorio'}
            </span>

            <h1 className="text-3xl font-bold text-white mt-2">{product.name}</h1>

            <p className="text-slate-300 mt-4 text-lg whitespace-pre-line">
              {product.description}
            </p>

            {product.category === 'pc-completa' &&
              product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="mt-6 space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-slate-400 min-w-[180px] capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-white font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            <div className="mt-6 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-3xl font-bold text-cyan-300">
                ₡{Number(product.price).toLocaleString()}
              </p>
              <p className="text-slate-400 mt-1">Precio en colones costarricenses</p>
            </div>

            <ProductActions product={product} />
          </div>
        </div>

        {/* ✅ Sección de reseñas (debajo de los detalles, en toda la anchura) */}
        <div className="mt-8">
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Opiniones de clientes
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/40 rounded-lg border border-slate-700">
                <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">
                  Este producto aún no tiene reseñas.
                  <br />
                  <span className="text-slate-500 text-sm">
                    ¡Sé el primero en compartir tu experiencia!
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 bg-slate-800/40 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-medium">{review.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-300 italic">"{review.comment}"</p>
                    )}
                    <p className="text-slate-500 text-sm mt-1">
                      {new Date(review.created_at).toLocaleDateString('es-CR')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Escribe tu reseña</h3>

              {formSuccess && (
                <div className="mb-4 p-3 bg-green-900/30 text-green-300 rounded-lg text-sm">
                  ✅ ¡Gracias! Tu reseña se ha enviado correctamente.
                </div>
              )}

              {formError && (
                <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Calificación *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1"
                        aria-label={`Calificar con ${star} estrellas`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    {reviewForm.rating} de 5 estrellas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Comentario *
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuenta tu experiencia con este producto..."
                    maxLength={500}
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Máx. 500 caracteres • No se permiten palabras inadecuadas
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar reseña
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ✅ Carrusel de productos similares (debajo de reseñas, en toda la anchura) */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Productos Similares</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <div key={p.id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:bg-slate-800 transition">
                    <div className="h-40 bg-slate-900 flex items-center justify-center p-4">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-slate-600">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-white font-medium text-sm line-clamp-2">{p.name}</p>
                      <p className="text-cyan-300 font-bold mt-2">₡{Number(p.price).toLocaleString()}</p>
                      <button
                        onClick={() => window.location.href = `/tienda/${p.id}`}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-lg transition"
                      >
                        Ver producto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}