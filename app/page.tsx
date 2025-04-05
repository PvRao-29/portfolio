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

// Loading animation component
function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [loadingPercentage, setLoadingPercentage] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const duration = 3000 // 3 seconds for the loading animation

  useEffect(() => {
    // Function to animate the dot
    const animateDot = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Update loading percentage
      const newPercentage = Math.floor(progress * 100)
      if (newPercentage !== loadingPercentage) {
        setLoadingPercentage(newPercentage)
      }

      // Create a circular motion path
      const angle = progress * Math.PI * 4 // 2 full circles
      const radius = 30 * (1 - progress) // Radius decreases as we progress
      const centerX = 50
      const centerY = 50

      setPosition({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateDot)
      } else {
        // Start transition when animation completes
        setIsTransitioning(true)
        setTimeout(() => {
          onComplete()
        }, 800) // Shorter delay for smoother transition
      }
    }

    animationRef.current = requestAnimationFrame(animateDot)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [onComplete, loadingPercentage])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white text-black overflow-hidden">
      <div className="relative h-40 w-40">
        <div
          className="absolute h-4 w-4 rounded-full bg-black"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-pixel transition-all duration-500 ${
            isTransitioning ? "opacity-0 scale-110" : "opacity-100"
          }`}
        >
          <div className="whitespace-nowrap">loading: {loadingPercentage}%</div>
        </div>
      </div>
    </div>
  )
}

// Transition component that handles the text shuffle effect
function TransitionEffect({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) {
  const [stage, setStage] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (isVisible) {
      // Sequence of transitions
      const timeline = [
        // Fade in
        () => {
          setOpacity(1)
          setStage(1) // "loading: 100%"
        },
        // First transition
        () => {
          setStage(2) // "Pranshu Rao"
        },
        // Fade out
        () => {
          setOpacity(0)
        },
        // Complete
        () => {
          onComplete()
        },
      ]

      // Execute the timeline with appropriate delays
      let delay = 0
      timeline.forEach((action, index) => {
        setTimeout(action, delay)
        delay += index === 0 ? 200 : 800 // Shorter first delay, longer for transitions
      })

      return () => {
        // Clear any pending timeouts if component unmounts
        for (let i = 0; i < timeline.length; i++) {
          clearTimeout(delay * i)
        }
      }
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  // Determine what text to show based on stage
  let text = ""
  if (stage === 1) text = "loading: 100%"
  else if (stage === 2) text = "Pranshu Rao"

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white text-black z-50 transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="text-2xl font-pixel">
        {stage > 0 && <TextScramble key={stage} text={text} playOnMount={true} speed={1.2} />}
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

// Age display component
function AgeDisplay() {
  // Initialize with the actual age instead of "0.00000000"
  const [displayAge, setDisplayAge] = useState(calculateAge())
  const [isAnimating, setIsAnimating] = useState(false) // Start without animation
  const [key, setKey] = useState(Date.now())
  const initialLoadDoneRef = useRef(true) // Mark as already done

  // Set up the interval for live updates immediately
  useEffect(() => {
    // Only set up live updates if not animating
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

    // Set a timeout to resume live updates after animation
    setTimeout(() => {
      setIsAnimating(false)
    }, 3000) // Animation takes about 3 seconds
  }

  return (
    <div>
      <span className="inline-block cursor-pointer font-pixel" onMouseOver={handleMouseOver}>
        <TextScramble
          key={key}
          text={`Age: ${displayAge}`}
          playOnMount={isAnimating} // Only play animation when isAnimating is true
          speed={1.2}
        />
      </span>
    </div>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  // Function to handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false)
    setIsTransitioning(true)
  }

  // Function to handle transition completion
  const handleTransitionComplete = () => {
    setIsTransitioning(false)
    // Add a small delay before showing content
    setTimeout(() => {
      setContentVisible(true)
    }, 100)
  }

  // Function to reload the page
  const reloadPage = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.reload()
  }

  return (
    <>
      {isLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}

      <TransitionEffect isVisible={isTransitioning} onComplete={handleTransitionComplete} />

      <main
        className={`flex h-full min-h-screen w-full flex-col items-center justify-start p-8 pt-16 text-sm transition-all duration-1000 sm:p-16 sm:pt-16 ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="sm:space-y-15 h-full w-full max-w-md space-y-6 transition-all duration-[2000ms] sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <div className="flex w-full flex-wrap gap-x-1">
            <a href="/" onClick={reloadPage} className="transition-all duration-150">
              <TextScramble text="[pranshurao.com]" />
            </a>
          </div>

          <div className="flex h-full w-full flex-col items-start space-y-3">
            <h1 className="text-2xl">
              <TextScramble text="Pranshu Rao" playOnMount={contentVisible} />
            </h1>

            <div>
              <ClientOnlyAgeDisplay />
            </div>

            <h3 className="text-gray-600 mt-2">
              <TextScramble text="Currently in: Berkeley, CA" />
            </h3>

            <div className="h-full w-full items-start space-y-4 font-serif text-lg mt-2">
              <p>Hi, I'm Pranshu.</p>
              <p>
                I'm a first-year EECS major at UC Berkeley, minoring in Philosophy, originally from Winnetka, IL. I am
                interested in the use of mathematical modeling and machine learning in real world predictive systems.
              </p>
              <p>
                Currently, I work as an engineer at Space Enterprise at Berkeley, where I simulate the effects of fin
                flutter on rocket stability.
              </p>
              <p>
                In addition to sending mankind to space, I also work on pushing the limits of machine cognition. This
                summer I will be forecasting enterprise decision making at o9 solutions as a part of their engineering
                team.
              </p>
              <p>
                In my spare time, you'll find me at the felt, punting with a VPIP of 70%. Surprisingly, I am a
                profitable player.
              </p>
              <p>
                I thrive on creative problem-solving—whether it's quantifying uncertainty at the poker table or
                engineering stability in the chaos of hypersonic flight.
              </p>
              <p>
                Always open to interesting conversations—reach me at{" "}
                <a className="" href="mailto:pranshu_rao@berkeley.edu">
                  pranshu_rao@berkeley.edu
                </a>
                !
              </p>
            </div>

            <div className="flex h-full w-full flex-wrap items-end justify-end space-x-1 space-y-10 text-sm">
              <Link className="transition-all duration-150" href="https://www.linkedin.com/in/pranshurao/">
                <TextScramble text="[linkedin]" />
              </Link>
              <p className="inline sm:invisible sm:block sm:pr-0">•</p>
              <Link className="transition-all duration-150" href="https://github.com/PvRao-29">
                <TextScramble text="[github]" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

