// src/components/ProductActions.tsx
'use client'

import { useCart } from '@/context/CartContext'
import { MessageCircle } from 'lucide-react'

interface ProductActionProps {
  product: {
    id: string
    name: string
    price: number
    image_url?: string
    category?: string
    description?: string
  }
}

export function ProductActions({ product }: ProductActionProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category
    })
  }

  const handleRequestInfo = () => {
    const message =
      `Hola, estoy interesado en obtener más información sobre este producto:\n\n` +
      `Producto: ${product.name}\n` +
      `Precio: ₡${Number(product.price).toLocaleString()}\n` +
      `\n¿Podrían darme más detalles técnicos o disponibilidad?`

    const whatsappUrl = `https://wa.me/50671604429?text=${encodeURIComponent(
      message
    )}`

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
