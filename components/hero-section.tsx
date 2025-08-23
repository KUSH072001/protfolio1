"use client"
import { motion } from "framer-motion"
import { Download, ArrowDown } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

export default function HeroSection() {
  const { data, isLoading } = usePortfolio()
  const { profile, cv } = data

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circle Particles */}
        <div className="particle particle-1 w-2 h-2 bg-blue-400/30 rounded-full"></div>
        <div className="particle particle-2 w-3 h-3 bg-green-400/20 rounded-full"></div>
        <div className="particle particle-3 w-1 h-1 bg-purple-400/40 rounded-full"></div>
        <div className="particle particle-4 w-2 h-2 bg-yellow-400/25 rounded-full"></div>
        <div className="particle particle-5 w-4 h-4 bg-blue-300/15 rounded-full"></div>
        <div className="particle particle-6 w-1 h-1 bg-green-300/35 rounded-full"></div>
        <div className="particle particle-7 w-3 h-3 bg-purple-300/20 rounded-full"></div>
        <div className="particle particle-8 w-2 h-2 bg-pink-400/30 rounded-full"></div>
        <div className="particle particle-9 w-1 h-1 bg-cyan-400/40 rounded-full"></div>
        <div className="particle particle-10 w-2 h-2 bg-indigo-400/25 rounded-full"></div>

        {/* Star Particles */}
        <div className="particle particle-star-1 text-yellow-400/30 text-xs">✦</div>
        <div className="particle particle-star-2 text-blue-400/25 text-sm">✧</div>
        <div className="particle particle-star-3 text-green-400/35 text-xs">✦</div>
        <div className="particle particle-star-4 text-purple-400/20 text-sm">✧</div>
        <div className="particle particle-star-5 text-pink-400/30 text-xs">✦</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Hello, I'm{" "}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {profile.tagline}
          </motion.p>

          {/* Animated Tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {profile.tags.map((tag, index) => (
              <motion.span
                key={index}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${tag.gradientStart} ${tag.gradientEnd} text-white text-sm font-medium shadow-lg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  repeatDelay: 3 + index * 0.5,
                }}
                whileHover={{ scale: 1.05 }}
              >
                {tag.text}
              </motion.span>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {cv.showInHero && cv.url && (
              <motion.a
                href={cv.url}
                download
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} className="mr-2" />
                {cv.buttonText}
              </motion.a>
            )}

            <motion.button
              onClick={scrollToAbout}
              className="inline-flex items-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowDown size={20} className="ml-2" />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(15px); }
        }

        @keyframes floatFast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-25px) translateX(-15px); }
          66% { transform: translateY(-5px) translateX(20px); }
        }

        .particle {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 30%; right: 15%; animation: floatSlow 8s ease-in-out infinite; animation-delay: 1s; }
        .particle-3 { top: 60%; left: 20%; animation: floatFast 4s ease-in-out infinite; animation-delay: 2s; }
        .particle-4 { top: 80%; right: 25%; animation-delay: 3s; }
        .particle-5 { top: 15%; left: 60%; animation: floatSlow 7s ease-in-out infinite; animation-delay: 0.5s; }
        .particle-6 { top: 45%; right: 10%; animation: floatFast 5s ease-in-out infinite; animation-delay: 1.5s; }
        .particle-7 { top: 70%; left: 70%; animation-delay: 2.5s; }
        .particle-8 { top: 25%; left: 80%; animation: floatSlow 6s ease-in-out infinite; animation-delay: 3.5s; }
        .particle-9 { top: 55%; right: 30%; animation: floatFast 4.5s ease-in-out infinite; animation-delay: 4s; }
        .particle-10 { top: 85%; left: 40%; animation-delay: 4.5s; }

        .particle-star-1 { top: 35%; left: 25%; animation: floatSlow 9s ease-in-out infinite; animation-delay: 1s; }
        .particle-star-2 { top: 65%; right: 20%; animation: floatFast 3.5s ease-in-out infinite; animation-delay: 2s; }
        .particle-star-3 { top: 50%; left: 75%; animation-delay: 3s; }
        .particle-star-4 { top: 20%; right: 40%; animation: floatSlow 7.5s ease-in-out infinite; animation-delay: 4s; }
        .particle-star-5 { top: 75%; left: 15%; animation: floatFast 5.5s ease-in-out infinite; animation-delay: 0.5s; }
      `}</style>
    </section>
  )
}
