// src/app/api/extract-eurocomp/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 })
    }

    const RENDER_BASE_URL =
      process.env.EUROCOMP_SCRAPER_URL || 'https://extract-i1f5.onrender.com'

    const response = await fetch(`${RENDER_BASE_URL}/extract-eurocomp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Error en extracción', details: data },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error en extracción', details: error?.message || null },
      { status: 500 }
    )
  }
}

