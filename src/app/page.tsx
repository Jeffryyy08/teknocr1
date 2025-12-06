// src/app/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import type { Review } from '@/types'

// ✅ Marca como dinámico para evitar caché estática en producción
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // ✅ Cargar productos destacados
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, image_url')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(3)

  // ✅ Cargar las últimas 3 calificaciones — con tipado correcto
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen homepage-bg text-white overflow-x-hidden">
      {/* Hero mejorado */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-28 text-center relative z-10">
          <AnimatedSection>
            <div className="mb-6">
              <span className="inline-block bg-blue-900/50 text-blue-300 px-4 py-1 rounded-full text-sm">
                Tekno Costa Rica
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu Tienda Tecnológica en {' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Costa Rica
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
              Venta de componentes y computadoras de alta calidad. Precios bajos y soluciones personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/tienda"
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg"
              >
                <span className="relative z-10">Ver Tienda</span>
                <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
              </Link>
              <Link
                href="/contacto"
                className="border-2 border-blue-400 text-blue-200 hover:bg-blue-900/30 font-bold py-3 px-8 rounded-xl text-lg transition-all backdrop-blur-sm"
              >
                Contáctanos
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Banner Promocional */}
      <div className="w-full flex justify-center bg-transparent mt-10 px-4">
        <AnimatedSection>
          <div className="overflow-hidden shadow-2xl">
            <a href="/tienda">
              <img
                src="/.png"
                alt="1000x250 Tekno"
                className="w-full h-full object-cover"
              />
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* Por qué elegirnos */}
      <div className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por Qué Elegirnos?</h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                No somos solo técnicos, somos tu aliado tecnológico.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🛡️", title: "Garantía", desc: "5 meses de garantía en todos los productos." },
              { icon: "⏱️", title: "Rapidez", desc: "Envios con entrega de 2 a 5 dias." },
              { icon: "💰", title: "Precios bajos", desc: "Productos de distribuidores directos." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-300">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Dinámica: Últimas Calificaciones */}
      <div className="py-20 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
              <p className="text-blue-200">Calificaciones reales de clientes</p>
            </div>
          </AnimatedSection>

          {recentReviews && recentReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentReviews.map((review: Review, i: number) => (
                <AnimatedSection key={review.id} delay={(i + 1) * 0.1}>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, j) => (
                        <span
                          key={j}
                          className={`text-xl ${j < review.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-300 italic mb-4">
                      "{review.comment || 'Sin comentario'}"
                    </p>
                    <p className="text-white font-medium">
                      — {review.name || 'Anónimo'}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(review.created_at).toLocaleDateString('es-CR')}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">
                Aún no hay calificaciones. ¡Sé el primero en dejar tu opinión!
              </p>
              <Link
                href="/contacto"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Deja tu Calificación
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Productos destacados */}
      {products && products.length > 0 && (
        <div className="py-20 bg-blue-900/10">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
                <p className="text-blue-200">Lo más popular en nuestra tienda</p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <AnimatedSection key={product.id} delay={(i + 1) * 0.1}>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                    {product.image_url ? (
                      <div className="h-48 bg-slate-900 flex items-center justify-center">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-slate-900 flex items-center justify-center text-slate-600">
                        Sin imagen
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <p className="text-2xl font-bold text-cyan-300 mb-4">
                        ₡{Number(product.price).toLocaleString()}
                      </p>
                      <Link
                        href={`/tienda/${product.id}`}
                        className="block w-full text-center bg-blue-700 hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium transition"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Final */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">¿Listo para mejorar tu experiencia tecnológica?</h2>
              <p className="text-blue-200 mb-8">
                Contáctanos hoy y obtén asesoría personalizada sin compromiso.
              </p>
              <Link
                href="/contacto"
                className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Contáctanos Ahora
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}