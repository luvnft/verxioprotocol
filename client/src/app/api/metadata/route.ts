import { NextResponse, type NextRequest } from 'next/server'
import { pinata } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data) {
      return NextResponse.json({ error: 'No metadata provided' }, { status: 400 })
    }

    const { cid } = await pinata.upload.public.json(data)
    const url = await pinata.gateways.public.convert(cid)
    return NextResponse.json(url, { status: 200 })
  } catch (e) {
    console.error('Error uploading metadata:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
