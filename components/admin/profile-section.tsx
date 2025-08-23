"use client"

import type React from "react"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, User, Edit3, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { StorageService } from "@/lib/storage-service"

interface ProfileSectionProps {
  onDataChange: () => void
}

export default function ProfileSection({ onDataChange }: ProfileSectionProps) {
  const { data, updateProfile } = usePortfolio()

  // Defensive programming with proper fallbacks
  const profile = data?.profile || {}
  const skills = profile.skills || []

  const [profileData, setProfileData] = useState({
    name: profile.name || "Krishna Deshmukh",
    title: profile.title || "Java Full Stack Developer",
    tagline:
      profile.tagline ||
      "I'm a Fresher Java Full Stack Developer skilled in building scalable web applications with modern technologies.",
    bio:
      profile.bio ||
      "I'm a passionate Fresher specializing in Java Full Stack Development. With a strong foundation in modern technologies, I'm eager to contribute to innovative projects and grow in the tech industry.",
    location: profile.location || "Mumbai, India",
    profileImage: null as File | null,
    profileImagePreview: profile.profileImage || "/placeholder.svg?height=320&width=320&text=Krishna+Deshmukh",
    skills: Array.isArray(skills) ? skills.join(", ") : "Java, Spring Boot, React, Node.js",
  })

  const [uploadStatus, setUploadStatus] = useState<{
    isUploading: boolean
    success: boolean
    error: string | null
  }>({
    isUploading: false,
    success: false,
    error: null,
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))

    if (field === "skills") {
      const skillsArray = value
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill)
      updateProfile({ [field]: skillsArray })
    } else {
      updateProfile({ [field]: value })
    }
    onDataChange()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadStatus({
        isUploading: false,
        success: false,
        error: "Please select a valid image file",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        isUploading: false,
        success: false,
        error: "File size must be less than 5MB",
      })
      return
    }

    setUploadStatus({ isUploading: true, success: false, error: null })

    try {
      // Try to upload to Supabase Storage first
      const publicUrl = await StorageService.uploadProfileImage(file)

      if (publicUrl) {
        // Success - use Supabase URL
        setProfileData((prev) => ({
          ...prev,
          profileImage: file,
          profileImagePreview: publicUrl,
        }))
        updateProfile({ profileImage: publicUrl })
        setUploadStatus({ isUploading: false, success: true, error: null })
      } else {
        // Fallback to base64 for localStorage
        const base64Url = await StorageService.fileToBase64(file)
        setProfileData((prev) => ({
          ...prev,
          profileImage: file,
          profileImagePreview: base64Url,
        }))
        updateProfile({ profileImage: base64Url })
        setUploadStatus({ isUploading: false, success: true, error: null })
      }

      onDataChange()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus((prev) => ({ ...prev, success: false }))
      }, 3000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadStatus({
        isUploading: false,
        success: false,
        error: "Failed to upload image. Please try again.",
      })

      // Clear error after 5 seconds
      setTimeout(() => {
        setUploadStatus((prev) => ({ ...prev, error: null }))
      }, 5000)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <User className="text-blue-400 mr-3" size={28} />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Profile Management
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Image Upload */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Profile Picture</h3>

          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl">
              <img
                src={profileData.profileImagePreview || "/placeholder.svg"}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>

              {/* Upload Status Overlay */}
              {uploadStatus.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="text-white animate-spin" size={32} />
                </div>
              )}
            </div>

            <motion.label
              className={`flex items-center px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                uploadStatus.isUploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              } text-white`}
              whileHover={{ scale: uploadStatus.isUploading ? 1 : 1.05 }}
              whileTap={{ scale: uploadStatus.isUploading ? 1 : 0.95 }}
            >
              {uploadStatus.isUploading ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <Upload size={18} className="mr-2" />
              )}
              {uploadStatus.isUploading ? "Uploading..." : "Upload New Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadStatus.isUploading}
              />
            </motion.label>

            {/* Upload Status Messages */}
            {uploadStatus.success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-green-400 text-sm"
              >
                <CheckCircle size={16} className="mr-2" />
                Image uploaded successfully!
              </motion.div>
            )}

            {uploadStatus.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-400 text-sm"
              >
                <AlertCircle size={16} className="mr-2" />
                {uploadStatus.error}
              </motion.div>
            )}

            <p className="text-gray-400 text-sm text-center">
              Recommended: Square image, at least 400x400px
              <br />
              Max size: 5MB • Formats: JPG, PNG, WebP, GIF
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Professional Title</label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="e.g., Java Full Stack Developer"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="e.g., Mumbai, India"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Hero Skills (comma separated)</label>
              <input
                type="text"
                value={profileData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="e.g., Java, Spring Boot, React, Node.js"
              />
              <p className="text-gray-500 text-xs mt-1">These skills will appear in the hero section</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Tagline */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Hero Section Tagline</h3>
        <textarea
          value={profileData.tagline}
          onChange={(e) => handleInputChange("tagline", e.target.value)}
          rows={3}
          className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300 resize-none"
          placeholder="Enter your hero section tagline"
        />
        <p className="text-gray-500 text-xs">This appears prominently in the hero section</p>
      </div>

      {/* About Bio */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">About Section Bio</h3>
        <textarea
          value={profileData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          rows={6}
          className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300 resize-none"
          placeholder="Write your professional bio"
        />
        <p className="text-gray-500 text-xs">This appears in the about section describing your background</p>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Preview</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30">
              <img
                src={profileData.profileImagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">{profileData.name}</h4>
              <p className="text-blue-400">{profileData.title}</p>
              <p className="text-gray-400 text-sm">{profileData.location}</p>
            </div>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">Skills:</h5>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-300 rounded-full text-sm border border-blue-500/20"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">Tagline:</h5>
            <p className="text-gray-300 text-sm italic">"{profileData.tagline}"</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          // Force save all current data
          updateProfile({
            name: profileData.name,
            title: profileData.title,
            tagline: profileData.tagline,
            bio: profileData.bio,
            location: profileData.location,
            skills: profileData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),
          })
          onDataChange()
        }}
      >
        <Edit3 size={18} className="mr-2" />
        Update Profile
      </motion.button>
    </div>
  )
}
