// src/app/tienda/page.tsx
import { supabase } from '@/lib/supabase'
import ProductList from './ProductList'
import SidebarFilters from '@/components/SidebarFilters'
import { AnimatedSection } from '@/components/AnimatedSection'
import Pagination from '@/components/Pagination' // ✅ Añadido

export default async function TiendaPage({
  searchParams
}: {
  searchParams?: Promise<{
    search?: string
    category?: string
    subcategory?: string
    sort?: string
    page?: string
    perPage?: string
  }>
}) {
  const params = await searchParams || {}
  const {
    search = '',
    category = '',
    subcategory = '',
    sort = '',
    page: pageStr = '1',
    perPage: perPageStr = '12'
  } = params

  const page = parseInt(pageStr)
  const perPage = parseInt(perPageStr)
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (search) {
    const safeSearch = search.replace(/[%_]/g, '\\$&')
    query = query.or(`name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`)
  }
  if (category) query = query.eq('category', category)
  if (subcategory) query = query.eq('subcategory', subcategory)

  if (sort === 'price-asc') query = query.order('price', { ascending: true })
  else if (sort === 'price-desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(from, to)

  const { data: products, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 container mx-auto px-4 py-12">
        <div className="text-center text-red-400 py-20">
          <p>Error al cargar los productos.</p>
        </div>
      </div>
    )
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestra <span className="text-blue-400">Tienda</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Descubre nuestras PCs y componentes de alta calidad
          </p>
        </div>

        {/* Banner */}
        <div className="w-full flex justify-center bg-transparent mt-10 px-4">
          <AnimatedSection>
            <div className="overflow-hidden shadow-2xl">
              <img
                src="/desca1.png"
                alt="Banner Tekno"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Contenido */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <SidebarFilters currentCategory="all" />
          </div>

          {/* Productos */}
          <div className="flex-1">
            <ProductList 
              products={products || []} 
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              search={search}
              category={category}
              sort={sort}
            />

            {/* ✅ Paginación (solo si hay más de 1 página) */}
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}