import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  console.log('SendGrid API Key available:', !!process.env.SENDGRID_API_KEY)
  console.log('SendGrid From Email:', process.env.SENDGRID_FROM_EMAIL)
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  
  // For development, log the verification URL instead of sending email
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${token}`
  console.log('=== VERIFICATION EMAIL (DEVELOPMENT) ===')
  console.log('To:', email)
  console.log('Subject: Verify your REBALL account')
  console.log('Verification URL:', verificationUrl)
  console.log('========================================')
  
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email send')
    return
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@reball.uk',
    subject: 'Verify your REBALL account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">REBALL</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Professional Football Training</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to REBALL, ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for registering with REBALL. To complete your registration and start your football training journey, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="color: #667eea; word-break: break-all; margin-bottom: 30px;">
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This verification link will expire in 24 hours. If you didn't create a REBALL account, 
            you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            Best regards,<br>
            The REBALL Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 REBALL. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('Verification email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email send')
    return
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@reball.uk',
    subject: 'Welcome to REBALL - Your Football Training Journey Begins!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">REBALL</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Professional Football Training</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to REBALL, ${name}! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Congratulations! Your email has been verified and your REBALL account is now active. 
            You're ready to start your professional football training journey.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #333; margin-top: 0;">What's next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Complete your player profile</li>
              <li>Book your first training session</li>
              <li>Explore our video analysis tools</li>
              <li>Track your progress and goals</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;">
              Start Training Now
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions or need assistance, don't hesitate to reach out to our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            Best regards,<br>
            The REBALL Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 REBALL. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('Welcome email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}
