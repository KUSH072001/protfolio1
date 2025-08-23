"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, FileText, FolderOpen, Settings, Upload, Save, AlertCircle, CheckCircle } from "lucide-react"
import ProfileSection from "@/components/admin/profile-section"
import SkillsSection from "@/components/admin/skills-section"
import ProjectsSection from "@/components/admin/projects-section"
import ContactSection from "@/components/admin/contact-section"
import CVSection from "@/components/admin/cv-section"
import AuthGuard from "./auth-guard"
import { usePortfolio } from "@/contexts/portfolio-context"

const adminTabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "skills", name: "Skills", icon: Settings },
  { id: "projects", name: "Projects", icon: FolderOpen },
  { id: "contact", name: "Contact", icon: FileText },
  { id: "cv", name: "CV Upload", icon: Upload },
]

export default function AdminPage() {
  const { saveToDatabase, isLoading, isDatabaseConnected } = usePortfolio()
  const [activeTab, setActiveTab] = useState("profile")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const handleSaveToDatabase = async () => {
    setSaveStatus("saving")
    try {
      const success = await saveToDatabase()
      if (success) {
        setSaveStatus("success")
        setHasUnsavedChanges(false)
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "skills":
        return <SkillsSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "projects":
        return <ProjectsSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "contact":
        return <ContactSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "cv":
        return <CVSection onDataChange={() => setHasUnsavedChanges(true)} />
      default:
        return <ProfileSection onDataChange={() => setHasUnsavedChanges(true)} />
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Database Status & Save Button */}
          <div className="mb-8 flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${isDatabaseConnected ? "text-green-400" : "text-yellow-400"}`}>
                {isDatabaseConnected ? (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    <span className="text-sm font-medium">Supabase Connected</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} className="mr-2" />
                    <span className="text-sm font-medium">Database Offline (Using localStorage)</span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full ml-2 animate-pulse"></div>
                  </>
                )}
              </div>
              {hasUnsavedChanges && <div className="text-yellow-400 text-sm">• Unsaved changes (auto-saves in 2s)</div>}
            </div>

            <motion.button
              onClick={handleSaveToDatabase}
              disabled={saveStatus === "saving" || isLoading}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                saveStatus === "success"
                  ? "bg-green-600 text-white"
                  : saveStatus === "error"
                    ? "bg-red-600 text-white"
                    : isDatabaseConnected
                      ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              whileHover={{ scale: saveStatus === "saving" || !isDatabaseConnected ? 1 : 1.05 }}
              whileTap={{ scale: saveStatus === "saving" || !isDatabaseConnected ? 1 : 0.95 }}
            >
              {saveStatus === "saving" ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "success"
                  ? "Saved!"
                  : saveStatus === "error"
                    ? "Error!"
                    : isDatabaseConnected
                      ? "Save to Database"
                      : "Database Offline"}
            </motion.button>
          </div>

          {/* Database Setup Instructions */}
          {!isDatabaseConnected && (
            <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-yellow-400 mt-1" size={20} />
                <div>
                  <h3 className="text-yellow-300 font-semibold mb-2">Database Setup Required</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    To enable Supabase integration, please run the SQL script in your Supabase dashboard:
                  </p>
                  <ol className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>1. Go to your Supabase project dashboard</li>
                    <li>2. Navigate to SQL Editor</li>
                    <li>
                      3. Run the script:{" "}
                      <code className="bg-gray-700 px-2 py-1 rounded">scripts/create-tables-v2.sql</code>
                    </li>
                    <li>4. Refresh this page</li>
                  </ol>
                  <p className="text-yellow-300 text-xs mt-3">
                    💡 Your data is currently saved to localStorage and will sync once the database is set up.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-white mb-6">Admin Sections</h2>
                <nav className="space-y-2">
                  {adminTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      }`}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon size={20} className="mr-3" />
                      {tab.name}
                    </motion.button>
                  ))}
                </nav>

                {/* Database Info */}
                <div
                  className={`mt-8 p-4 rounded-xl border ${
                    isDatabaseConnected
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-yellow-500/10 border-yellow-500/20"
                  }`}
                >
                  <h4
                    className={`font-semibold text-sm mb-2 ${
                      isDatabaseConnected ? "text-green-300" : "text-yellow-300"
                    }`}
                  >
                    {isDatabaseConnected ? "✅ Database Features" : "⚠️ Database Status"}
                  </h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    {isDatabaseConnected ? (
                      <>
                        <li>• Real-time data sync</li>
                        <li>• Contact form submissions</li>
                        <li>• Email notifications</li>
                        <li>• Auto-backup to localStorage</li>
                      </>
                    ) : (
                      <>
                        <li>• Using localStorage backup</li>
                        <li>• Run SQL script to enable DB</li>
                        <li>• Contact forms won't work</li>
                        <li>• No email notifications</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
