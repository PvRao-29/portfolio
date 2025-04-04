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

// Age display component
function AgeDisplay() {
  const [displayAge, setDisplayAge] = useState("0.00000000")
  const [isAnimating, setIsAnimating] = useState(true)
  const [key, setKey] = useState(Date.now())
  const initialLoadDoneRef = useRef(false)

  // Calculate age in real-time
  useEffect(() => {
    // Calculate initial age immediately on client
    const birthDate = new Date("2006-10-29T02:30:00+05:30")
    const calculateAge = () => {
      const now = new Date()
      const diffMs = now.getTime() - birthDate.getTime()
      const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)
      return ageInYears.toFixed(8)
    }

    // Set initial age
    setDisplayAge(calculateAge())

    // Set a timeout for initial animation to complete
    if (!initialLoadDoneRef.current) {
      const initialTimer = setTimeout(() => {
        initialLoadDoneRef.current = true
        setIsAnimating(false)
      }, 3000)

      return () => clearTimeout(initialTimer)
    }

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
      <TextScramble key={key} text={`Age: ${displayAge}`} playOnMount={true} onMouseOver={handleMouseOver} />
    </div>
  )
}

export default function Home() {
  // Function to reload the page
  const reloadPage = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.reload()
  }

  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center justify-start p-8 pt-16 text-sm sm:p-16 sm:pt-16">
      <div className="sm:space-y-15 h-full w-full max-w-md space-y-6 transition-all duration-[2000ms] sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <div className="flex w-full flex-wrap gap-x-1">
          <a href="/" onClick={reloadPage} className="transition-all duration-150">
            <TextScramble text="[pranshurao.com]" />
          </a>
        </div>

        <div className="flex h-full w-full flex-col items-start space-y-3">
          <h1 className="text-2xl">
            <TextScramble text="Pranshu Rao" />
          </h1>

          <ClientOnlyAgeDisplay />

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
              In addition to sending mankind to space, I also work on pushing the limits of machine cognition. This summer
              I will be forecasting enterprise decision making at o9 solutions as a part of their engineering team.
            </p>
            <p>
              In my spare time, you'll find me at the felt, punting with a VPIP of 70%. Surprisingly, I am a profitable
              player.
            </p>
            <p>
              I thrive on creative problem-solving—whether it's quantifying uncertainty at the poker table or engineering
              stability in the chaos of hypersonic flight.
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
  )
}

