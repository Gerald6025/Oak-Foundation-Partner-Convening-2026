import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

export interface ConfirmationEmailPayload {
  to: string
  name: string
  organization: string
  role: string
  qr_code_token: string
  pass_id: string
}

export interface SentEmailRecord {
  id: string
  to: string
  subject: string
  name: string
  organization: string
  role: string
  qr_code_token: string
  pass_url: string
  sent_at: string
  html: string
}

const SENT_EMAILS_FILE = path.join(process.cwd(), 'src', 'lib', 'sent-emails.json')

function recordSentEmail(record: SentEmailRecord) {
  try {
    // Only attempt to write if file exists or in local development
    if (fs.existsSync(SENT_EMAILS_FILE)) {
      const emails: SentEmailRecord[] = JSON.parse(fs.readFileSync(SENT_EMAILS_FILE, 'utf8') || '[]')
      emails.unshift(record)
      const trimmed = emails.slice(0, 50)
      fs.writeFileSync(SENT_EMAILS_FILE, JSON.stringify(trimmed, null, 2), 'utf8')
    }
  } catch (err: any) {
    // Silently ignore filesystem write errors in read-only serverless environments (Vercel)
    console.warn('[Email Log] Skipped local filesystem write:', err.message)
  }
}

export function getSentEmails(): SentEmailRecord[] {
  try {
    if (fs.existsSync(SENT_EMAILS_FILE)) {
      return JSON.parse(fs.readFileSync(SENT_EMAILS_FILE, 'utf8'))
    }
  } catch {
    // ignore
  }
  return []
}

/**
 * Dynamically resolves the base URL of the site, ensuring production links work
 * on Vercel deployments even if NEXT_PUBLIC_SITE_URL is not manually set.
 */
export function getBaseSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

/**
 * Creates a configured Nodemailer transporter with connection timeouts
 * suitable for serverless execution (e.g. Vercel / AWS Lambda).
 */
export function getSmtpTransporter() {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD

  if (!smtpUser || !smtpPass) {
    return null
  }

  const isCustomSmtp = Boolean(process.env.SMTP_HOST)
  const cleanPass = smtpPass.replace(/\s+/g, '')

  if (isCustomSmtp) {
    const port = Number(process.env.SMTP_PORT) || 587
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: smtpUser,
        pass: cleanPass,
      },
      connectionTimeout: 12000,
      greetingTimeout: 12000,
      socketTimeout: 15000,
    })
  }

  // Gmail SMTP with explicit host and SSL port 465 (most reliable in serverless)
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: cleanPass,
    },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
  })
}

