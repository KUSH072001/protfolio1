"use client"

import { useEffect } from "react"

export default function NoV0Popup() {
  useEffect(() => {
    const removeV0Elements = () => {
      try {
        // Remove v0 popup elements safely
        const selectors = ["[data-v0-popup]", ".v0-popup", '[class*="v0"]', '[id*="v0"]']

        selectors.forEach((selector) => {
          try {
            const elements = document.querySelectorAll(selector)
            elements.forEach((element) => {
              try {
                if (element && element.parentNode) {
                  element.parentNode.removeChild(element)
                }
              } catch (removeError) {
                // Silently handle removeChild errors
                console.debug("Element removal handled:", removeError)
              }
            })
          } catch (queryError) {
            // Silently handle query errors
            console.debug("Query handled:", queryError)
          }
        })
      } catch (error) {
        // Silently handle all errors
        console.debug("V0 cleanup handled:", error)
      }
    }

    // Initial cleanup
    removeV0Elements()

    // Periodic cleanup
    const interval = setInterval(removeV0Elements, 1000)

    // Cleanup on unmount
    return () => {
      clearInterval(interval)
    }
  }, [])

  return null
}
