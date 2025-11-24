// src/app/tienda/SortFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortFilter({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    const value = e.target.value
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    // Mantén otros parámetros (search, category, page, etc.)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <select
      value={defaultValue}
      onChange={handleChange}
      className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Más recientes</option>
      <option value="price-asc">Precio: menor a mayor</option>
      <option value="price-desc">Precio: mayor a menor</option>
    </select>
  )
}