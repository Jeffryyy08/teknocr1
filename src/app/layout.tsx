// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { CartProvider } from '@/context/CartContext'
import { FloatingCartButton } from '@/components/FloatingCartButton'
import Footer from '@/components/Footer'
import React from 'react'
import { CartNotification } from '@/components/CartNotification'
import CookieBanner from "@/components/CookieBanner"

export const metadata: Metadata = {
  title: 'TeknoCR - Tienda de PCs',
  description: 'Expertos en venta de computadoras, mantenimiento y cambio de piezas. Calidad y confianza garantizada.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K3DLB4FS');
            `,
          }}
        />
      </head>

      <body className={`${inter.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K3DLB4FS"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <CartProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
          <FloatingCartButton />
          <CartNotification />
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  )
}
