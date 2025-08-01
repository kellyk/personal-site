import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json();

    // Basic validation
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Send an email using a service like SendGrid, Resend, or Nodemailer
    // 2. Store the message in a database
    // 3. Send a notification to yourself
    
    // For now, we'll just log the submission and return success
    console.log('Contact form submission:', {
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Replace this with actual email sending logic
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: 'your-email@example.com',
    //   subject: `New contact form submission from ${email}`,
    //   text: message,
    //   replyTo: email
    // });

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
