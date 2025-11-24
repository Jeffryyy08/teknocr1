// src/app/gracias/page.tsx
import Link from 'next/link'
import { CheckCircle, Truck } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Animación de Check */}
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">¡Pedido Enviado!</h1>
        
        <p className="text-blue-200 mb-8">
          Hemos recibido tu pedido y te contactaremos pronto por WhatsApp.
        </p>

        {/* Camión animado */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-12">
            <Truck className="w-12 h-12 text-blue-300 animate-pulse" />
          </div>
        </div>

        {/* Botón de volver */}
        <Link
          href="/tienda"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Seguir Comprando
        </Link>
      </div>
    </div>
  )
}