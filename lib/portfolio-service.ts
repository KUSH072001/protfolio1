import { supabase, type PortfolioDataRow } from "./supabase"
import type { PortfolioData } from "@/contexts/portfolio-context"

const USER_ID = "krishna_deshmukh"

// Client-side functions
export class PortfolioService {
  static async initializeDatabase(): Promise<boolean> {
    try {
      // Check if tables exist by trying to select from them
      const { error } = await supabase.from("portfolio_data").select("id").limit(1)

      if (error) {
        console.error("Database tables not found. Please run the SQL script in Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking database:", error)
      return false
    }
  }

  static async loadPortfolioData(): Promise<PortfolioData | null> {
    try {
      // First check if database is initialized
      const isInitialized = await this.initializeDatabase()
      if (!isInitialized) {
        console.warn("Database not initialized, using default data")
        return null
      }

      const { data, error } = await supabase.from("portfolio_data").select("*").eq("user_id", USER_ID).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No data found, this is expected for first time
          console.log("No portfolio data found, will create default")
          return null
        }
        console.error("Error loading portfolio data:", error)
        return null
      }

      // Transform and ensure all data is properly loaded
      const portfolioData = this.transformDbToPortfolio(data)

      // Log successful data fetch with details
      console.log("✅ Portfolio data loaded from Supabase:", {
        profile: portfolioData.profile?.name || "No name",
        projects: portfolioData.projects?.length || 0,
        skills: portfolioData.skills?.length || 0,
        hasProfileImage: !!(
          portfolioData.profile?.profileImage && !portfolioData.profile.profileImage.includes("placeholder")
        ),
        hasCVUrl: !!portfolioData.cv?.url,
        timestamp: new Date().toLocaleTimeString(),
      })

      return portfolioData
    } catch (error) {
      console.error("Error in loadPortfolioData:", error)
      return null
    }
  }

  static async savePortfolioData(portfolioData: PortfolioData): Promise<boolean> {
    try {
      // First check if database is initialized
      const isInitialized = await this.initializeDatabase()
      if (!isInitialized) {
        console.warn("Database not initialized, cannot save to Supabase")
        return false
      }

      const dbData = this.transformPortfolioToDb(portfolioData)

      const { error } = await supabase.from("portfolio_data").upsert(
        {
          user_id: USER_ID,
          ...dbData,
        },
        {
          onConflict: "user_id",
        },
      )

      if (error) {
        console.error("Error saving portfolio data:", error)
        return false
      }

      // Log successful save with details
      console.log("💾 Portfolio data saved successfully to Supabase:", {
        profile: portfolioData.profile?.name || "No name",
        projects: portfolioData.projects?.length || 0,
        skills: portfolioData.skills?.length || 0,
        hasProfileImage: !!(
          portfolioData.profile?.profileImage && !portfolioData.profile.profileImage.includes("placeholder")
        ),
        hasCVUrl: !!portfolioData.cv?.url,
        timestamp: new Date().toLocaleTimeString(),
      })

      return true
    } catch (error) {
      console.error("Error in savePortfolioData:", error)
      return false
    }
  }

  static async submitContactMessage(messageData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<boolean> {
    try {
      // First check if database is initialized
      const isInitialized = await this.initializeDatabase()
      if (!isInitialized) {
        console.warn("Database not initialized, cannot save contact message")
        return false
      }

      const { data, error } = await supabase
        .from("contact_messages")
        .insert({
          name: messageData.name,
          email: messageData.email,
          subject: messageData.subject,
          message: messageData.message,
          ip_address: await this.getClientIP(),
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
          status: "new",
        })
        .select()
        .single()

      if (error) {
        console.error("Error submitting contact message:", error)
        return false
      }

      console.log("📧 Contact message saved successfully:", data)

      // Trigger email notification
      await this.triggerEmailNotification(messageData)

      return true
    } catch (error) {
      console.error("Error in submitContactMessage:", error)
      return false
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch {
      return "unknown"
    }
  }

  private static async triggerEmailNotification(messageData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<void> {
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) {
        console.error("Failed to send email notification:", response.statusText)
      } else {
        console.log("📨 Email notification sent successfully")
      }
    } catch (error) {
      console.error("Error triggering email notification:", error)
    }
  }

  private static transformDbToPortfolio(data: PortfolioDataRow): PortfolioData {
    return {
      profile: data.profile || {},
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      contact: data.contact || {},
      cv: data.cv || {},
      stats: Array.isArray(data.stats) ? data.stats : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      journey: Array.isArray(data.journey) ? data.journey : [],
    }
  }

  private static transformPortfolioToDb(data: PortfolioData) {
    return {
      profile: data.profile,
      skills: data.skills,
      projects: data.projects,
      contact: data.contact,
      cv: data.cv,
      stats: data.stats,
      highlights: data.highlights,
      journey: data.journey,
    }
  }
}
