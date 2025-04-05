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

// Puzzle component that must be solved to access the main page
function PuzzleChallenge({ onSolved }: { onSolved: () => void }) {
  const [clues, setClues] = useState<string[]>(["glass blowing"])
  const [currentClueIndex, setCurrentClueIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [shuffleOut, setShuffleOut] = useState(false)
  const [showingAllClues, setShowingAllClues] = useState(false)

  const allClues = ["glass blowing", "robots", "reading", "poker", "sleeping in"]

  // Allowed keywords for the answer check
  const allowedKeywords = ["thing", "things", "hobby", "hobbies", "like", "likes", "enjoy", "enjoys"]

  // Function to reveal all remaining clues
  const revealAllClues = () => {
    // Only add clues that aren't already shown
    const remainingClues = allClues.filter((clue) => !clues.includes(clue))
    if (remainingClues.length > 0) {
      setClues([...clues, ...remainingClues])
      setShowingAllClues(true)
    } else {
      // If all clues are already shown, proceed to transition
      startTransition()
    }
  }

  // Function to start the transition animation
  const startTransition = () => {
    setShuffleOut(true)
    setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        onSolved()
      }, 800)
    }, 1500)
  }

  const handleSubmit = () => {
    if (!userInput.trim()) return

    // Add current guess to previous guesses
    setPreviousGuesses([...previousGuesses, userInput])

    // Normalize input: remove punctuation for easier matching
    const normalized = userInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")

    // Check if normalized answer contains "pranshu" and any allowed keyword
    const hasPranshu = normalized.indexOf("pranshu") !== -1
    const hasKeyword = allowedKeywords.some((kw) => normalized.indexOf(kw) !== -1)

    if (hasPranshu && hasKeyword) {
      setIsCorrect(true)
      // First reveal all remaining clues
      setTimeout(() => {
        revealAllClues()
        // Wait a moment to let user see all clues before transition
        setTimeout(() => {
          if (!showingAllClues) {
            startTransition()
          }
        }, 2500)
      }, 1200)
    } else {
      // Clear the input field for the next guess
      setUserInput("")

      // Reveal the next clue if available
      if (currentClueIndex < allClues.length - 1) {
        const nextIndex = currentClueIndex + 1
        setCurrentClueIndex(nextIndex)
        setClues([...clues, allClues[nextIndex]])
      } else if (currentClueIndex === allClues.length - 1) {
        // If all clues have been shown, reveal the answer
        setShowAnswer(true)
        setTimeout(() => {
          startTransition()
        }, 2000)
      }
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#f5f2e9] text-[#2d2d2d] z-50 transition-opacity duration-800 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="max-w-md w-full px-8 font-pixel">
        <div className="mb-10 space-y-1">
          {shuffleOut ? (
            <TextScramble
              text="Solve the puzzle by figuring out the common category connecting these clues."
              playOnMount={true}
              speed={1.5}
              className="text-lg tracking-wide text-center mb-6 text-[#2d2d2d]"
            />
          ) : (
            <p className="text-lg tracking-wide text-center mb-6 text-[#2d2d2d]">
              Solve the puzzle by figuring out the common category connecting these clues.
            </p>
          )}

          <div className="space-y-3">
            {clues.map((clue, index) => (
              <div
                key={index}
                className={`text-xl text-center py-2 border-b border-[#b45309]/20 ${
                  index === currentClueIndex && !isCorrect ? "text-[#b45309]" : "text-[#2d2d2d]"
                } ${showingAllClues && !clues.includes(allClues[index]) ? "text-[#b45309]" : ""}`}
              >
                {shuffleOut ? <TextScramble text={clue} playOnMount={true} speed={1.5} /> : clue}
              </div>
            ))}
          </div>
        </div>

        {previousGuesses.length > 0 && !shuffleOut && !isCorrect && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {previousGuesses.map((guess, index) => (
              <div key={index} className="line-through text-gray-500 px-2 py-1 bg-[#e7e5de] rounded-md text-sm">
                {shuffleOut ? <TextScramble text={guess} playOnMount={true} speed={1.5} /> : guess}
              </div>
            ))}
          </div>
        )}

        {showAnswer ? (
          <div className="text-[#b45309] text-center text-xl mb-4 animate-pulse">
            {shuffleOut ? (
              <TextScramble text="Answer: Things Pranshu enjoys" playOnMount={true} speed={1.5} />
            ) : (
              "Answer: Things Pranshu enjoys"
            )}
          </div>
        ) : isCorrect ? (
          <div className="text-[#b45309] text-center text-xl mb-4 animate-pulse">
            {shuffleOut ? <TextScramble text="Correct!" playOnMount={true} speed={1.5} /> : "Correct!"}
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyUp={handleKeyUp}
              placeholder="Enter your answer here"
              className="w-full px-4 py-3 rounded-md bg-[#e7e5de] border border-[#b45309]/30 focus:outline-none focus:border-[#b45309] focus:ring-1 focus:ring-[#b45309] transition-all text-center font-pixel text-[#2d2d2d]"
              autoFocus
              disabled={shuffleOut}
            />
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-3 bg-[#e7e5de] text-[#b45309] rounded-md hover:bg-[#b45309]/10 transition-colors border border-[#b45309]/30"
              disabled={shuffleOut}
            >
              {shuffleOut ? <TextScramble text="Submit" playOnMount={true} speed={1.5} /> : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading animation component
function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [loadingPercentage, setLoadingPercentage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [useScramble, setUseScramble] = useState(false)
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
        setUseScramble(true) // Enable text scramble for the transition
        setTimeout(() => {
          onComplete()
        }, 1200) // Delay to allow for scramble animation
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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f5f2e9] text-[#2d2d2d]">
      <div className="relative w-40 h-40 mb-8">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div
        className={`text-center font-pixel transition-all duration-500 ${
          isTransitioning && !useScramble ? "opacity-0 scale-110" : "opacity-100"
        }`}
      >
        {useScramble ? (
          <TextScramble text={`loading: ${loadingPercentage}%`} playOnMount={true} speed={1.2} />
        ) : (
          <div className="whitespace-nowrap">loading: {loadingPercentage}%</div>
        )}
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
      className="fixed inset-0 flex items-center justify-center bg-[#f5f2e9] text-[#2d2d2d] z-50 transition-opacity duration-500"
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
  const ageTextRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  // Measure the width of the text on first render
  useEffect(() => {
    if (ageTextRef.current && !width) {
      setWidth(ageTextRef.current.offsetWidth)
    }
  }, [width])

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
    <div ref={ageTextRef} style={width ? { minWidth: `${width}px` } : undefined}>
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
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  // Function to handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowPuzzle(true)
  }

  // Function to handle puzzle solved
  const handlePuzzleSolved = () => {
    setShowPuzzle(false)
    setShowTransition(true)
  }

  // Function to handle transition completion
  const handleTransitionComplete = () => {
    setShowTransition(false)
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

      {!isLoading && showPuzzle && <PuzzleChallenge onSolved={handlePuzzleSolved} />}

      {!isLoading && !showPuzzle && showTransition && (
        <TransitionEffect isVisible={showTransition} onComplete={handleTransitionComplete} />
      )}

      {!isLoading && !showPuzzle && !showTransition && contentVisible && (
        <main
          className={`flex h-full min-h-screen w-full flex-col items-center justify-start p-8 pt-16 text-sm transition-all duration-1000 sm:p-16 sm:pt-16 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="sm:space-y-15 h-full w-full max-w-md space-y-8 transition-all duration-[2000ms] sm:max-w-md md:max-w-lg lg:max-w-2xl">
            <div className="flex w-full flex-wrap gap-x-1">
              <a
                href="/"
                onClick={reloadPage}
                className="transition-all duration-150 text-[#2d2d2d] hover:text-[#b45309]"
              >
                <TextScramble text="[pranshurao.com]" />
              </a>
            </div>

            <div className="flex h-full w-full flex-col items-start space-y-5">
              <h1 className="text-3xl font-medium mb-1">
                <TextScramble text="Pranshu Rao" playOnMount={true} />
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-[#78716c]">
                <ClientOnlyAgeDisplay />

                <div className="mt-2 sm:mt-0">
                  <TextScramble text="Currently in: Berkeley, CA" />
                </div>
              </div>

              <div className="h-full w-full items-start space-y-4 font-serif text-lg mt-4 text-[#2d2d2d]">
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
                  <a
                    className="text-[#2d2d2d] hover:text-[#b45309] transition-colors"
                    href="mailto:pranshu_rao@berkeley.edu"
                  >
                    pranshu_rao@berkeley.edu
                  </a>
                  !
                </p>
              </div>

              <div className="flex h-full w-full flex-wrap items-end justify-end space-x-4 pt-6 text-sm">
                <Link
                  className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
                  href="https://www.linkedin.com/in/pranshurao/"
                >
                  <TextScramble text="[linkedin]" />
                </Link>
                <Link
                  className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
                  href="https://github.com/PvRao-29"
                >
                  <TextScramble text="[github]" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

