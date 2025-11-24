// src/components/CategoryNav.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const categories = [
  {
    name: 'PCs Completas',
    href: '/tienda/pcs',
    subcategories: [
      { name: 'Gaming', href: '/tienda/pcs/gaming' },
      { name: 'Oficina', href: '/tienda/pcs/oficina' },
      { name: 'Streaming', href: '/tienda/pcs/streaming' },
      { name: 'Hogar', href: '/tienda/pcs/hogar' }
    ]
  },
  {
    name: 'Componentes',
    href: '/tienda/componentes',
    subcategories: [
      { name: 'Procesadores', href: '/tienda/componentes/procesadores' },
      { name: 'Tarjetas Gráficas', href: '/tienda/componentes/tarjetas-graficas' },
      { name: 'RAM', href: '/tienda/componentes/ram' },
      { name: 'Almacenamiento', href: '/tienda/componentes/almacenamiento' },
      { name: 'Motherboards', href: '/tienda/componentes/motherboards' },
      { name: 'Fuentes de Poder', href: '/tienda/componentes/fuentes-poder' },
      { name: 'Gabinetes', href: '/tienda/componentes/gabinetes' },
      { name: 'Refrigeración', href: '/tienda/componentes/refrigeracion' }
    ]
  },
  {
    name: 'Accesorios',
    href: '/tienda/accesorios',
    subcategories: [
      { name: 'Monitores', href: '/tienda/accesorios/monitores' },
      { name: 'Teclados', href: '/tienda/accesorios/teclados' },
      { name: 'Mouse', href: '/tienda/accesorios/mouse' },
      { name: 'Audífonos', href: '/tienda/accesorios/audifonos' },
      { name: 'Sillas', href: '/tienda/accesorios/sillas' }
    ]
  }
]

export default function CategoryNav() {
  const [openCategory, setOpenCategory] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMouseEnter = (index: number) => {
    if (isMobile) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenCategory(index)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null)
    }, 300) // ✅ Delay de 300ms para evitar cierre accidental
  }

  const handleCategoryClick = (e: React.MouseEvent, index: number, hasSub: boolean) => {
    if (isMobile && hasSub) {
      e.preventDefault() // ✅ Evita navegación si hay subcategorías
      setOpenCategory(openCategory === index ? null : index)
    }
  }

  return (
    <div className="relative z-20">
      {/* Menú horizontal */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
        {categories.map((category, i) => (
          <div
            key={category.name}
            className="relative"
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={category.href}
              className="px-4 py-2.5 text-sm md:text-base font-medium text-blue-200 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
              onClick={(e) => handleCategoryClick(e, i, category.subcategories.length > 0)}
            >
              {category.name}
              {category.subcategories.length > 0 && (
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openCategory === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>

            {/* Submenú desplegable */}
            {category.subcategories.length > 0 && openCategory === i && (
              <div
                className="absolute left-0 mt-1 w-56 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 z-50 overflow-hidden"
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
                // ✅ Zona segura para evitar cierre al mover el cursor
                style={{ paddingTop: '8px', paddingBottom: '8px' }}
              >
                <div className="py-1">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                      onClick={() => {
                        if (isMobile) setOpenCategory(null)
                      }}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overlay para móvil */}
      {openCategory !== null && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpenCategory(null)}
        />
      )}
    </div>
  )
}