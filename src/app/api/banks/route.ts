import { NextResponse } from 'next/server'

const SMEPLUG_API_KEY = 'ed4155359e54d7d9ee3e7b5726829ba16666aa8c074fbfde643a096cef486c7f'

export async function GET() {
  try {
    const response = await fetch('https://smeplug.ng/api/v1/transfer/banks', {
      headers: {
        'Authorization': `Bearer ${SMEPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      },
      // Add cache: 'no-store' to prevent caching
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch banks')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching banks:', error)
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 })
  }
} 