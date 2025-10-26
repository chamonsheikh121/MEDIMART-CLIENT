import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const rawBody = await req.text()
    const params = new URLSearchParams(rawBody)

    const tran_id = params.get('tran_id')
    const val_id = params.get('val_id')
    const amount = params.get('amount')
    const status = params.get('status')

    console.log('✅ Payment Data:', { tran_id, val_id, amount, status })

    // You can save this data to DB here_https://medimart-client-site.vercel.app
    const redirectUrl = 'https://medimart-client-site.vercel.app/payment/failed'
    return Response.redirect(redirectUrl.toString(), 302)
}

export async function GET() {
    return NextResponse.json({
        status: 'success',
        message: 'Payment failed endpoint working properly!',
        note: 'This route is used by SSLCommerz to redirect after payment.',
    })
}