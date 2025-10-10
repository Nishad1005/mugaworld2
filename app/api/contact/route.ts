import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Verify environment variables are set
    if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD || !process.env.CONTACT_RECEIVE_EMAIL) {
      console.error('Missing email configuration. Please set ZOHO_EMAIL, ZOHO_PASSWORD, and CONTACT_RECEIVE_EMAIL in .env');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Create Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    // Email content in the same format as the form
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 5px;
              display: block;
            }
            .value {
              background: white;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #d1d5db;
            }
            .message-box {
              background: white;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #d1d5db;
              min-height: 100px;
              white-space: pre-wrap;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0;">MUGA WORLD</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Full Name</span>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <span class="label">Email Address</span>
                <div class="value">${email}</div>
              </div>

              <div class="field">
                <span class="label">Phone Number</span>
                <div class="value">${phone || 'Not provided'}</div>
              </div>

              <div class="field">
                <span class="label">Message</span>
                <div class="message-box">${message}</div>
              </div>

              <div class="field">
                <span class="label">Submitted At</span>
                <div class="value">${new Date().toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'full',
                  timeStyle: 'long'
                })}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the MUGA WORLD contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textContent = `
New Contact Form Submission - MUGA WORLD

Full Name: ${name}
Email Address: ${email}
Phone Number: ${phone || 'Not provided'}

Message:
${message}

Submitted At: ${new Date().toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  dateStyle: 'full',
  timeStyle: 'long'
})}

---
This email was sent from the MUGA WORLD contact form.
    `;

    // Send email
    await transporter.sendMail({
      from: `"MUGA WORLD Contact Form" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.CONTACT_RECEIVE_EMAIL,
      replyTo: email, // This allows you to reply directly to the customer
      subject: `New Contact Form Message from ${name}`,
      text: textContent,
      html: htmlContent,
    });

    console.log('Contact form email sent successfully:', {
      name,
      email,
      phone,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
