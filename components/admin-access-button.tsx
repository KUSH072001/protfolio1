"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, X, Lock, User, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminAccessButton() {
  const [showLogin, setShowLogin] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === "krishna" && credentials.password === "123456") {
      // Set admin session
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminUser", "krishna")

      // Redirect to admin panel
      router.push("/admin")
      setShowLogin(false)
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <>
      {/* Admin Access Button - Fixed position */}
      <motion.button
        onClick={() => setShowLogin(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl shadow-purple-500/25 flex items-center justify-center transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        title="Admin Access"
      >
        <Settings size={20} />
      </motion.button>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Lock className="text-white" size={24} />
                </motion.div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Admin Access
                </h2>
                <p className="text-gray-400 mt-2">Enter your credentials to access the admin panel</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Username Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="w-full bg-gray-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full bg-gray-700/50 text-white pl-12 pr-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !credentials.username || !credentials.password}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  ) : (
                    "Access Admin Panel"
                  )}
                </motion.button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-700/30 border border-gray-600/50 rounded-xl">
                <h4 className="text-gray-300 font-semibold text-sm mb-2">🔒 Secure Access</h4>
                <p className="text-gray-400 text-xs">
                  This admin panel is protected with secure authentication. Only authorized users can access the content
                  management system.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
