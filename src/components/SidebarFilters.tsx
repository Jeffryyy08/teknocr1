// src/components/SidebarFilters.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SUBCATEGORIES = {
  'pc-completa': [
    { name: 'Gaming', value: 'gaming' },
    //{ name: 'Oficina', value: 'oficina' },
    //{ name: 'Streaming', value: 'streaming' }
  ],
  'componentes': [
    { name: 'Procesadores', value: 'procesadores' },
    { name: 'Tarjetas Gráficas', value: 'tarjetas-graficas' },
    { name: 'RAM', value: 'ram' },
    { name: 'Almacenamiento', value: 'almacenamiento' },
    { name: 'Motherboards', value: 'motherboards' },
    { name: 'Fuentes de Poder', value: 'fuentes-poder' },
    { name: 'Gabinetes', value: 'gabinetes' },
    { name: 'Refrigeración', value: 'refrigeracion' }
  ],
  'accesorios': [
    { name: 'Monitores', value: 'monitores' },
    { name: 'Teclados', value: 'teclados' },
    { name: 'Mouse', value: 'mouse' },
    { name: 'Audífonos', value: 'audifonos' },
    { name: 'Sillas', value: 'sillas' }
  ]
} as const

type Category = 'all' | 'pc-completa' | 'componentes' | 'accesorios'

interface SidebarFiltersProps {
  currentCategory: Category
}

export default function SidebarFilters({ currentCategory }: SidebarFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get('subcategory') || null
  )
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams.get('perPage')) || 12
  )
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'none')

  // ✅ Estado para conteos
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loadingCounts, setLoadingCounts] = useState(true)

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'pc-completa': currentCategory === 'all' || currentCategory === 'pc-completa',
    'componentes': currentCategory === 'all' || currentCategory === 'componentes',
    'accesorios': currentCategory === 'all' || currentCategory === 'accesorios'
  })

  // ✅ Cargar conteos una sola vez (o al cambiar filtros)
  useEffect(() => {
    const loadCounts = async () => {
      setLoadingCounts(true)

      // Filtros actuales
      const categoryFilter = searchParams.get('category')
      const searchFilter = searchParams.get('search')
      const subcategoryFilter = searchParams.get('subcategory')

      // Construir query base
      let query = supabase
        .from('products')
        .select('category, subcategory', { count: 'exact' })
        .eq('is_active', true)

      // Aplicar filtros actuales
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }
      if (searchFilter) {
        const safeSearch = searchFilter.replace(/[%_]/g, '\\$&')
        query = query.or(`name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading counts:', error)
        setLoadingCounts(false)
        return
      }

      // ✅ Agrupar por (category + subcategory)
      const countMap: Record<string, number> = {}

      // Contar por categoría
      const categoryCounts: Record<string, number> = { 'pc-completa': 0, 'componentes': 0, 'accesorios': 0 }

      // Contar por subcategoría
      const subcategoryCounts: Record<string, number> = {}

      data.forEach(p => {
        // Contar por categoría
        if (categoryCounts[p.category] !== undefined) {
          categoryCounts[p.category]++
        }

        // Contar por subcategoría
        const key = `${p.category}-${p.subcategory || 'otros'}`
        subcategoryCounts[key] = (subcategoryCounts[key] || 0) + 1
      })

      // Combinar
      setCounts({
        ...categoryCounts,
        ...subcategoryCounts
      })
      setLoadingCounts(false)
    }

    loadCounts()
  }, [searchParams]) // ✅ Se actualiza cuando cambian los filtros

  useEffect(() => {
    setSelectedSubcategory(searchParams.get('subcategory'))
  }, [searchParams])

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }))
  }

  const handleSubcategoryClick = (category: string, sub: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    if (sub) params.set('subcategory', sub)
    else params.delete('subcategory')
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('search', search)
    else params.delete('search')
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('perPage', value.toString())
    params.set('page', '1')
    router.push(`?${params.toString()}`)
    setPerPage(value)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'none') params.delete('sort')
    else params.set('sort', value)

    params.set('page', '1')
    router.push(`?${params.toString()}`)
    setSort(value)
  }

  // ✅ Helper para obtener conteo
  const getCount = (key: string): number => counts[key] || 0

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 sticky top-24">

      {/* Búsqueda */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-blue-200 mb-2">Buscar</label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full px-4 py-2.5 pl-4 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                const params = new URLSearchParams(searchParams.toString())
                params.delete('search')
                params.set('page', '1')
                router.push(`?${params.toString()}`)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Limpiar búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={handleSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            aria-label="Buscar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* ✅ Botón de limpiar (solo si hay búsqueda activa) */}
        {search && (
          <button
            onClick={() => {
              setSearch('')
              const params = new URLSearchParams(searchParams.toString())
              params.delete('search')
              params.set('page', '1')
              router.push(`?${params.toString()}`)
            }}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Categorías</h3>

        {(['pc-completa', 'componentes', 'accesorios'] as const).map(cat => {
          const subcats = SUBCATEGORIES[cat] || []
          const isExpanded = expandedCategories[cat]
          const catCount = getCount(cat)

          return (
            <div key={cat} className="mb-3 last:mb-0">
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center justify-between w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <span>
                  {cat === 'pc-completa' ? 'PCs Completas' :
                    cat === 'componentes' ? 'Componentes' : 'Accesorios'}
                  {catCount > 0 && (
                    <span className="ml-2 bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                      {catCount}
                    </span>
                  )}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && subcats.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {subcats.map(sub => {
                    const key = `${cat}-${sub.value}`
                    const count = getCount(key)
                    return (
                      <button
                        key={sub.value}
                        onClick={() => handleSubcategoryClick(cat, sub.value)}
                        className={`block w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${selectedSubcategory === sub.value
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                          }`}
                      >
                        {sub.name}
                        {count > 0 && (
                          <span className="ml-2 bg-slate-700 text-slate-400 text-xs px-1.5 py-0.5 rounded">
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mostrar */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-blue-200 mb-2">Mostrar</label>
        <select
          value={perPage}
          onChange={handlePerPageChange}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value={12}>12 productos</option>
          <option value={24}>24 productos</option>
          <option value={48}>48 productos</option>
        </select>
      </div>

      {/* ORDENAR POR */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-blue-200 mb-2">Ordenar por</label>
        <select
          value={sort}
          onChange={handleSortChange}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">Predeterminado</option>
          <option value="price-asc">Precio: Menor a mayor</option>
          <option value="price-desc">Precio: Mayor a menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
          <option value="newest">Más recientes</option>
        </select>
      </div>

    </div>
  )
}