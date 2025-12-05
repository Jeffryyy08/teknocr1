// src/app/admin/products/page.tsx
import { AuthGuard } from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase'
import { ClientProducts } from './ClientProducts'
import { Package, Box, AlertTriangle } from 'lucide-react'

export default async function AdminProducts() {
  // ✅ Cargar TODOS los productos (sin filtrar por is_active)
  const {  data: allProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const totalProducts = allProducts?.length || 0
  const activeProducts = allProducts?.filter(p => p.is_active).length || 0
  const inactiveProducts = allProducts?.filter(p => !p.is_active).length || 0

  return (
    <AuthGuard>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-6">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Panel de Productos
            </h1>
            <p className="text-blue-200 mt-2">
              Administra, edita y organiza los productos de tu tienda.
            </p>
          </div>

          {/* MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total productos */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600/30 rounded-xl">
                  <Package className="text-blue-300 w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Total de Productos</p>
                  <h2 className="text-3xl font-bold text-white">{totalProducts}</h2>
                </div>
              </div>
            </div>

            {/* Activos */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-600/30 rounded-xl">
                  <Box className="text-emerald-300 w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Productos Activos</p>
                  <h2 className="text-3xl font-bold text-white">{activeProducts}</h2>
                </div>
              </div>
            </div>

            {/* Inactivos */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-600/30 rounded-xl">
                  <AlertTriangle className="text-amber-300 w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Productos Inactivos</p>
                  <h2 className="text-3xl font-bold text-white">{inactiveProducts}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <ClientProducts initialProducts={allProducts || []} />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}