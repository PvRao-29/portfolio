"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { TextScramble } from "@/components/text-scramble"
import dynamic from "next/dynamic"

// Create a client-only version of the AgeDisplay component
const ClientOnlyAgeDisplay = dynamic(() => Promise.resolve(AgeDisplay), {
  ssr: false, // This prevents server-side rendering
})

// Enhanced Glitch transition component that can handle multiple texts
function GlitchTransition({
  isVisible,
  onComplete,
  texts,
  duration = 2000,
}: {
  isVisible: boolean
  onComplete: () => void
  texts: string[]
  duration?: number
}) {
  const [opacity, setOpacity] = useState(1)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    // Initial state
    setOpacity(1)
    setCurrentTextIndex(0)
    setKey(0)

    // Handle sequence of texts
    if (texts.length > 1) {
      texts.forEach((_, index) => {
        if (index === 0) return // Skip first text as it's already set

        setTimeout(() => {
          setCurrentTextIndex(index)
          setKey((prev) => prev + 1) // Force TextScramble to re-render
        }, duration * index) // Each text gets its own duration
      })

      // Fade out after all texts have been shown
      setTimeout(() => {
        setOpacity(0)
        setTimeout(() => onComplete(), 400)
      }, duration * texts.length)
    } else {
      // Single text behavior (original)
      setTimeout(() => {
        setOpacity(0)
        setTimeout(() => onComplete(), 400)
      }, duration)
    }
  }, [isVisible, duration, onComplete, texts])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#f5f2e9] text-[#2d2d2d] z-50 transition-opacity duration-400"
      style={{ opacity }}
    >
      <div className="text-2xl font-pixel">
        <TextScramble key={key} text={texts[currentTextIndex]} playOnMount={true} speed={1.2} />
      </div>
    </div>
  )
}

// Loading animation component
function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [loadingPercentage, setLoadingPercentage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const duration = 3000 // 3 seconds for the loading animation

  // Create a reference for the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Function to handle loading progress
    const updateLoading = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Update loading percentage
      const newPercentage = Math.floor(progress * 100)
      setLoadingPercentage(newPercentage)

      if (progress < 1) {
        requestAnimationFrame(updateLoading)
      } else {
        // Start transition when loading completes
        setIsTransitioning(true)
        // onComplete will be called by the GlitchTransition component
      }
    }

    requestAnimationFrame(updateLoading)
  }, [onComplete])

  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio

    // Scale context to match device pixel ratio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a minimal, elegant loading animation
    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const radius = Math.min(centerX, centerY) * 0.6

    // Draw progress arc
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (2 * Math.PI * loadingPercentage) / 100

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = "#b45309"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw subtle background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e7e5de"
    ctx.lineWidth = 1
    ctx.stroke()
  }, [loadingPercentage])

  return (
    <>
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center bg-[#f5f2e9] text-[#2d2d2d] transition-opacity duration-600 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <div className="relative w-40 h-40 mb-8">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <div className="font-pixel">
          <div className="whitespace-nowrap">loading: {loadingPercentage}%</div>
        </div>
      </div>

      {isTransitioning && (
        <GlitchTransition isVisible={true} onComplete={onComplete} texts={["ready", "Pranshu Rao"]} duration={1500} />
      )}
    </>
  )
}

// Helper function to calculate age
function calculateAge() {
  const birthDate = new Date("2006-10-29T02:30:00+05:30")
  const now = new Date()
  const diffMs = now.getTime() - birthDate.getTime()
  const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)
  return ageInYears.toFixed(8)
}

