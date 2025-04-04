"use client"

import { useState, useEffect, useRef, forwardRef } from "react"

interface TextScrambleProps {
  text: string
  speed?: number
  tick?: number
  step?: number
  chance?: number
  seed?: number
  scramble?: number
  ignore?: string[]
  range?: number[]
  overdrive?: boolean | number
  overflow?: boolean
  playOnMount?: boolean
  onMouseOver?: () => void
  onMouseLeave?: () => void
  onAnimationStart?: () => void
  onAnimationEnd?: () => void
}

export const TextScramble = forwardRef<HTMLSpanElement, TextScrambleProps>(function TextScramble(
  {
    text,
    speed = 0.75,
    tick = 1,
    step = 1,
    chance = 1,
    seed = 15,
    scramble = 10,
    ignore = [" "],
    range = [65, 125],
    overdrive = false,
    overflow = true,
    playOnMount = true,
    onMouseOver,
    onMouseLeave,
    onAnimationStart,
    onAnimationEnd,
  },
  ref,
) {
  const [displayText, setDisplayText] = useState(text)
  const spanRef = useRef<HTMLSpanElement>(null)
  const combinedRef = (node: HTMLSpanElement) => {
    spanRef.current = node
    if (typeof ref === "function") {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  const animationRef = useRef<number | null>(null)
  const lastUpdateRef = useRef(0)
  const tickCountRef = useRef(0)
  const revealedCharsRef = useRef(0)
  const overdriveCharsRef = useRef(0)
  const charsRef = useRef<(string | number)[]>([])
  const frameTimeRef = useRef(1000 / (60 * speed))
  const textRef = useRef(text)
  const isAnimatingRef = useRef(false)

  // Helper functions
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function randomChar(charRange: number[]) {
    let code = 0
    if (charRange.length === 2) {
      code = randomInt(charRange[0], charRange[1])
    } else {
      code = charRange[randomInt(0, charRange.length - 1)]
    }
    return String.fromCharCode(code)
  }

  function shouldIgnore(char: string, replacement: string | number) {
    return ignore.includes(`${char}`) ? char : replacement
  }

  // Animation logic
  function scrambleChars() {
    if (revealedCharsRef.current !== text.length) {
      for (let i = 0; i < seed; i++) {
        const index = randomInt(revealedCharsRef.current, charsRef.current.length)
        if (typeof charsRef.current[index] !== "number" && typeof charsRef.current[index] !== "undefined") {
          charsRef.current[index] = shouldIgnore(
            charsRef.current[index] as string,
            randomInt(0, 10) >= (1 - chance) * 10 ? scramble || seed : 0,
          )
        }
      }
    }
  }

  function revealChars() {
    for (let i = 0; i < step; i++) {
      if (revealedCharsRef.current < text.length) {
        const shouldScramble = randomInt(0, 10) >= (1 - chance) * 10
        charsRef.current[revealedCharsRef.current] = shouldIgnore(
          text[revealedCharsRef.current],
          shouldScramble ? scramble + randomInt(0, Math.ceil(scramble / 2)) : 0,
        )
        revealedCharsRef.current++
      }
    }
  }

  function adjustLength() {
    if (text.length < charsRef.current.length) {
      charsRef.current.pop()
      charsRef.current.splice(text.length, step)
    }

    for (let i = 0; i < step; i++) {
      if (charsRef.current.length < text.length) {
        charsRef.current.push(shouldIgnore(text[charsRef.current.length + 1], null))
      }
    }
  }

  function applyOverdrive() {
    if (overdrive) {
      for (let i = 0; i < step; i++) {
        const maxLength = Math.max(charsRef.current.length, text.length)
        if (overdriveCharsRef.current < maxLength) {
          charsRef.current[overdriveCharsRef.current] = shouldIgnore(
            text[overdriveCharsRef.current],
            String.fromCharCode(typeof overdrive === "boolean" ? 95 : (overdrive as number)),
          )
          overdriveCharsRef.current++
        }
      }
    }
  }

  function updateChars() {
    revealChars()
    adjustLength()
    scrambleChars()
  }

  function renderText() {
    if (!spanRef.current) return

    let output = ""

    for (let i = 0; i < charsRef.current.length; i++) {
      const char = charsRef.current[i]

      if (typeof char === "number" && char > 0) {
        output += randomChar(range)
        if (i <= revealedCharsRef.current) {
          charsRef.current[i] = (charsRef.current[i] as number) - 1
        }
      } else if (typeof char === "string" && (i >= text.length || i >= revealedCharsRef.current)) {
        output += char
      } else if (char === text[i] && i < revealedCharsRef.current) {
        output += text[i]
      } else if (char === 0 && i < text.length) {
        output += text[i]
        charsRef.current[i] = text[i]
      } else {
        output += ""
      }
    }

    spanRef.current.innerHTML = output
    setDisplayText(output)

    if (output === text) {
      charsRef.current.splice(text.length, charsRef.current.length)
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
        animationRef.current = null
        isAnimatingRef.current = false
        if (onAnimationEnd) {
          onAnimationEnd()
        }
      }
    }

    tickCountRef.current++
  }

  function animate(time: number) {
    if (!speed) return

    animationRef.current = window.requestAnimationFrame(animate)
    applyOverdrive()

    if (time - lastUpdateRef.current > frameTimeRef.current) {
      lastUpdateRef.current = time
      if (tickCountRef.current % tick === 0) {
        updateChars()
      }
      renderText()
    }
  }

  function reset() {
    tickCountRef.current = 0
    revealedCharsRef.current = 0
    overdriveCharsRef.current = 0

    if (!overflow) {
      charsRef.current = new Array(text?.length)
    }
  }

  function startAnimation() {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    isAnimatingRef.current = true
    if (onAnimationStart) {
      onAnimationStart()
    }

    reset()
    animationRef.current = window.requestAnimationFrame(animate)
  }

  // Initialize
  useEffect(() => {
    textRef.current = text

    if (playOnMount) {
      startAnimation()
    } else {
      charsRef.current = text.split("")
      tickCountRef.current = text.length
      revealedCharsRef.current = text.length
      overdriveCharsRef.current = text.length
      renderText()
    }

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [])

  // Update frame time when speed changes
  useEffect(() => {
    frameTimeRef.current = 1000 / (60 * speed)
  }, [speed])

  // Handle text changes without restarting animation
  useEffect(() => {
    // Only update the text reference, don't restart animation
    textRef.current = text
  }, [text])

  const handleMouseOver = () => {
    if (onMouseOver) {
      onMouseOver()
    } else {
      startAnimation()
    }
  }

  return (
    <span
      ref={combinedRef}
      tabIndex={0}
      role="text"
      onMouseOver={handleMouseOver}
      onMouseLeave={onMouseLeave}
      className="inline-block cursor-pointer font-pixel"
    >
      {displayText}
    </span>
  )
})

