import { NextResponse } from 'next/server'

// This route handles Chrome DevTools requests to suppress 404 errors in the console
export async function GET() {
  return NextResponse.json({}, { status: 404 })
}