/**
 * Helper to test SMTP connection during diagnostics
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; error?: string; port?: number }> {
  const transporter = getSmtpTransporter()
  if (!transporter) {
    return { success: false, error: 'SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in this environment.' }
  }
  try {
    await transporter.verify()
    return { success: true, port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465 }
  } catch (err: any) {
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
    // Try port 587 fallback if default port 465 failed
    if (!process.env.SMTP_HOST && smtpUser && smtpPass) {
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: smtpUser,
            pass: smtpPass.replace(/\s+/g, ''),
          },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 10000,
        })
        await fallbackTransporter.verify()
        return { success: true, port: 587 }
      } catch (fallbackErr: any) {
        return {
          success: false,
          error: `Port 465 error: ${err.message} | Port 587 error: ${fallbackErr.message}`,
        }
      }
    }
    return { success: false, error: err.message || 'SMTP verification failed' }
  }
}

export async function sendPartnerConfirmationEmail(payload: ConfirmationEmailPayload): Promise<{
  success: boolean
  messageId?: string
  error?: string
  provider?: 'smtp' | 'resend' | 'mock'
}> {
  const siteUrl = getBaseSiteUrl()
  const passUrl = `${siteUrl}/pass/${payload.pass_id}`
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=png&data=${encodeURIComponent(payload.qr_code_token)}`

  const subject = `Registration Confirmed - OAK Foundation Partner Convening 2026`

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px 12px; color: #0F172A;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(180deg, #1C3663 0%, #142646 100%); padding: 32px 28px; text-align: left;">
        <span style="display: inline-block; background: rgba(255,255,255,0.15); color: #FFFFFF; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; padding: 5px 10px; border-radius: 20px; text-transform: uppercase;">
          Registration Confirmed
        </span>
        <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0; line-height: 1.2;">
          Partner Convening 2026
        </h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">
          Harare, Zimbabwe · 9–11 November 2026
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px;">
        <p style="font-size: 15px; color: #1E293B; margin: 0 0 16px 0; line-height: 1.5;">
          Dear <strong>${payload.name}</strong>,
        </p>
        <p style="font-size: 13px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
          Thank you for registering for the <strong>OAK Foundation Partner Convening 2026</strong>. Your participation as a <strong>${payload.role}</strong> has been confirmed. Please find your registration details and entry QR code below.
        </p>

        <!-- QR Code Box -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #EEF2F6; border-radius: 20px; text-align: center; margin-bottom: 24px;">
          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 10px; font-weight: 700; color: #64748B; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 14px 0;">
                YOUR ENTRY PASS &amp; CHECK-IN QR CODE
              </p>
              <img src="${qrImageUrl}" alt="Your Entry QR Code" width="180" height="180" style="display: block; margin: 0 auto; border-radius: 12px; background: #FFFFFF; padding: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);" />
              <p style="font-family: monospace; font-size: 14px; font-weight: 700; color: #162E55; letter-spacing: 2px; margin: 14px 0 4px 0;">
                ${payload.qr_code_token}
              </p>
              <p style="font-size: 11px; color: #64748B; margin: 0;">
                Present this code on your mobile device upon arrival for instant check-in.
              </p>
              <div style="margin-top: 16px;">
                <a href="${passUrl}" style="display: inline-block; background: #1E3A68; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 6px rgba(22,46,85,0.25);">
                  Download &amp; View Pass Online
                </a>
              </div>
            </td>
          </tr>
        </table>

        <!-- Registration Details -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px; border-bottom: 1px solid #F1F5F9;">
              <span style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">REGISTRATION DETAILS</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #F1F5F9;">
              <table width="100%">
                <tr>
                  <td style="font-size: 12px; color: #64748B;">Name:</td>
                  <td style="font-size: 12px; font-weight: 700; color: #0F172A; text-align: right;">${payload.name}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #F1F5F9;">
              <table width="100%">
                <tr>
                  <td style="font-size: 12px; color: #64748B;">Organisation:</td>
                  <td style="font-size: 12px; font-weight: 700; color: #0F172A; text-align: right;">${payload.organization}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px;">
              <table width="100%">
                <tr>
                  <td style="font-size: 12px; color: #64748B;">Role:</td>
                  <td style="font-size: 12px; font-weight: 700; color: #0F172A; text-align: right;">${payload.role}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Event Information -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 16px 8px 16px;">
              <span style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">EVENT INFORMATION</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 16px 16px;">
              <p style="font-size: 12px; color: #1E293B; margin: 0 0 6px 0;"><strong>Event:</strong> OAK Foundation Partner Convening 2026</p>
              <p style="font-size: 12px; color: #1E293B; margin: 0 0 6px 0;"><strong>Dates:</strong> 9–11 November 2026</p>
              <p style="font-size: 12px; color: #1E293B; margin: 0;"><strong>Venue:</strong> Main Hall A · Harare, Zimbabwe</p>
            </td>
          </tr>
        </table>

        <p style="font-size: 12px; color: #64748B; line-height: 1.5; margin: 0;">
          If you have any questions or need to modify your registration details, please reach out to the <strong>OAK Coordination Team</strong> at <a href="mailto:coordination@oakfnd.org" style="color: #1E3A68; font-weight: 600;">coordination@oakfnd.org</a>.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #F1F5F9; padding: 20px 28px; text-align: center; border-top: 1px solid #E2E8F0;">
        <p style="font-size: 11px; color: #94A3B8; margin: 0;">
          © 2026 OAK Foundation · All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`

  let lastError: string | null = null

  // 1. Try Gmail / SMTP if credentials exist
  const transporter = getSmtpTransporter()
  if (transporter) {
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
    try {
      const fromAddress =
        process.env.EMAIL_FROM || `"OAK Foundation Convening" <${smtpUser}>`

      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.to,
        subject,
        html: htmlContent,
      })

      recordSentEmail({
        id: info.messageId,
        to: payload.to,
        subject,
        name: payload.name,
        organization: payload.organization,
        role: payload.role,
        qr_code_token: payload.qr_code_token,
        pass_url: passUrl,
        sent_at: new Date().toISOString(),
        html: htmlContent,
      })

      console.log(`[Email Sent via SMTP] ID: ${info.messageId} to ${payload.to}`)
      return { success: true, messageId: info.messageId, provider: 'smtp' }
    } catch (err: any) {
      console.warn('[SMTP Port 465 failed, attempting port 587 STARTTLS...]:', err.message)
      if (!process.env.SMTP_HOST && smtpUser && smtpPass) {
        try {
          const fallbackTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: smtpUser,
              pass: smtpPass.replace(/\s+/g, ''),
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          })
          const fromAddress = process.env.EMAIL_FROM || `"OAK Foundation Convening" <${smtpUser}>`
          const info = await fallbackTransporter.sendMail({
            from: fromAddress,
            to: payload.to,
            subject,
            html: htmlContent,
          })
          recordSentEmail({
            id: info.messageId,
            to: payload.to,
            subject,
            name: payload.name,
            organization: payload.organization,
            role: payload.role,
            qr_code_token: payload.qr_code_token,
            pass_url: passUrl,
            sent_at: new Date().toISOString(),
            html: htmlContent,
          })
          console.log(`[Email Sent via SMTP port 587] ID: ${info.messageId} to ${payload.to}`)
          return { success: true, messageId: info.messageId, provider: 'smtp' }
        } catch (fallbackErr: any) {
          lastError = `SMTP Delivery Error (Port 465: ${err.message} | Port 587: ${fallbackErr.message})`
          console.error('[SMTP Delivery Error]:', lastError)
        }
      } else {
        lastError = `SMTP Delivery Error: ${err.message}`
        console.error('[SMTP Delivery Error]:', err)
      }
    }
  }

  // 2. Try Resend if configured (HTTPS REST API, ideal for serverless)
  if (process.env.RESEND_API_KEY) {
    try {
      // For Resend, default to onboarding@resend.dev if custom domain is not yet verified
      const fromAddress =
        process.env.RESEND_FROM ||
        process.env.EMAIL_FROM ||
        'OAK Convening <onboarding@resend.dev>'

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: payload.to,
          subject,
          html: htmlContent,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && data.id) {
        recordSentEmail({
          id: data.id,
          to: payload.to,
          subject,
          name: payload.name,
          organization: payload.organization,
          role: payload.role,
          qr_code_token: payload.qr_code_token,
          pass_url: passUrl,
          sent_at: new Date().toISOString(),
          html: htmlContent,
        })
        console.log(`[Email Sent via Resend] ID: ${data.id} to ${payload.to}`)
        return { success: true, messageId: data.id, provider: 'resend' }
      } else {
        lastError = `Resend API Error: ${data.message || JSON.stringify(data) || res.statusText}`
        console.error('[Resend Error]:', lastError)
      }
    } catch (err: any) {
      lastError = `Resend Request Error: ${err.message}`
      console.error('[Resend Request Error]:', err.message)
    }
  }

  // 3. If in local development with no credentials, fall back to mock recording
  const isProd = process.env.NODE_ENV === 'production'
  const hasConfig = Boolean(process.env.SMTP_USER || process.env.GMAIL_USER || process.env.RESEND_API_KEY)

  if (!isProd && !hasConfig) {
    const emailId = `local-mock-${Date.now()}`
    recordSentEmail({
      id: emailId,
      to: payload.to,
      subject,
      name: payload.name,
      organization: payload.organization,
      role: payload.role,
      qr_code_token: payload.qr_code_token,
      pass_url: passUrl,
      sent_at: new Date().toISOString(),
      html: htmlContent,
    })
    console.warn(`[Local Dev Mock Email] Recorded mock email for ${payload.to}`)
    return {
      success: true,
      messageId: emailId,
      provider: 'mock',
    }
  }

  // In production or when credentials were provided but delivery failed, return explicit error
  const finalErrorMessage =
    lastError ||
    'Email delivery failed: Neither SMTP nor Resend is properly configured in this environment. Please set SMTP_USER and SMTP_PASS (or RESEND_API_KEY) in your Vercel Environment Variables.'

  console.error('[Email Dispatch Failed]:', finalErrorMessage)
  return {
    success: false,
    error: finalErrorMessage,
  }
}

