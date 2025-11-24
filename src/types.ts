// src/types.ts
export interface CartItem {
  id: string
  name: string
  price: number
  image_url?: string
  quantity: number
  category: string
  subcategory?: string 
}

export interface Review {
  id: string
  name?: string
  rating: number
  comment?: string
  created_at: string
}

export interface Order {
  discount: number
  discount_amount: number
  id: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  products: Array<{
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: 'pendiente' | 'en proceso' | 'completado'
  created_at: string
}

export interface PageParams {
  subcategory?: string
}