import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio Admin | Krishna Deshmukh",
  description: "Admin dashboard for managing portfolio content",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-900">{children}</div>
}
