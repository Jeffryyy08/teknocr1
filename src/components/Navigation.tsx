// src/components/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isChristmas, setIsChristmas] = useState(false)

    // Detectar si el tema es navideño
    useEffect(() => {
        const theme = document.body.getAttribute("data-theme")
        setIsChristmas(theme === "christmas")
    }, [])

    // Glow solo en scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50
                bg-slate-900/80 backdrop-blur-md border-b border-slate-700
                transition-all duration-300
                ${scrolled && isChristmas ? "nav-frost" : ""}
            `}
        >
            {/* Barra decorativa navideña solo si es navidad */}
            {isChristmas && <div className="christmas-strip"></div>}

            {/* Resto del navbar igual */}
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.png" alt="TeknoCR Logo" className="h-14 w-auto" />
                </Link>

                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="nav-link">Inicio</Link>
                    <Link href="/tienda" className="nav-link">Tienda</Link>
                    <Link href="/sobre-nosotros" className="nav-link">Sobre Nosotros</Link>
                    <Link href="/contacto" className="nav-link">Contáctenos</Link>
                    <Link href="/armarpc" className="nav-link">Arma tu PC</Link>
                    <Link href="/galeria" className="nav-link">Nuestro Arte</Link>
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-slate-800 border-t border-slate-700"
                >
                    <div className="flex flex-col p-4 space-y-4">
                        <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                        <Link href="/tienda" className="nav-link" onClick={() => setIsMenuOpen(false)}>Tienda</Link>
                        <Link href="/sobre-nosotros" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
                        <Link href="/contacto" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contáctenos</Link>
                        <Link href="/armarpc" className="nav-link" onClick={() => setIsMenuOpen(false)}>Arma tu PC</Link>
                        <Link href="/galeria" className="nav-link" onClick={() => setIsMenuOpen(false)}>Nuestro Arte</Link>

                    </div>
                </motion.div>
            )}
        </nav>
    )
}
