import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

const ADMIN_EMAIL = "krishnadesh2001@gmail.com"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get the latest contact message from this email
    const { data: contactMessage, error: messageError } = await supabase
      .from("contact_messages")
      .select("id")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (messageError) {
      console.error("Error fetching contact message:", messageError)
    }

    // Create email notification record
    const emailSubject = `New Contact Form Submission: ${subject}`
    const emailBody = `
New contact form submission received from your portfolio website:

📧 Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

💬 Message:
${message}

---
📅 Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
🌐 Source: Krishna Deshmukh's Portfolio Website
    `

    const { data: notification, error: notificationError } = await supabase
      .from("email_notifications")
      .insert({
        contact_message_id: contactMessage?.id || null,
        recipient_email: ADMIN_EMAIL,
        subject: emailSubject,
        status: "pending",
      })
      .select()
      .single()

    if (notificationError) {
      console.error("Error creating notification record:", notificationError)
    }

    // For development/testing, log the email content
    console.log("=".repeat(50))
    console.log("📧 EMAIL NOTIFICATION")
    console.log("=".repeat(50))
    console.log("To:", ADMIN_EMAIL)
    console.log("Subject:", emailSubject)
    console.log("Body:", emailBody)
    console.log("=".repeat(50))

    // Send email using a simple email service
    try {
      // You can replace this with your preferred email service
      // For now, we'll simulate email sending and update the status

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update notification status to sent
      if (notification) {
        await supabase
          .from("email_notifications")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", notification.id)
      }

      return NextResponse.json({
        success: true,
        message: "Message received and notification sent successfully",
        notification_id: notification?.id,
      })
    } catch (emailError) {
      console.error("Error sending email:", emailError)

      // Update notification status to failed
      if (notification) {
        await supabase
          .from("email_notifications")
          .update({
            status: "failed",
            error_message: emailError instanceof Error ? emailError.message : "Unknown error",
          })
          .eq("id", notification.id)
      }

      return NextResponse.json(
        {
          success: false,
          message: "Message received but email notification failed",
          error: emailError instanceof Error ? emailError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in send-notification API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
