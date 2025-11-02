import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, place, description } = body

    // Validate input
    if (!name || !phone || !place || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create transporter
    // NOTE: You need to configure your email credentials in environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER || 'mohammedtahirsteel@gmail.com',
        pass: process.env.EMAIL_PASS || '', // App password required for Gmail
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mohammedtahirsteel@gmail.com',
      to: 'mohammedtahirsteel@gmail.com',
      subject: `New Enquiry from ${name} - Ahmed Steels & Cement`,
      html: `
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
              background-color: #f9fafb;
            }
            .header {
              background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f3f4f6;
              border-radius: 8px;
              border-left: 4px solid #0284c7;
            }
            .label {
              font-weight: bold;
              color: #0284c7;
              margin-bottom: 5px;
              font-size: 14px;
              text-transform: uppercase;
            }
            .value {
              color: #1f2937;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🏗️ New Customer Enquiry</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ahmed Steels & Cement</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 25px;">You have received a new enquiry from your website:</p>
              
              <div class="field">
                <div class="label">Customer Name</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">Phone Number</div>
                <div class="value">${phone}</div>
              </div>
              
              <div class="field">
                <div class="label">Location / Place</div>
                <div class="value">${place}</div>
              </div>
              
              <div class="field">
                <div class="label">Requirements</div>
                <div class="value">${description}</div>
              </div>
              
              <div class="footer">
                <p>This enquiry was submitted from Ahmed Steels & Cement website.</p>
                <p style="margin: 5px 0;">Please respond to the customer as soon as possible.</p>
                <p style="margin-top: 15px; font-size: 12px;">
                  <strong>Contact:</strong> ${phone} | <strong>Email:</strong> mohammedtahirsteel@gmail.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Enquiry - Ahmed Steels & Cement

Customer Name: ${name}
Phone Number: ${phone}
Location: ${place}
Requirements: ${description}

Please respond to this enquiry as soon as possible.
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
