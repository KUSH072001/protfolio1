"use client"

import type React from "react"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Download, Trash2, Eye, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { StorageService } from "@/lib/storage-service"

interface CVSectionProps {
  onDataChange: () => void
}

export default function CVSection({ onDataChange }: CVSectionProps) {
  const { data, updateCV } = usePortfolio()
  const [cvFile, setCvFile] = useState<File | null>(data.cv.file)
  const [cvUrl, setCvUrl] = useState<string>(data.cv.url)
  const [uploadStatus, setUploadStatus] = useState<{
    isUploading: boolean
    progress: number
    success: boolean
    error: string | null
  }>({
    isUploading: false,
    progress: 0,
    success: false,
    error: null,
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== "application/pdf") {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        success: false,
        error: "Please upload a PDF file only",
      })
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        isUploading: false,
        progress: 0,
        success: false,
        error: "File size must be less than 10MB",
      })
      return
    }

    setUploadStatus({ isUploading: true, progress: 0, success: false, error: null })

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadStatus((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }))
      }, 200)

      // Try to upload to Supabase Storage first
      const publicUrl = await StorageService.uploadCV(file)

      clearInterval(progressInterval)

      if (publicUrl) {
        // Success - use Supabase URL
        setCvFile(file)
        setCvUrl(publicUrl)
        updateCV({ file, url: publicUrl })
        setUploadStatus({ isUploading: false, progress: 100, success: true, error: null })
      } else {
        // Fallback to base64 for localStorage
        const base64Url = await StorageService.fileToBase64(file)
        setCvFile(file)
        setCvUrl(base64Url)
        updateCV({ file, url: base64Url })
        setUploadStatus({ isUploading: false, progress: 100, success: true, error: null })
      }

      onDataChange()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus((prev) => ({ ...prev, success: false }))
      }, 3000)
    } catch (error) {
      console.error("Error uploading CV:", error)
      setUploadStatus({
        isUploading: false,
        progress: 0,
        success: false,
        error: "Failed to upload CV. Please try again.",
      })

      // Clear error after 5 seconds
      setTimeout(() => {
        setUploadStatus((prev) => ({ ...prev, error: null }))
      }, 5000)
    }
  }

  const handleRemoveCV = async () => {
    if (cvUrl && cvUrl.includes("supabase")) {
      // Try to delete from Supabase Storage
      await StorageService.deleteFile(cvUrl, "documents")
    }

    setCvFile(null)
    setCvUrl("")
    setUploadStatus({ isUploading: false, progress: 0, success: false, error: null })
    updateCV({ file: null, url: "" })
    onDataChange()
  }

  const handleDownload = () => {
    if (cvUrl) {
      const link = document.createElement("a")
      link.href = cvUrl
      link.download = cvFile?.name || "resume.pdf"
      link.click()
    }
  }

  const handlePreview = () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <Upload className="text-blue-400 mr-3" size={28} />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          CV/Resume Management
        </h2>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-700/30 rounded-xl p-8 border border-gray-600 text-center">
        {!cvFile ? (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-blue-500/30">
              <FileText className="text-blue-400" size={32} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload Your CV/Resume</h3>
              <p className="text-gray-400 mb-6">Upload a PDF version of your resume that visitors can download</p>
            </div>

            <motion.label
              className={`inline-flex items-center px-8 py-4 rounded-lg cursor-pointer transition-all duration-300 text-lg font-medium ${
                uploadStatus.isUploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              } text-white`}
              whileHover={{ scale: uploadStatus.isUploading ? 1 : 1.05 }}
              whileTap={{ scale: uploadStatus.isUploading ? 1 : 0.95 }}
            >
              {uploadStatus.isUploading ? (
                <Loader2 size={20} className="mr-3 animate-spin" />
              ) : (
                <Upload size={20} className="mr-3" />
              )}
              {uploadStatus.isUploading ? "Uploading..." : "Choose PDF File"}
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadStatus.isUploading}
              />
            </motion.label>

            <p className="text-gray-500 text-sm">Maximum file size: 10MB • Supported format: PDF only</p>
          </div>
        ) : (
          <div className="space-y-6">
            {uploadStatus.isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <motion.div
                    className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Uploading...</h3>
                  <div className="w-64 h-2 bg-gray-600 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadStatus.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{uploadStatus.progress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/30">
                  <FileText className="text-green-400" size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">CV Uploaded Successfully!</h3>
                  <p className="text-gray-400 mb-4">
                    <strong>File:</strong> {cvFile.name}
                  </p>
                  <p className="text-gray-400 mb-6">
                    <strong>Size:</strong> {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <motion.button
                    onClick={handlePreview}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={16} className="mr-2" />
                    Preview
                  </motion.button>

                  <motion.button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </motion.button>

                  <motion.button
                    onClick={handleRemoveCV}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Status Messages */}
        {uploadStatus.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-green-400 text-sm mt-4"
          >
            <CheckCircle size={16} className="mr-2" />
            CV uploaded and saved permanently!
          </motion.div>
        )}

        {uploadStatus.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-red-400 text-sm mt-4"
          >
            <AlertCircle size={16} className="mr-2" />
            {uploadStatus.error}
          </motion.div>
        )}
      </div>

      {/* CV Download Button Configuration */}
      <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Download Button Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Button Text</label>
            <input
              type="text"
              value={data.cv.buttonText || "Download Resume"}
              onChange={(e) => {
                updateCV({ buttonText: e.target.value })
                onDataChange()
              }}
              className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:border-gray-500 transition-all duration-300"
              placeholder="Download Resume"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={data.cv.showInHero || false}
                onChange={(e) => {
                  updateCV({ showInHero: e.target.checked })
                  onDataChange()
                }}
                className="mr-2 rounded"
              />
              Show download button in hero section
            </label>

            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={data.cv.showInContact || false}
                onChange={(e) => {
                  updateCV({ showInContact: e.target.checked })
                  onDataChange()
                }}
                className="mr-2 rounded"
              />
              Show download button in contact section
            </label>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h4 className="text-blue-300 font-semibold mb-2">📋 Instructions</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Upload only PDF files for best compatibility</li>
          <li>• Keep file size under 10MB for faster loading</li>
          <li>• Use a professional filename (e.g., "Krishna_Deshmukh_Resume.pdf")</li>
          <li>• Files are stored permanently in Supabase Storage</li>
          <li>• The download button will appear automatically once CV is uploaded</li>
          <li>• Your CV will be accessible even after browser refresh</li>
        </ul>
      </div>
    </div>
  )
}