// Age display component with monospace font approach
function AgeDisplay() {
  // Initialize with the actual age
  const [displayAge, setDisplayAge] = useState(calculateAge())
  const [isAnimating, setIsAnimating] = useState(false)
  const [key, setKey] = useState(Date.now())

  // Set up the interval for live updates
  useEffect(() => {
    if (!isAnimating) {
      const interval = setInterval(() => {
        setDisplayAge(calculateAge())
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isAnimating])

  const handleMouseOver = () => {
    setIsAnimating(true)
    setKey(Date.now())

    setTimeout(() => {
      setIsAnimating(false)
    }, 3000)
  }

  // Create the full text with non-breaking space to keep it on one line
  const fullText = `Age: ${displayAge}\u00A0years\u00A0old`

  return (
    <div className="text-[#78716c]">
      {/* Use a pre-formatted, fixed-width container with monospace styling */}
      <div
        className="inline-block whitespace-nowrap"
        style={{
          fontFamily: "'Pixel', monospace",
          letterSpacing: "normal",
          // Force minimum width to prevent shrinking
          minWidth: "240px",
        }}
      >
        <span
          className="cursor-pointer"
          onMouseOver={handleMouseOver}
          style={{ display: "inline-block", width: "100%" }}
        >
          <TextScramble key={key} text={fullText} playOnMount={isAnimating} speed={1.2} />
        </span>
      </div>
    </div>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)

  // Function to handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Show main content immediately after loading
    setContentVisible(true)
  }

  // Function to reload the page
  const reloadPage = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.reload()
  }

  return (
    <>
      {isLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}

      {!isLoading && contentVisible && (
        <main
          className={`flex h-screen w-full flex-col justify-between transition-all duration-1000 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Content container with evenly distributed spacing */}
          <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-8 sm:px-8 sm:pt-16 flex-grow flex items-center transition-all duration-[2000ms]">
            {/* Main content grid with redesigned layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full">
              {/* Left column - Bio header with improved spacing */}
              <div className="md:col-span-1 space-y-6">
                <div className="space-y-4">
                  {/* Site link with subtle design */}
                  <div className="mb-2">
                    <a
                      href="/"
                      onClick={reloadPage}
                      className="transition-all duration-150 text-[#78716c] hover:text-[#b45309] text-sm inline-block"
                    >
                      <TextScramble text="[pranshurao.com]" />
                    </a>
                  </div>

                  <h1 className="text-3xl font-medium">
                    <TextScramble text="Pranshu Rao" playOnMount={true} />
                  </h1>

                  {/* Fix the alignment of "Currently in" and "Age" by removing the pl-5 class and aligning them with the name */}
                  <div className="text-[#78716c] flex items-center">
                    <div className="inline-block w-3 h-3 bg-[#b45309] rounded-full mr-2 animate-pulse"></div>
                    <TextScramble text="Currently in: Winnetka, IL" />
                  </div>

                  {/* Age display with improved styling and alignment fixed */}
                  <div className="text-[#78716c]">
                    <ClientOnlyAgeDisplay />
                  </div>
                </div>

                {/* Social links with improved styling */}
                <div className="flex flex-wrap gap-5 pt-2">
                  <Link
                    className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
                    href="https://www.linkedin.com/in/pranshurao/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TextScramble text="[linkedin]" />
                  </Link>
                  <Link
                    className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
                    href="https://github.com/PvRao-29"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TextScramble text="[github]" />
                  </Link>
                </div>
              </div>

              {/* Right column - Bio content with reduced spacing */}
              <div className="md:col-span-2 font-serif text-lg text-[#2d2d2d] border-l-2 border-[#b45309]/20 hover:border-[#b45309] transition-colors duration-300 pl-5 md:pl-6 py-2 space-y-6">
                {/* Introduction section */}
                <section>
                  <p className="mb-5">Hi, I'm Pranshu.</p>
                  <p className="mb-5">
                    I'm a second-year EECS major at UC Berkeley, minoring in Philosophy, originally from Winnetka, IL. I
                    am interested in the use of mathematical modeling and machine learning in real world predictive
                    systems.
                  </p>
                </section>

                {/* Work section */}
                <section>
                  {/* Add links to the company names with the same hover effect as the email */}
                  <p className="mb-5">
                    Currently, I work as an engineer at{" "}
                    <a
                      href="https://www.berkeleyse.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      Space Enterprise at Berkeley
                    </a>
                    , where I simulate the effects of fin flutter on rocket stability.
                  </p>
                  <p className="mb-5">
                    In addition to sending mankind to space, I also work on pushing the limits of machine cognition.
                    This summer I will be forecasting enterprise decision making at{" "}
                    <a
                      href="https://o9solutions.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      o9 solutions
                    </a>{" "}
                    as a part of their engineering team.
                  </p>
                </section>

                {/* Personal interests section */}
                <section>
                  <p className="mb-5">
                    In my spare time, you'll find me at the{" "}
                    <a
                      href="https://poker.studentorg.berkeley.edu/people.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      felt
                    </a>
                    , punting with a VPIP of 70%. Surprisingly, I am a profitable player.
                  </p>
                  <p className="mb-5">
                    I thrive on creative problem-solving—whether it's quantifying uncertainty at the poker table or
                    engineering stability in the chaos of hypersonic flight.
                  </p>
                </section>

                {/* Contact section without highlight box */}
                <section>
                  <p>
                    Always open to interesting conversations—reach me at{" "}
                    <a
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                      href="mailto:pranshu_rao@berkeley.edu"
                    >
                      pranshu_rao@berkeley.edu
                    </a>
                    !
                  </p>
                </section>
              </div>
            </div>
          </div>

          {/* Footer positioned at the bottom */}
          <footer className="w-full border-t border-[#2d2d2d]/10 py-4 mt-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-[#78716c] text-sm">
              <TextScramble text="© 2025 Pranshu Rao" />
            </div>
          </footer>
        </main>
      )}
    </>
  )
}
