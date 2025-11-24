// src/components/Pagination.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    page: number
    totalPages: number
}

export default function Pagination({ page, totalPages }: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Función para construir la URL con nuevos parámetros
    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(newPage))
        return `?${params.toString()}`
    }

    // Solo mostrar si hay más de 1 página
    if (totalPages <= 1) return null

    return (
        <div className="mt-12 flex flex-col items-center">
            {/* Móvil: solo Anterior y Siguiente */}
            <div className="lg:hidden flex space-x-2">
                <button
                    onClick={() => router.push(createPageUrl(Math.max(1, page - 1)))}
                    disabled={page <= 1}
                    className="flex items-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:text-slate-500 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                </button>
                <button
                    onClick={() => router.push(createPageUrl(Math.min(totalPages, page + 1)))}
                    disabled={page >= totalPages}
                    className="flex items-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:text-slate-500 disabled:cursor-not-allowed transition"
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>

            {/* Escritorio: Anterior, 2 3 4, Siguiente */}
            <div className="hidden lg:flex items-center space-x-1">
                <button
                    onClick={() => router.push(createPageUrl(Math.max(1, page - 1)))}
                    disabled={page <= 1}
                    className="flex items-center px-3 py-2 border border-slate-700 text-sm font-medium rounded-l-lg bg-slate-800 hover:bg-slate-700 text-white disabled:text-slate-500 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                </button>

                {/* Números de página */}
                {(() => {
                    const pages: (number | '...')[] = []

                    if (totalPages <= 5) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i)
                    } else {
                        pages.push(1)
                        if (page > 3) pages.push('...')
                        const start = Math.max(2, page - 1)
                        const end = Math.min(totalPages - 1, page + 1)
                        for (let i = start; i <= end; i++) pages.push(i)
                        if (page < totalPages - 2) pages.push('...')
                        pages.push(totalPages)
                    }

                    return pages.map((pageNum, i) =>
                        pageNum === '...' ? (
                            <span
                                key={`ellipsis-${i}`} // ✅ Clave única para puntos suspensivos
                                className="px-3 py-2 text-slate-400"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={`page-${pageNum}`} // ✅ Clave única por número de página
                                onClick={() => router.push(createPageUrl(pageNum))}
                                className={`px-3 py-2 border border-slate-700 text-sm font-medium ${pageNum === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        )
                    )
                })()}

                <button
                    onClick={() => router.push(createPageUrl(Math.min(totalPages, page + 1)))}
                    disabled={page >= totalPages}
                    className="flex items-center px-3 py-2 border border-slate-700 text-sm font-medium rounded-r-lg bg-slate-800 hover:bg-slate-700 text-white disabled:text-slate-500 disabled:cursor-not-allowed transition"
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>

            {/* Indicador de página (opcional, bonito en móvil) */}
            <p className="mt-4 text-slate-400 text-sm">
                Página {page} de {totalPages}
            </p>
        </div>
    )
}