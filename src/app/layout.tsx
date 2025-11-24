// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { CartProvider } from '@/context/CartContext'
import { FloatingCartButton } from '@/components/FloatingCartButton'
import Footer from '@/components/Footer' // ✅ Importado
import React from 'react' // ✅ Necesario para React.ReactNode
import { CartNotification } from '@/components/CartNotification' // ✅
import CookieBanner from "@/components/CookieBanner"; 


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeknoCR - Tienda de PCs',
  description: 'Expertos en venta de computadoras, mantenimiento y cambio de piezas. Calidad y confianza garantizada.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode // ✅ Correcto con React importado
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        
        <CartProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
          <FloatingCartButton />
          <CartNotification />
          <Footer /> {/* ✅ Añadido */}
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  )
}