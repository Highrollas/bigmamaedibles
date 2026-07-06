import { NextResponse } from 'next/server'
import Ably from 'ably'

export async function GET() {
      // Use the PRIVATE key on the server only
      const client = new Ably.Rest(process.env.ABLY_API_KEY!)

      // Create a signed token request
      const tokenRequest = await client.auth.createTokenRequest({
            ttl: 60 * 60 * 1000, // token valid for 1 hour
      })

      return NextResponse.json(tokenRequest)
}

