"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Github, ExternalLink, Star, Eye, Code } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

const ProjectsSection = () => {
  const { data, isLoading } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [filter, setFilter] = useState("All")

  const projects = data.projects || []
  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))]
  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter)

  // Show loading state
  if (isLoading) {
    return (
      <section
        id="projects"
        className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <p className="text-gray-400 text-lg">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
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
              My Projects
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">Building solutions with modern technologies</p>

          {/* Filter buttons */}
          {categories.length > 1 && (
            <div className="flex justify-center space-x-4">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    filter === category
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Featured
                </div>
              )}

              {/* Category badge */}
              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-500/80 to-green-500/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                {project.category}
              </div>

              {/* Project image with overlay - Auto-fetched from database */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title)
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Hover overlay with buttons */}
                <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Live Demo Button - Uses actual URLs from database */}
                  {project.demoUrl && (
                    <motion.a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Live Demo"
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  )}
                  {project.codeUrl && (
                    <motion.a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Source Code"
                    >
                      <Github size={20} />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Project content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <Star size={14} className="mr-1" />
                      {project.stats?.stars || 0}
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {project.stats?.views || "0"}
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies?.map((tech, techIndex) => (
                    <motion.span
                      key={`${tech}-${techIndex}`}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.1 + techIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Action buttons - Auto-enabled when URLs are added */}
                <div className="flex space-x-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 px-4 rounded-lg transition-all duration-300 group/btn"
                    >
                      <ExternalLink
                        size={16}
                        className="mr-2 group-hover/btn:rotate-12 transition-transform duration-300"
                      />
                      Live Demo
                    </a>
                  )}
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center text-sm text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 py-2 px-4 rounded-lg transition-all duration-300 group/btn"
                    >
                      <Github size={16} className="mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                      View Code
                    </a>
                  )}
                  {!project.demoUrl && !project.codeUrl && (
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-500 py-2 px-4 rounded-lg border border-gray-700">
                      Links coming soon
                    </div>
                  )}
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-green-500/20 to-blue-500/20 blur-sm"></div>
              </div>

              {/* Auto-update indicator for images */}
              {project.image && !project.image.includes("placeholder.svg") && (
                <motion.div
                  className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border border-white flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 max-w-2xl mx-auto">
            <Code className="text-blue-400 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-4">More Projects Coming Soon!</h3>
            <p className="text-gray-300 mb-6">
              I'm constantly working on new projects and learning new technologies. Check back soon for more exciting
              developments!
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Let's Build Something Together
            </motion.a>
          </div>
        </motion.div>

        {/* Auto-update indicator */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            Projects auto-sync from database • Live links work instantly
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection
