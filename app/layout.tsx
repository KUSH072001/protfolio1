import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PortfolioProvider } from "@/contexts/portfolio-context"
import NoV0Popup from "@/components/no-v0-popup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Krishna Deshmukh - Java Full Stack Developer",
  description:
    "Portfolio of Krishna Deshmukh, a passionate Java Full Stack Developer specializing in Spring Boot, React, and modern web technologies.",
  keywords: "Java, Spring Boot, React, Full Stack Developer, Web Development, Portfolio",
  authors: [{ name: "Krishna Deshmukh" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <PortfolioProvider>
          <NoV0Popup />
          {children}
        </PortfolioProvider>
      </body>
    </html>
  )
}
