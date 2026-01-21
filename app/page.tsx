"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
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
  const [showIntro, setShowIntro] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  // Only show the glitch intro the first time per session
  useEffect(() => {
    if (typeof window === "undefined") return

    const hasShownIntro = window.sessionStorage.getItem("introShown")

    if (hasShownIntro) {
      // Skip intro on subsequent visits
      setContentVisible(true)
    } else {
      // Show intro the first time
      setShowIntro(true)
    }
  }, [])

  // Function to handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false)
    // Mark intro as shown for this session
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("introShown", "true")
    }
    // Show main content immediately after intro
    setContentVisible(true)
  }

  // Function to reload the page
  const reloadPage = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.reload()
  }

  return (
    <>
      {showIntro && (
        <GlitchTransition
          isVisible={showIntro}
          onComplete={handleIntroComplete}
          texts={["Pranshu Rao"]}
          duration={1500}
        />
      )}

      {contentVisible && (
        <main
          className={`flex flex-1 w-full flex-col justify-between transition-all duration-1000 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Content container with evenly distributed spacing */}
          <div className="w-full max-w-5xl mx-auto px-4 pt-8 pb-4 sm:px-8 sm:pt-10 flex-grow flex items-center transition-all duration-[2000ms]">
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
                    <TextScramble text="Currently in: Berkeley, CA" />
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
                  <p className="mb-5">Hi, I’m Pranshu.</p>
                  <p className="mb-5">
                    I’m interested in using computation to tackle problems that resist clean analytic solutions. My
                    focus is on designing efficient systems and building predictive models for complex,
                    hard-to-model environments. Outside of work, I enjoy applying the same ideas to puzzles and games.
                  </p>
                </section>

                {/* Work section */}
                <section>
                  {/* Add links to the company names with the same hover effect as the email */}
                  <p className="mb-5">
                    Currently, I am an undergraduate researcher at{" "}
                    <a
                      href="https://bair.berkeley.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      Berkeley AI Research Lab
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://sky.cs.berkeley.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      Sky Computing Lab
                    </a>
                    , where I work towards Model Scalability and Personalization. My most recent work has focused on
                    tuning black-box models using personalization layers, in collaboration with the{" "}
                    <a
                      href="https://deepmind.google/models/gemini/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      Google Gemini
                    </a>
                    team.
                  </p>
                  <p className="mb-5">
                    Previously, I developed production-grade forecasting systems for enterprise decision-making at{" "}
                    <a
                      href="https://o9solutions.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      o9 solutions
                    </a>
                    , shipping models used in real operational environments.
                  </p>
                </section>

                {/* Focus section */}
                <section>
                  <p>
                  I’m partway through my undergraduate studies at{" "}
                  <a
                      href="https://www.berkeley.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    >
                      UC Berkeley
                    </a>
                  , where I study EECS and Philosophy.
                  </p>
                </section>

                {/* Contact section without highlight box */}
                <section>
                  <p>
                    Always open to interesting conversations and feedback on my writing—reach me at{" "}
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
          <footer className="w-full border-t border-[#2d2d2d]/10 py-3 mt-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-[#78716c] text-sm">
              <TextScramble text="© 2026 Pranshu Rao" />
            </div>
          </footer>
        </main>
      )}
    </>
  )
}
