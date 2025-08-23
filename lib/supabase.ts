import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://oscoombexvngnvgzcjjp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY29vbWJleHZuZ252Z3pjampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDUxMTcsImV4cCI6MjA3MTA4MTExN30.Nfcq69kj8QPwOOH4CpHuLG6MebKcULSvu3Lz3CCUx1I"

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  }
  return supabaseClient
})()

// Server-side Supabase client
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export interface PortfolioDataRow {
  id: string
  user_id: string
  profile: any
  skills: any[]
  projects: any[]
  contact: any
  cv: any
  stats: any[]
  highlights: any[]
  journey: any[]
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  ip_address?: string
  user_agent?: string
  status: "new" | "read" | "replied"
  created_at: string
}

export interface EmailNotification {
  id: string
  contact_message_id: string
  recipient_email: string
  subject: string
  status: "pending" | "sent" | "failed"
  error_message?: string
  sent_at?: string
  created_at: string
}
