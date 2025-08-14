import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailVerificationData {
  name: string
  email: string
  verificationToken: string
  verificationUrl: string
}

export interface EmailOptions {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private static fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@reball.com'
  private static fromName = 'REBALL'

  /**
   * Send a generic email
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.error('SendGrid API key not configured')
        return false
      }

      const msg = {
        to: options.to,
        from: {
          email: options.from || this.fromEmail,
          name: this.fromName
        },
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      }

      await sgMail.send(msg)
      console.log(`Email sent successfully to ${options.to}`)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  /**
   * Send email verification email
   */
  static async sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
    const subject = 'Verify Your Email - Welcome to REBALL!'
    const html = this.generateVerificationEmailHtml(data)
    
    return this.sendEmail({
      to: data.email,
      subject,
      html
    })
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<boolean> {
    const subject = 'Reset Your Password - REBALL'
    const html = this.generatePasswordResetEmailHtml(email, resetToken, resetUrl)
    
    return this.sendEmail({
      to: email,
      subject,
      html
    })
  }

  /**
   * Generate verification email HTML template
   */
  private static generateVerificationEmailHtml(data: EmailVerificationData): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - REBALL</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 0;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            transition: transform 0.2s ease;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
          }
          .link {
            color: #667eea;
            text-decoration: none;
          }
          .link:hover {
            text-decoration: underline;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            color: #92400e;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">REBALL</div>
            <p class="tagline">Professional Football Training & Analysis</p>
          </div>
          
          <div class="content">
            <h1 class="greeting">Welcome to REBALL, ${data.name}! 🎯</h1>
            
            <p class="message">
              Thank you for joining REBALL! We're excited to have you on board and help you take your football skills to the next level.
            </p>
            
            <p class="message">
              To get started with your training journey, please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">
                Verify Your Email Address
              </a>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification email.
            </div>
            
            <p class="message">
              If the button above doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="word-break: break-all; color: #667eea; font-size: 14px;">
              <a href="${data.verificationUrl}" class="link">${data.verificationUrl}</a>
            </p>
            
            <p class="message">
              Once verified, you'll have access to:
            </p>
            
            <ul style="color: #6b7280; font-size: 16px; line-height: 1.7;">
              <li>📅 Book professional training sessions</li>
              <li>📊 Track your progress and performance</li>
              <li>🎥 Upload and analyze your training videos</li>
              <li>🎯 Set and achieve your football goals</li>
            </ul>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              If you didn't create a REBALL account, you can safely ignore this email.
            </p>
            <p class="footer-text">
              Need help? Contact us at 
              <a href="mailto:support@reball.com" class="link">support@reball.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Generate password reset email HTML template
   */
  private static generatePasswordResetEmailHtml(email: string, resetToken: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - REBALL</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            color: #92400e;
            font-size: 14px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">REBALL</div>
          </div>
          
          <div class="content">
            <h1 class="greeting">Reset Your Password</h1>
            
            <p class="message">
              We received a request to reset your password for your REBALL account (${email}).
            </p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                Reset Password
              </a>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </div>
            
            <p class="message">
              If the button above doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style="word-break: break-all; color: #667eea; font-size: 14px;">
              ${resetUrl}
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              Need help? Contact us at support@reball.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Strip HTML tags to create plain text version
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
}
