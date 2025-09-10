import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { contactFormSchema } from '@/types/contact';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body);
    
    // Prepare the email content
    const { name, email, phone, trainingInterest, message } = validatedData;
    
    // Get training interest label
    const trainingInterestLabels: Record<string, string> = {
      '1v1-attacking': '1v1 Attacking Finishing',
      '1v1-keeper': '1v1 with Keeper',
      '1v1-crossing': '1v1 Attacking Crossing',
      'sisw-analysis': 'SISW Analysis',
      'tav-breakdowns': 'TAV Breakdowns',
      'general-training': 'General Training Program',
      'academy-program': 'REBALL Academy Program',
      'other': 'Other'
    };
    
    const trainingInterestLabel = trainingInterestLabels[trainingInterest] || trainingInterest;
    
    // Create the email message
    const msg = {
      to: 'harry@reball.uk',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@reball.uk',
      replyTo: email,
      subject: `New Contact Form Submission - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">REBALL</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <h2 style="color: #333; margin-bottom: 30px;">Contact Form Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Training Interest:</td>
                  <td style="padding: 8px 0; color: #333;">${trainingInterestLabel}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Message</h3>
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <h4 style="color: #333; margin-top: 0; margin-bottom: 10px;">Quick Actions</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">
                • Reply directly to this email to respond to ${name}<br>
                • Call them at ${phone || 'phone number not provided'}<br>
                • Add them to your CRM system
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 14px;">
              This message was sent from the REBALL contact form at reball.uk
            </p>
          </div>
        </div>
      `,
      text: `
        REBALL - New Contact Form Submission
        
        Contact Information:
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        Training Interest: ${trainingInterestLabel}
        
        Message:
        ${message}
        
        ---
        This message was sent from the REBALL contact form.
      `
    };
    
    // Send the email
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
      console.log('Contact form email sent successfully to harry@reball.uk');
    } else {
      console.warn('SendGrid API key not configured, logging contact form data instead:');
      console.log('Contact Form Data:', validatedData);
    }
    
    // Also send a confirmation email to the user
    const confirmationMsg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@reball.uk',
      subject: 'Thank you for contacting REBALL - We\'ll be in touch soon!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">REBALL</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Professional Football Training</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for contacting REBALL, ${name}! 🎉</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              We've received your message about <strong>${trainingInterestLabel}</strong> and will get back to you within 24 hours with personalized recommendations for your football training goals.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0;">
                <li>Harry will review your training interests and goals</li>
                <li>We'll prepare personalized training recommendations</li>
                <li>You'll receive a detailed response within 24 hours</li>
                <li>We can schedule a free consultation if needed</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://reball.uk" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;">
                Visit REBALL Website
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any urgent questions, feel free to call Harry directly or mention "urgent" in your follow-up email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              Best regards,<br>
              Harry & The REBALL Team
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 REBALL. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(confirmationMsg);
      console.log('Confirmation email sent successfully to:', email);
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please check your form data and try again.',
          errors: error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send message. Please try again or contact us directly at harry@reball.uk' 
      },
      { status: 500 }
    );
  }
}
