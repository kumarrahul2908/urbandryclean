import { NextResponse } from 'next/server'

// Minimal API — Phase 1 is WhatsApp-driven, no DB writes yet.
export async function GET(request, { params }) {
  const path = (params?.path || []).join('/')
  if (path === 'health' || path === '') {
    return NextResponse.json({ status: 'ok', service: 'Urban Dry Clean', timestamp: new Date().toISOString() })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST(request, { params }) {
  const path = (params?.path || []).join('/')
  // Placeholder for future enquiry-form storage in Phase 2.
  if (path === 'enquiry') {
    try {
      const body = await request.json()
      return NextResponse.json({ status: 'received', echo: body })
    } catch (e) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
