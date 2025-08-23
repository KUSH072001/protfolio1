"use client"

import type React from "react"
import { Download } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Github, Linkedin, Mail, Send, MapPin, Phone, Calendar, Coffee } from "lucide-react"
import { PortfolioService } from "@/lib/portfolio-service"

export default function ContactSection() {
  const { data } = usePortfolio()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState<null | "success" | "error" | "loading">(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("loading")

    try {
      // Submit to Supabase database
      const success = await PortfolioService.submitContactMessage(formData)

      if (success) {
        setFormStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })

        // Reset status after 5 seconds
        setTimeout(() => setFormStatus(null), 5000)
      } else {
        setFormStatus("error")
        setTimeout(() => setFormStatus(null), 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus("error")
      setTimeout(() => setFormStatus(null), 5000)
    }
  }

  const socialLinks = [
    {
      name: "Email",
      href: `mailto:${data.contact.email}`,
      icon: Mail,
      color: "from-red-400 to-pink-400",
      username: data.contact.email,
    },
    {
      name: "GitHub",
      href: data.contact.github,
      icon: Github,
      color: "from-gray-600 to-gray-800",
      username: data.contact.githubUsername,
    },
    {
      name: "LinkedIn",
      href: data.contact.linkedin,
      icon: Linkedin,
      color: "from-blue-500 to-blue-600",
      username: data.contact.linkedinName,
    },
  ]

  const contactInfo = [
    {
      icon: MapPin,
      label: "Location",
      value: data.contact.location,
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: data.contact.phone,
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Calendar,
      label: "Availability",
      value: "Open to opportunities",
      color: "from-purple-400 to-pink-400",
    },
  ]

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
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
              Let's Connect
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Ready to start my journey in the tech industry! ☕</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
              Send Me a Message 💌
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-400"
                  >
                    Your Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-400"
                  >
                    Your Email
                  </label>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="subject"
                  className="absolute text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-400"
                >
                  Subject
                </label>
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-gray-800/50 text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300 resize-none"
                  placeholder=" "
                  required
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-400"
                >
                  Your Message
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: formStatus === "loading" ? 1 : 1.02 }}
                whileTap={{ scale: formStatus === "loading" ? 1 : 0.98 }}
              >
                {formStatus === "loading" ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>

              {formStatus === "success" && (
                <motion.div
                  className="text-green-400 text-center bg-green-400/10 border border-green-400/20 rounded-xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✅ Message sent successfully! I'll get back to you soon. You'll also receive an email confirmation.
                </motion.div>
              )}

              {formStatus === "error" && (
                <motion.div
                  className="text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded-xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ❌ Failed to send message. Please try again or contact me directly via email.
                </motion.div>
              )}
            </form>

            {/* Database Status Indicator */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Powered by Supabase Database
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
                Let's Connect! 🤝
              </h3>

              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm a <span className="text-blue-400 font-semibold">fresher Java Full Stack Developer</span> excited to
                start my career in tech! Whether you're looking for an entry-level developer or just want to connect,
                I'd love to hear from you.
              </p>

              {/* Contact Information */}
              <div className="space-y-4 mb-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={`${info.label}-${index}`}
                    className="flex items-center group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <info.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">{info.label}</div>
                      <div className="text-white font-medium">{info.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Find me on:</h4>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center group p-4 bg-gray-800/30 rounded-xl hover:bg-gray-700/30 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <social.icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-gray-400 text-sm">{social.username}</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* CV Download Button */}
              {data.cv.showInContact && data.cv.url && (
                <motion.a
                  href={data.cv.url}
                  download
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={18} className="mr-2" />
                  {data.cv.buttonText}
                </motion.a>
              )}
            </div>

            {/* Fresher Status */}
            <motion.div
              className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Coffee className="text-blue-400 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-bold text-white mb-4">🚀 Fresher - Open to Opportunities</h4>
              <p className="text-gray-300 mb-6">
                Looking for entry-level opportunities to apply my full-stack skills in real-world projects. Ready to
                learn, grow, and contribute to innovative teams!
              </p>
              <motion.div className="flex flex-wrap justify-center gap-4" whileHover={{ scale: 1.05 }}>
                <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                  ✅ Available immediately
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                  ⚡ Eager to learn
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                  🎯 Goal-oriented
                </span>
              </motion.div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <h4 className="text-xl font-semibold text-white mb-4">💼 Experience Level</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-blue-400 font-semibold">Fresher - Open to Opportunities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Looking for:</span>
                  <span className="text-green-400 font-semibold">Entry-level positions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Specialization:</span>
                  <span className="text-purple-400 font-semibold">Java Full Stack</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Availability:</span>
                  <span className="text-yellow-400 font-semibold">Immediate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
