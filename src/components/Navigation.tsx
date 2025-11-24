// src/components/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-700">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <img
                        src="/logo.png"
                        alt="TeknoCR Logo"
                        className="h-15 w-auto" // ajusta el tamaño según necesites
                    />
                    {/* Opcional: si quieres mantener el texto "TeknoCR" */}
                </Link>

                {/* Menú desktop */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="text-white hover:text-blue-300 transition">Inicio</Link>
                    <Link href="/tienda" className="text-white hover:text-blue-300 transition">Tienda</Link>
                    <Link href="/sobre-nosotros" className="text-white hover:text-blue-300 transition">Sobre Nosotros</Link>
                    <Link href="/contacto" className="text-white hover:text-blue-300 transition">Contáctenos</Link>
                    <Link href="/armarpc" className="text-white hover:text-blue-300 transition">Arma tu PC</Link>
                </div>

                {/* Menú mobile */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Menú mobile */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-slate-800 border-t border-slate-700"
                >
                    <div className="flex flex-col p-4 space-y-4">
                        <Link href="/" className="text-white hover:text-blue-300 transition" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                        <Link href="/tienda" className="text-white hover:text-blue-300 transition" onClick={() => setIsMenuOpen(false)}>Tienda</Link>
                        <Link href="/sobre-nosotros" className="text-white hover:text-blue-300 transition" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
                        <Link href="/contacto" className="text-white hover:text-blue-300 transition" onClick={() => setIsMenuOpen(false)}>Contáctenos</Link>
                        <Link href="/armarpc" className="text-white hover:text-blue-300 transition" onClick={() => setIsMenuOpen(false)}>Arma tu PC</Link>
                    </div>
                </motion.div>
            )}
        </nav>
    )
}