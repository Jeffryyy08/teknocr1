// src/components/FloatingCartButton.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function FloatingCartButton() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()
  const pathname = usePathname()

  // ❌ No mostrar si NO hay productos
  if (totalItems === 0) return null

  // ❌ No mostrar en el carrito ni en checkout
  const hideOn = ['/carrito', '/carrito/checkout']
  if (hideOn.includes(pathname)) return null

  return (
    <Link
      href="/carrito"
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  )
}
