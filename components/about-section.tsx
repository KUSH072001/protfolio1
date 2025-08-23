"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Lightbulb, Target, BookOpen } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

const AboutSection = () => {
  const { data, isLoading } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Defensive programming with fallbacks
  const profile = data?.profile || {}
  const name = profile.name || "Krishna Deshmukh"
  const bio =
    profile.bio ||
    "I'm a passionate Fresher specializing in Java Full Stack Development. With a strong foundation in modern technologies, I'm eager to contribute to innovative projects and grow in the tech industry."

  // Auto-fetch profile image from database
  const profileImage = profile.profileImage || "/placeholder.svg?height=320&width=320&text=Krishna+Deshmukh"

  // Default highlights with proper icon components
  const defaultHighlights = [
    { icon: Code, title: "Problem Solving", description: "Strong analytical and debugging skills" },
    { icon: Lightbulb, title: "Adaptability", description: "Quick to learn new technologies" },
    { icon: Target, title: "Goal Oriented", description: "Focused on delivering quality solutions" },
    { icon: BookOpen, title: "Continuous Learning", description: "Always expanding my knowledge base" },
  ]

  const highlights = data?.highlights || defaultHighlights

  const journey = data?.journey || [
    { phase: "Learning Phase", description: "Mastered Java fundamentals and OOP concepts", icon: "📚" },
    { phase: "Framework Exploration", description: "Dove deep into Spring Boot and React", icon: "🔧" },
    { phase: "Project Building", description: "Created full-stack applications", icon: "🚀" },
    { phase: "Ready for Industry", description: "Seeking opportunities to apply my skills", icon: "💼" },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <section
        id="about"
        className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <p className="text-gray-400 text-lg">Loading about section...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          ref={ref}
        >
          <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            About Me
          </span>
        </motion.h2>

        <motion.p
          className="text-center text-gray-400 mb-16 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A passionate fresher ready to make an impact in the tech world
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Animated rings around profile image */}
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-blue-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full border border-green-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-green-500 shadow-2xl shadow-blue-500/20">
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=320&width=320&text=Krishna+Deshmukh"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>

              {/* Auto-update indicator */}
              {profileImage && profileImage !== "/placeholder.svg?height=320&width=320&text=Krishna+Deshmukh" && (
                <motion.div
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
                Fresher & Passionate 🚀
              </h3>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>{bio}</p>
                <p className="text-green-400 font-medium">
                  🎯 Looking for entry-level opportunities to apply my full-stack skills in real-world projects.
                </p>
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {highlights &&
                Array.isArray(highlights) &&
                highlights.map((highlight, index) => {
                  // Handle both function components and objects
                  const IconComponent = highlight.icon
                  const isValidIcon = typeof IconComponent === "function"

                  return (
                    <motion.div
                      key={`${highlight.title}-${index}`}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      {isValidIcon ? (
                        <IconComponent className="text-blue-400 mb-2" size={24} />
                      ) : (
                        <div className="text-blue-400 mb-2 text-2xl">🔧</div>
                      )}
                      <h4 className="text-white font-semibold text-sm">{highlight.title}</h4>
                      <p className="text-gray-400 text-xs">{highlight.description}</p>
                    </motion.div>
                  )
                })}
            </motion.div>
          </div>
        </div>

        {/* Learning Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-12">
            My Learning Journey 📈
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journey &&
              Array.isArray(journey) &&
              journey.map((step, index) => (
                <motion.div
                  key={`${step.phase}-${index}`}
                  className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-blue-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{step.phase}</h4>
                  <p className="text-gray-400 text-sm">{step.description}</p>

                  {/* Connection line */}
                  {index < journey.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
                  )}
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Auto-update indicator */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Content auto-updates from database
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
