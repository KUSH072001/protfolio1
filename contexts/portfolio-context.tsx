"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PortfolioService } from "@/lib/portfolio-service"
import { Trophy, Target, Zap, Users } from "lucide-react"

// Types for portfolio data
export interface Skill {
  id: string
  name: string
  level: number
  icon: string
  category: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  demoUrl: string
  codeUrl: string
  featured: boolean
  category: string
  stats: {
    stars: number
    views: string
  }
}

export interface ContactInfo {
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  githubUsername: string
  linkedinName: string
}

export interface ProfileData {
  name: string
  title: string
  tagline: string
  bio: string
  location: string
  profileImage: string
  skills: string[]
  tags: Array<{
    text: string
    gradientStart: string
    gradientEnd: string
  }>
}

export interface CVData {
  file: File | null
  url: string
  buttonText: string
  showInHero: boolean
  showInContact: boolean
}

export interface StatData {
  value: string
  label: string
  icon: any
  color: string
}

export interface PortfolioData {
  profile: ProfileData
  skills: Skill[]
  projects: Project[]
  contact: ContactInfo
  cv: CVData
  stats: StatData[]
  highlights: Array<{
    icon: any
    title: string
    description: string
  }>
  journey: Array<{
    phase: string
    description: string
    icon: string
  }>
}

interface PortfolioContextType {
  data: PortfolioData
  isLoading: boolean
  isDatabaseConnected: boolean
  updateProfile: (profile: Partial<ProfileData>) => void
  updateSkills: (skills: Skill[]) => void
  updateProjects: (projects: Project[]) => void
  updateContact: (contact: Partial<ContactInfo>) => void
  updateCV: (cv: Partial<CVData>) => void
  saveToDatabase: () => Promise<boolean>
  loadFromDatabase: () => Promise<void>
  resetData: () => void
}

// Default data with proper array initialization
const defaultData: PortfolioData = {
  profile: {
    name: "Krishna Deshmukh",
    title: "Java Full Stack Developer",
    tagline:
      "I'm a Fresher Java Full Stack Developer skilled in building scalable web applications with modern technologies.",
    bio: "I'm a passionate Fresher specializing in Java Full Stack Development. With a strong foundation in modern technologies, I'm eager to contribute to innovative projects and grow in the tech industry.",
    location: "Mumbai, India",
    profileImage: "/placeholder.svg?height=320&width=320&text=Krishna+Deshmukh",
    skills: ["Java", "Spring Boot", "React", "Node.js"],
    tags: [
      {
        text: "☕ Java Full Stack Developer",
        gradientStart: "from-blue-400",
        gradientEnd: "to-green-400",
      },
      {
        text: "🚀 Spring Boot Expert",
        gradientStart: "from-green-400",
        gradientEnd: "to-blue-400",
      },
      {
        text: "⚛️ React Developer",
        gradientStart: "from-blue-400",
        gradientEnd: "to-purple-400",
      },
      {
        text: "🌟 Fresher & Eager to Learn",
        gradientStart: "from-purple-400",
        gradientEnd: "to-blue-400",
      },
    ],
  },
  skills: [
    { id: "1", name: "Java", level: 85, icon: "☕", category: "Programming" },
    { id: "2", name: "Spring Boot", level: 80, icon: "🍃", category: "Framework" },
    { id: "3", name: "Data JPA", level: 75, icon: "🗄️", category: "Framework" },
    { id: "4", name: "React", level: 85, icon: "⚛️", category: "Frontend" },
    { id: "5", name: "Node.js", level: 75, icon: "🟢", category: "Backend" },
    { id: "6", name: "Express", level: 70, icon: "🚀", category: "Backend" },
    { id: "7", name: "HTML", level: 90, icon: "🏗️", category: "Frontend" },
    { id: "8", name: "CSS", level: 85, icon: "🎨", category: "Frontend" },
    { id: "9", name: "JavaScript", level: 80, icon: "🟨", category: "Programming" },
    { id: "10", name: "Tailwind CSS", level: 85, icon: "🌊", category: "Frontend" },
    { id: "11", name: "SQL", level: 75, icon: "🗃️", category: "Database" },
    { id: "12", name: "MongoDB", level: 70, icon: "🍃", category: "Database" },
    { id: "13", name: "Supabase", level: 65, icon: "⚡", category: "Database" },
    { id: "14", name: "Git", level: 80, icon: "🔄", category: "Tools" },
    { id: "15", name: "GitHub", level: 85, icon: "🐙", category: "Tools" },
    { id: "16", name: "Postman", level: 75, icon: "📮", category: "Tools" },
    { id: "17", name: "v0.dev", level: 70, icon: "🤖", category: "AI Tools" },
    { id: "18", name: "Lovable.dev", level: 65, icon: "💝", category: "AI Tools" },
  ],
  projects: [
    {
      id: "1",
      title: "Real Estate Project",
      description:
        "A comprehensive real estate platform with property listings, search functionality, and user management built with modern full-stack technologies.",
      image: "/placeholder.svg?height=400&width=600&text=Real+Estate+Platform",
      technologies: ["Java", "Spring Boot", "React", "MongoDB", "Tailwind CSS"],
      demoUrl: "https://your-real-estate-demo.vercel.app",
      codeUrl: "https://github.com/yourusername/real-estate-project",
      featured: true,
      category: "Full Stack",
      stats: { stars: 45, views: "1.2k" },
    },
    {
      id: "2",
      title: "React To-Do App with Animation",
      description:
        "An interactive to-do application featuring smooth animations, drag-and-drop functionality, and local storage persistence.",
      image: "/placeholder.svg?height=400&width=600&text=Animated+Todo+App",
      technologies: ["React", "Framer Motion", "JavaScript", "CSS3", "Local Storage"],
      demoUrl: "https://your-todo-app.netlify.app",
      codeUrl: "https://github.com/yourusername/todo-app",
      featured: true,
      category: "Frontend",
      stats: { stars: 32, views: "890" },
    },
    {
      id: "3",
      title: "Student Management System",
      description:
        "A complete student management system with CRUD operations, grade tracking, and reporting features built with Java and Spring Boot.",
      image: "/placeholder.svg?height=400&width=600&text=Student+Management+System",
      technologies: ["Java", "Spring Boot", "Data JPA", "MySQL", "Thymeleaf"],
      demoUrl: "https://your-student-system.herokuapp.com",
      codeUrl: "https://github.com/yourusername/student-management",
      featured: false,
      category: "Backend",
      stats: { stars: 28, views: "650" },
    },
    {
      id: "4",
      title: "Password Generator",
      description:
        "A secure password generator with customizable options, strength indicators, and copy-to-clipboard functionality.",
      image: "/placeholder.svg?height=400&width=600&text=Password+Generator",
      technologies: ["JavaScript", "HTML5", "CSS3", "Web APIs", "Crypto"],
      demoUrl: "https://yourusername.github.io/password-generator",
      codeUrl: "https://github.com/yourusername/password-generator",
      featured: false,
      category: "Frontend",
      stats: { stars: 19, views: "420" },
    },
    {
      id: "5",
      title: "Courier Management System (v0 based)",
      description:
        "A modern courier tracking and management system built using v0.dev with real-time tracking and delivery management.",
      image: "/placeholder.svg?height=400&width=600&text=Courier+Management",
      technologies: ["Next.js", "React", "Tailwind CSS", "Supabase", "v0.dev"],
      demoUrl: "https://your-courier-app.vercel.app",
      codeUrl: "https://github.com/yourusername/courier-management",
      featured: true,
      category: "Full Stack",
      stats: { stars: 38, views: "980" },
    },
  ],
  contact: {
    email: "krishnadesh2001@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    github: "https://github.com/krishnadeshmukh",
    linkedin: "https://linkedin.com/in/krishnadeshmukh",
    githubUsername: "@krishnadeshmukh",
    linkedinName: "Krishna Deshmukh",
  },
  cv: {
    file: null,
    url: "",
    buttonText: "Download Resume",
    showInHero: true,
    showInContact: true,
  },
  stats: [
    { value: "5+", label: "Projects Built", icon: Trophy, color: "from-yellow-400 to-orange-400" },
    { value: "Fresher", label: "Experience Level", icon: Target, color: "from-green-400 to-emerald-400" },
    { value: "Open", label: "To Opportunities", icon: Users, color: "from-blue-400 to-cyan-400" },
    { value: "100%", label: "Dedication", icon: Zap, color: "from-purple-400 to-pink-400" },
  ],
  highlights: [
    { icon: Trophy, title: "Problem Solving", description: "Strong analytical and debugging skills" },
    { icon: Target, title: "Adaptability", description: "Quick to learn new technologies" },
    { icon: Zap, title: "Goal Oriented", description: "Focused on delivering quality solutions" },
    { icon: Users, title: "Continuous Learning", description: "Always expanding my knowledge base" },
  ],
  journey: [
    { phase: "Learning Phase", description: "Mastered Java fundamentals and OOP concepts", icon: "📚" },
    { phase: "Framework Exploration", description: "Dove deep into Spring Boot and React", icon: "🔧" },
    { phase: "Project Building", description: "Created full-stack applications", icon: "🚀" },
    { phase: "Ready for Industry", description: "Seeking opportunities to apply my skills", icon: "💼" },
  ],
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false)

  // Load data from Supabase on mount - ALWAYS fetch latest data
  useEffect(() => {
    loadFromDatabase()
  }, [])

  // Auto-save to database when data changes (debounced)
  useEffect(() => {
    if (!isLoading && isDatabaseConnected) {
      const timeoutId = setTimeout(() => {
        saveToDatabase()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [data, isLoading, isDatabaseConnected])

  // Auto-refresh data every 30 seconds to keep main page updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDatabaseConnected && !isLoading) {
        loadFromDatabase()
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [isDatabaseConnected, isLoading])

  const loadFromDatabase = async () => {
    setIsLoading(true)
    try {
      // Check database connection first
      const isConnected = await PortfolioService.initializeDatabase()
      setIsDatabaseConnected(isConnected)

      if (isConnected) {
        const portfolioData = await PortfolioService.loadPortfolioData()
        if (portfolioData) {
          // Ensure skills is always an array
          if (portfolioData.profile && !Array.isArray(portfolioData.profile.skills)) {
            portfolioData.profile.skills = defaultData.profile.skills
          }

          // Merge with default data to ensure all fields exist
          const mergedData = {
            ...defaultData,
            ...portfolioData,
            profile: {
              ...defaultData.profile,
              ...portfolioData.profile,
              skills: Array.isArray(portfolioData.profile?.skills)
                ? portfolioData.profile.skills
                : defaultData.profile.skills,
            },
            skills:
              Array.isArray(portfolioData.skills) && portfolioData.skills.length > 0
                ? portfolioData.skills
                : defaultData.skills,
            projects:
              Array.isArray(portfolioData.projects) && portfolioData.projects.length > 0
                ? portfolioData.projects
                : defaultData.projects,
            cv: {
              ...defaultData.cv,
              ...portfolioData.cv,
            },
          }

          setData(mergedData)
          console.log("✅ Portfolio data loaded from Supabase and auto-updated")
        } else {
          console.log("📝 No data in Supabase, using default data")
          setData(defaultData)
        }
      } else {
        console.warn("⚠️ Database not connected, using localStorage fallback")
        // Fallback to localStorage
        const savedData = localStorage.getItem("portfolioData")
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData)
            if (parsedData.profile && !Array.isArray(parsedData.profile.skills)) {
              parsedData.profile.skills = defaultData.profile.skills
            }
            const mergedData = { ...defaultData, ...parsedData }
            setData(mergedData)
            console.log("📱 Portfolio data loaded from localStorage")
          } catch (parseError) {
            console.error("❌ Error parsing localStorage data:", parseError)
            setData(defaultData)
          }
        } else {
          setData(defaultData)
        }
      }
    } catch (error) {
      console.error("❌ Error loading from database:", error)
      setIsDatabaseConnected(false)
      setData(defaultData)
    } finally {
      setIsLoading(false)
    }
  }

  const saveToDatabase = async (): Promise<boolean> => {
    try {
      if (isDatabaseConnected) {
        const success = await PortfolioService.savePortfolioData(data)
        if (success) {
          // Also save to localStorage as backup
          localStorage.setItem("portfolioData", JSON.stringify(data))
          console.log("💾 Data saved to Supabase and localStorage backup")
          return true
        }
      }

      // Fallback to localStorage only
      localStorage.setItem("portfolioData", JSON.stringify(data))
      console.log("📱 Data saved to localStorage (database not available)")
      return false
    } catch (error) {
      console.error("❌ Error saving to database:", error)
      // Fallback to localStorage
      localStorage.setItem("portfolioData", JSON.stringify(data))
      return false
    }
  }

  const updateProfile = (profile: Partial<ProfileData>) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile,
        skills: Array.isArray(profile.skills) ? profile.skills : prev.profile.skills,
      },
    }))
  }

  const updateSkills = (skills: Skill[]) => {
    setData((prev) => ({
      ...prev,
      skills,
    }))
  }

  const updateProjects = (projects: Project[]) => {
    setData((prev) => ({
      ...prev,
      projects,
    }))
  }

  const updateContact = (contact: Partial<ContactInfo>) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contact },
    }))
  }

  const updateCV = (cv: Partial<CVData>) => {
    setData((prev) => ({
      ...prev,
      cv: { ...prev.cv, ...cv },
    }))
  }

  const resetData = () => {
    setData(defaultData)
    localStorage.removeItem("portfolioData")
    if (isDatabaseConnected) {
      saveToDatabase()
    }
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isDatabaseConnected,
        updateProfile,
        updateSkills,
        updateProjects,
        updateContact,
        updateCV,
        saveToDatabase,
        loadFromDatabase,
        resetData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
