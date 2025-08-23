import { supabase } from "./supabase"

export class StorageService {
  // Upload file to Supabase Storage
  static async uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${path}/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Upload error:", error)
        return null
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error("Error uploading file:", error)
      return null
    }
  }

  // Upload profile image
  static async uploadProfileImage(file: File): Promise<string | null> {
    return this.uploadFile(file, "profile-images", "avatars")
  }

  // Upload project image
  static async uploadProjectImage(file: File): Promise<string | null> {
    return this.uploadFile(file, "project-images", "projects")
  }

  // Upload CV/Resume
  static async uploadCV(file: File): Promise<string | null> {
    return this.uploadFile(file, "documents", "resumes")
  }

  // Delete file from storage
  static async deleteFile(url: string, bucket: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = url.split("/")
      const fileName = urlParts[urlParts.length - 1]
      const folder = urlParts[urlParts.length - 2]
      const filePath = `${folder}/${fileName}`

      const { error } = await supabase.storage.from(bucket).remove([filePath])

      if (error) {
        console.error("Delete error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  // Fallback: Convert file to base64 for localStorage
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Create storage buckets if they don't exist
  static async initializeStorage(): Promise<boolean> {
    try {
      const buckets = ["profile-images", "project-images", "documents"]

      for (const bucketName of buckets) {
        const { data: existingBucket } = await supabase.storage.getBucket(bucketName)

        if (!existingBucket) {
          const { error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes:
              bucketName === "documents" ? ["application/pdf"] : ["image/jpeg", "image/png", "image/webp", "image/gif"],
            fileSizeLimit: bucketName === "documents" ? 10485760 : 5242880, // 10MB for docs, 5MB for images
          })

          if (error) {
            console.error(`Error creating bucket ${bucketName}:`, error)
          }
        }
      }

      return true
    } catch (error) {
      console.error("Error initializing storage:", error)
      return false
    }
  }
}
