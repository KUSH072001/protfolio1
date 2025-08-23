"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FolderOpen, Plus, Trash2, Edit3, Upload, ExternalLink, Github, Loader2 } from "lucide-react"
import { usePortfolio, type Project } from "@/contexts/portfolio-context"
import { StorageService } from "@/lib/storage-service"

interface ProjectsSectionProps {
  onDataChange: () => void
}

const categories = ["Full Stack", "Frontend", "Backend", "Mobile"]

export default function ProjectsSection({ onDataChange }: ProjectsSectionProps) {
  const { data, updateProjects } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>(data.projects)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({})
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    image: "",
    technologies: [],
    demoUrl: "",
    codeUrl: "",
    featured: false,
    category: "Full Stack",
    stats: { stars: 0, views: "0" },
  })

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        ...newProject,
        stats: { stars: 0, views: "0" },
      }
      const updatedProjects = [...projects, project]
      setProjects(updatedProjects)
      updateProjects(updatedProjects)
      setNewProject({
        title: "",
        description: "",
        image: "",
        technologies: [],
        demoUrl: "",
        codeUrl: "",
        featured: false,
        category: "Full Stack",
        stats: { stars: 0, views: "0" },
      })
      setShowAddForm(false)
      onDataChange()
    }
  }

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    setProjects(updatedProjects)
    updateProjects(updatedProjects)
    onDataChange()
  }

  const handleUpdateProject = (id: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map((project) => (project.id === id ? { ...project, [field]: value } : project))
    setProjects(updatedProjects)
    updateProjects(updatedProjects)
    onDataChange()
  }

  const handleImageUpload = async (projectId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setUploadingImages((prev) => ({ ...prev, [projectId]: true }))

    try {
      // Try to upload to Supabase Storage first
      const publicUrl = await StorageService.uploadProjectImage(file)

      if (publicUrl) {
        // Success - use Supabase URL
        handleUpdateProject(projectId, "image", publicUrl)
      } else {
        // Fallback to base64 for localStorage
        const base64Url = await StorageService.fileToBase64(file)
        handleUpdateProject(projectId, "image", base64Url)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImages((prev) => ({ ...prev, [projectId]: false }))
    }
  }

  const handleTechnologiesChange = (projectId: string, techString: string) => {
    const technologies = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech)
    handleUpdateProject(projectId, "technologies", technologies)
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <FolderOpen className="text-blue-400 mr-3" size={28} />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Projects Management
          </h2>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} className="mr-2" />
          Add Project
        </motion.button>
      </div>

      {/* Add New Project Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Add New Project</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />

            <select
              value={newProject.category}
              onChange={(e) => setNewProject((prev) => ({ ...prev, category: e.target.value }))}
              className="bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="url"
                placeholder="Demo URL (https://your-project.com)"
                value={newProject.demoUrl}
                onChange={(e) => setNewProject((prev) => ({ ...prev, demoUrl: e.target.value }))}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
              {newProject.demoUrl && !validateUrl(newProject.demoUrl) && (
                <p className="text-red-400 text-xs mt-1">Please enter a valid URL</p>
              )}
            </div>

            <div>
              <input
                type="url"
                placeholder="Code URL (https://github.com/username/repo)"
                value={newProject.codeUrl}
                onChange={(e) => setNewProject((prev) => ({ ...prev, codeUrl: e.target.value }))}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
              {newProject.codeUrl && !validateUrl(newProject.codeUrl) && (
                <p className="text-red-400 text-xs mt-1">Please enter a valid URL</p>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Technologies (comma separated)"
            value={newProject.technologies.join(", ")}
            onChange={(e) =>
              setNewProject((prev) => ({
                ...prev,
                technologies: e.target.value
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter((tech) => tech),
              }))
            }
            className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          />

          <div className="flex items-center space-x-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={newProject.featured}
                onChange={(e) => setNewProject((prev) => ({ ...prev, featured: e.target.checked }))}
                className="mr-2 rounded"
              />
              Featured Project
            </label>
          </div>

          <div className="flex space-x-4">
            <motion.button
              onClick={handleAddProject}
              disabled={
                !newProject.title.trim() ||
                (newProject.demoUrl && !validateUrl(newProject.demoUrl)) ||
                (newProject.codeUrl && !validateUrl(newProject.codeUrl))
              }
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Project
            </motion.button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-gray-700/30 rounded-xl border border-gray-600 overflow-hidden hover:border-gray-500 transition-all duration-300"
            layout
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {uploadingImages[project.id] && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    {editingProject === project.id ? (
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleUpdateProject(project.id, "title", e.target.value)}
                        className="text-xl font-bold bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    )}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.featured
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-gray-600/50 text-gray-300"
                        }`}
                      >
                        {project.featured ? "Featured" : "Regular"}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>

              {editingProject === project.id ? (
                <div className="space-y-4">
                  <textarea
                    value={project.description}
                    onChange={(e) => handleUpdateProject(project.id, "description", e.target.value)}
                    rows={3}
                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 resize-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="url"
                        placeholder="Demo URL"
                        value={project.demoUrl}
                        onChange={(e) => handleUpdateProject(project.id, "demoUrl", e.target.value)}
                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                      />
                      {project.demoUrl && !validateUrl(project.demoUrl) && (
                        <p className="text-red-400 text-xs mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="Code URL"
                        value={project.codeUrl}
                        onChange={(e) => handleUpdateProject(project.id, "codeUrl", e.target.value)}
                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                      />
                      {project.codeUrl && !validateUrl(project.codeUrl) && (
                        <p className="text-red-400 text-xs mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={project.technologies.join(", ")}
                    onChange={(e) => handleTechnologiesChange(project.id, e.target.value)}
                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) => handleUpdateProject(project.id, "featured", e.target.checked)}
                        className="mr-2 rounded"
                      />
                      Featured Project
                    </label>

                    <select
                      value={project.category}
                      onChange={(e) => handleUpdateProject(project.id, "category", e.target.value)}
                      className="bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <label
                      className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                        uploadingImages[project.id] ? "bg-gray-600 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-500"
                      } text-white`}
                    >
                      {uploadingImages[project.id] ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <Upload size={16} className="mr-2" />
                      )}
                      {uploadingImages[project.id] ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(project.id, file)
                        }}
                        className="hidden"
                        disabled={uploadingImages[project.id]}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-300 rounded-full text-sm border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Live Demo
                      </a>
                    )}
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-300"
                      >
                        <Github size={16} className="mr-1" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
        <h4 className="text-green-300 font-semibold mb-2">✅ Permanent Storage Features</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Project images are stored permanently in Supabase Storage</li>
          <li>• Demo and code URLs are saved to database automatically</li>
          <li>• All project data persists across browser sessions</li>
          <li>• Live Demo buttons will open your actual project URLs</li>
          <li>• Changes are auto-saved every 2 seconds</li>
          <li>• Fallback to localStorage if database is offline</li>
        </ul>
      </div>
    </div>
  )
}
