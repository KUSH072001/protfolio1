"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Mail, Github, Linkedin, Phone, MapPin, Save } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

interface ContactSectionProps {
  onDataChange: () => void
}

export default function ContactSection({ onDataChange }: ContactSectionProps) {
  const { data, updateContact } = usePortfolio()
  const [contactData, setContactData] = useState({
    email: data.contact.email,
    phone: data.contact.phone,
    location: data.contact.location,
    github: data.contact.github,
    linkedin: data.contact.linkedin,
    githubUsername: data.contact.githubUsername,
    linkedinName: data.contact.linkedinName,
  })

  const handleInputChange = (field: string, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }))
    updateContact({ [field]: value })
    onDataChange()
  }

  const handleSave = () => {
    // Here you would implement the save functionality
    console.log("Saving contact data:", contactData)
    // Show success message
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <FileText className="text-blue-400 mr-3" size={28} />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Contact Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Contact Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <Mail size={16} className="mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <Phone size={16} className="mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={contactData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <MapPin size={16} className="mr-2" />
                Location
              </label>
              <input
                type="text"
                value={contactData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Social Media Links</h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <Github size={16} className="mr-2" />
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={contactData.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <Github size={16} className="mr-2" />
                GitHub Username (Display)
              </label>
              <input
                type="text"
                value={contactData.githubUsername}
                onChange={(e) => handleInputChange("githubUsername", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="@yourusername"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <Linkedin size={16} className="mr-2" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={contactData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <Linkedin size={16} className="mr-2" />
                LinkedIn Display Name
              </label>
              <input
                type="text"
                value={contactData.linkedinName}
                onChange={(e) => handleInputChange("linkedinName", e.target.value)}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                placeholder="Your Full Name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Contact Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
              <Mail className="text-white" size={18} />
            </div>
            <div>
              <div className="text-white font-medium">Email</div>
              <div className="text-gray-400 text-sm">{contactData.email}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center mr-3">
              <Github className="text-white" size={18} />
            </div>
            <div>
              <div className="text-white font-medium">GitHub</div>
              <div className="text-gray-400 text-sm">{contactData.githubUsername}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Linkedin className="text-white" size={18} />
            </div>
            <div>
              <div className="text-white font-medium">LinkedIn</div>
              <div className="text-gray-400 text-sm">{contactData.linkedinName}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mr-3">
              <Phone className="text-white" size={18} />
            </div>
            <div>
              <div className="text-white font-medium">Phone</div>
              <div className="text-gray-400 text-sm">{contactData.phone}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="text-white" size={18} />
            </div>
            <div>
              <div className="text-white font-medium">Location</div>
              <div className="text-gray-400 text-sm">{contactData.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save size={18} className="mr-2" />
        Update Contact Information
      </motion.button>
    </div>
  )
}
