import { NextRequest, NextResponse } from 'next/server'
import {
  verifySmtpConnection,
  sendPartnerConfirmationEmail,
  getBaseSiteUrl,
} from '@/lib/email'

export async function GET() {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
  const resendKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM

  const status = {
    environment: process.env.NODE_ENV,
    resolvedSiteUrl: getBaseSiteUrl(),
    envVariablesDetected: {
      SMTP_USER: smtpUser ? `${smtpUser.slice(0, 3)}***@${smtpUser.split('@')[1] || ''}` : 'MISSING',
      SMTP_PASS: smtpPass ? 'CONFIGURED (length: ' + smtpPass.length + ')' : 'MISSING',
      EMAIL_FROM: emailFrom || 'Using default',
      RESEND_API_KEY: resendKey ? 'CONFIGURED' : 'NOT SET',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
      VERCEL_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'NOT SET',
    },
    smtpVerification: {
      status: 'pending',
      error: null as string | null,
    },
  }

  if (smtpUser && smtpPass) {
    const verifyResult = await verifySmtpConnection()
    if (verifyResult.success) {
      status.smtpVerification.status = 'READY'
    } else {
      status.smtpVerification.status = 'FAILED'
      status.smtpVerification.error = verifyResult.error || 'Unknown error'
    }
  } else {
    status.smtpVerification.status = 'SKIPPED (Missing SMTP_USER or SMTP_PASS)'
  }

  return NextResponse.json(status, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const testTo = body.to || process.env.SMTP_USER || process.env.GMAIL_USER

    if (!testTo) {
      return NextResponse.json(
        { error: 'Please provide a recipient email in the request body: { "to": "your@email.com" }' },
        { status: 400 }
      )
    }

    const result = await sendPartnerConfirmationEmail({
      to: testTo,
      name: 'Diagnostic Test Recipient',
      organization: 'OAK Test Organization',
      role: 'Partner',
      qr_code_token: 'OAK-DIAG-TEST-9999',
      pass_id: 'test-pass-id',
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Diagnostic dispatch failed' },
      { status: 500 }
    )
  }
}
