// src/components/ProductActions.tsx
'use client'

import { useCart } from '@/context/CartContext'
import { MessageCircle } from 'lucide-react'

interface ProductActionProps {
  product: {
    id: string
    name: string
    price: number
    promo_price?: number | string | null
    promo_start?: string | null
    promo_end?: string | null
    promo_label?: string | null
    image_url?: string
    category?: string
    description?: string
  }
}

// ✅ Helper para verificar si la promoción está activa
const isPromoActive = (product: ProductActionProps['product']) => {
  if (!product.promo_price) return false

  const promoPriceNumber = Number(product.promo_price)
  if (isNaN(promoPriceNumber) || promoPriceNumber >= product.price) return false
  
  const now = new Date()
  const start = product.promo_start ? new Date(product.promo_start) : null
  const end = product.promo_end ? new Date(product.promo_end) : null
  
  if (start && now < start) return false
  if (end && now > end) return false
  
  return true
}

export function ProductActions({ product }: ProductActionProps) {
  const { addToCart } = useCart()

  const isActivePromo = isPromoActive(product)
  const finalPromoPrice = isActivePromo ? Number(product.promo_price) : null

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,

      // 🔥 Siempre enviamos el precio ORIGINAL
      price: product.price,

      image_url: product.image_url,
      category: product.category,

      // 🔥 Enviamos TODA la info de promoción (aunque no esté activa)
      promo_price: finalPromoPrice,
      promo_start: product.promo_start ?? null,
      promo_end: product.promo_end ?? null,
      promo_label: product.promo_label ?? null,
    })
  }

  const handleRequestInfo = () => {
    const priceDisplay = isActivePromo 
      ? `₡${Number(product.price).toLocaleString()} (antes) → ₡${Number(finalPromoPrice).toLocaleString()} (ahora)`
      : `₡${Number(product.price).toLocaleString()}`

    const message =
      `Hola, estoy interesado en obtener más información sobre este producto:\n\n` +
      `Producto: ${product.name}\n` +
      `Precio: ${priceDisplay}\n` +
      `\n¿Podrían darme más detalles técnicos o disponibilidad?`

    const whatsappUrl = `https://wa.me/50671604429?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={handleAddToCart}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Agregar al Carrito
      </button>

      <button
        onClick={handleRequestInfo}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Solicitar Información</span>
      </button>
    </div>
  )
}
