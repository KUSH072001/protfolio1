"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Trophy, Target, Zap, Users } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

export default function SkillsSection() {
  const { data } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Defensive programming with fallbacks
  const skills = data?.skills || []

  // Default stats with proper icon components
  const defaultStats = [
    { value: "5+", label: "Projects Built", icon: Trophy, color: "from-yellow-400 to-orange-400" },
    { value: "Fresher", label: "Experience Level", icon: Target, color: "from-green-400 to-emerald-400" },
    { value: "Open", label: "To Opportunities", icon: Users, color: "from-blue-400 to-cyan-400" },
    { value: "100%", label: "Dedication", icon: Zap, color: "from-purple-400 to-pink-400" },
  ]

  const stats = data?.stats || defaultStats

  const filteredSkills =
    selectedCategory === "All" ? skills : skills.filter((skill) => skill.category === selectedCategory)

  const categories = ["All", ...Array.from(new Set(skills.map((skill) => skill.category)))]

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          ref={ref}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <p className="text-gray-400 text-lg">My technical toolkit for full-stack development</p>
        </motion.div>

        {/* Stats Section */}
        {stats && Array.isArray(stats) && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              // Handle both function components and objects
              const IconComponent = stat.icon
              const isValidIcon = typeof IconComponent === "function"

              return (
                <motion.div
                  key={`${stat.label}-${index}`}
                  className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/10 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  {/* Animated background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color || "from-blue-400 to-green-400"} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <motion.div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color || "from-blue-400 to-green-400"} mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isValidIcon ? (
                      <IconComponent className="text-white" size={24} />
                    ) : (
                      <div className="text-white text-xl">📊</div>
                    )}
                  </motion.div>

                  <motion.div
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color || "from-blue-400 to-green-400"} bg-clip-text text-transparent mb-2`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Skills with progress bars */}
          <div className="lg:col-span-2">
            {/* Category filter */}
            {categories.length > 1 && (
              <motion.div
                className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>
            )}

            <div className="space-y-6">
              {filteredSkills &&
                Array.isArray(filteredSkills) &&
                filteredSkills.map((skill, index) => (
                  <motion.div
                    key={`${skill.name}-${index}`}
                    className="group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <motion.span
                          className="mr-3 text-2xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {skill.icon || "🔧"}
                        </motion.span>
                        <div>
                          <span className="text-white font-semibold text-lg">{skill.name}</span>
                          <div className="text-xs text-gray-500">{skill.category}</div>
                        </div>
                      </div>
                      <motion.span
                        className="text-blue-300 font-bold text-lg"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                      >
                        {skill.level}%
                      </motion.span>
                    </div>

                    <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1.5, delay: 1 + index * 0.1, ease: "easeOut" }}
                      />

                      {/* Animated glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-0 group-hover:opacity-30 blur-sm"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1.5, delay: 1 + index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Development Philosophy */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
                My Approach 🎯
              </h3>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  As a <span className="text-blue-400 font-semibold">fresher</span>, I focus on writing{" "}
                  <span className="text-green-400 font-semibold">clean, maintainable code</span> and following best
                  practices from the start.
                </p>
                <p className="leading-relaxed">
                  I believe in <span className="text-blue-400 font-semibold">continuous learning</span> and staying
                  updated with the latest technologies to build modern, scalable applications.
                </p>
                <p className="leading-relaxed">
                  My goal is to contribute meaningfully to projects while growing as a{" "}
                  <span className="text-green-400 font-semibold">full-stack developer</span>.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              <h4 className="text-xl font-semibold text-white mb-4">🚀 Currently Learning</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Advanced Spring Boot Features
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  React Advanced Patterns
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Microservices Architecture
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  AI Integration in Web Apps
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm p-6 rounded-2xl border border-green-500/20 text-center">
              <h4 className="text-lg font-bold text-white mb-2">🎯 Open to Opportunities</h4>
              <p className="text-gray-300 text-sm">
                Ready to contribute to innovative projects and grow with a dynamic team!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
