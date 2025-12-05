// src/context/CartContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image_url?: string
  quantity: number
  category?: string
  subcategory?: string

  // Datos de promoción
  promo_price?: number | null
  promo_start?: string | null
  promo_end?: string | null
  promo_label?: string | null

  // UI
  original_price?: number
  is_promo: boolean
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (
    item: Omit<CartItem, 'quantity' | 'original_price' | 'is_promo'>
  ) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  showNotification: (item: CartItem) => void
  notification: CartItem | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [notification, setNotification] = useState<CartItem | null>(null)

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (!saved) return

      const parsed = JSON.parse(saved) as CartItem[]

      setCart(
        parsed.map(item => ({
          ...item,
          // Asegurar booleano válido
          is_promo: Boolean(item.is_promo ?? false)
        }))
      )
    } catch {
      console.warn('⚠️ Invalid cart data in localStorage — resetting.')
      setCart([])
    }
  }, [])

  // Guardar carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (
    item: Omit<CartItem, 'quantity' | 'original_price' | 'is_promo'>
  ) => {
    // Validar promoción
    const hasValidPromo =
      typeof item.promo_price === 'number' &&
      item.promo_price > 0 &&
      item.promo_price < item.price

    const is_promo = hasValidPromo

    const finalPrice = is_promo ? item.promo_price! : item.price
    const original_price = is_promo ? item.price : undefined

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)

      if (existing) {
        const updatedItem: CartItem = {
          ...existing,
          quantity: existing.quantity + 1,
          price: finalPrice,
          original_price,
          is_promo,

          // Actualizar datos promo (no perder nada)
          promo_price: item.promo_price ?? existing.promo_price ?? null,
          promo_start: item.promo_start ?? existing.promo_start ?? null,
          promo_end: item.promo_end ?? existing.promo_end ?? null,
          promo_label: item.promo_label ?? existing.promo_label ?? null
        }

        showNotification(updatedItem)
        return prev.map(i => (i.id === item.id ? updatedItem : i))
      }

      const newItem: CartItem = {
        ...item,
        quantity: 1,
        price: finalPrice,
        original_price,
        is_promo,

        promo_price: item.promo_price ?? null,
        promo_start: item.promo_start ?? null,
        promo_end: item.promo_end ?? null,
        promo_label: item.promo_label ?? null
      }

      showNotification(newItem)
      return [...prev, newItem]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id)

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0)

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const showNotification = (item: CartItem) => {
    setNotification(item)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        showNotification,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
