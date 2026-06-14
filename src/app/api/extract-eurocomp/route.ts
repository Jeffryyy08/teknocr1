// src/app/api/extract-eurocomp/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    // Este endpoint solo redirige a tu Railway
    // En producción, tu formulario llamará directamente a Railway
    
    return NextResponse.json({
      error: 'Usa directamente la API de Railway'
    }, { status: 400 })
    
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error en extracción' },
      { status: 500 }
    )
  }
}