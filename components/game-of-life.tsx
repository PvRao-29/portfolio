"use client"

import { useEffect, useRef } from "react"

const THEME = {
  background: "#f5f2e9",
  ink: "#2d2d2d",
  grid: "#d4cfc4",
} as const

interface GameOfLifeProps {
  width?: number // cols
  height?: number // rows
  cellSize?: number // logical cell size in px (before scaling)
  seed?: number
  aliveProb?: number
  frameIntervalMs?: number
  className?: string
}

/** Seeded LCG for reproducible random initial state */
function createSeededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    // divide by 2^32 for [0,1)
    return state / 0x1_0000_0000
  }
}

/** Flat grid: index = r * cols + c, values 0/1 */
function stepLifeToroidal(curr: Uint8Array, next: Uint8Array, rows: number, cols: number) {
  const idx = (r: number, c: number) => r * cols + c

  for (let r = 0; r < rows; r++) {
    const rUp = (r - 1 + rows) % rows
    const rDn = (r + 1) % rows
    for (let c = 0; c < cols; c++) {
      const cLf = (c - 1 + cols) % cols
      const cRt = (c + 1) % cols

      const n =
        curr[idx(rUp, cLf)] +
        curr[idx(rUp, c)] +
        curr[idx(rUp, cRt)] +
        curr[idx(r, cLf)] +
        curr[idx(r, cRt)] +
        curr[idx(rDn, cLf)] +
        curr[idx(rDn, c)] +
        curr[idx(rDn, cRt)]

      const alive = curr[idx(r, c)] === 1
      next[idx(r, c)] = (alive ? (n === 2 || n === 3) : n === 3) ? 1 : 0
    }
  }
}

export function GameOfLife({
  width = 100,
  height = 60,
  cellSize = 8,
  seed = 29102006,
  aliveProb = 0.3,
  frameIntervalMs = 125,
  className,
}: GameOfLifeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Double buffer grids
  const currRef = useRef<Uint8Array | null>(null)
  const nextRef = useRef<Uint8Array | null>(null)

  // Track init params so we can reset when they change
  const initKeyRef = useRef<string>("")
  const lastStepRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const cols = width
    const rows = height
    const logicalW = cols * cellSize
    const logicalH = rows * cellSize

    const initKey = `${cols}x${rows}|cell=${cellSize}|seed=${seed}|p=${aliveProb}`
    if (initKeyRef.current !== initKey) {
      initKeyRef.current = initKey
      const rng = createSeededRandom(seed)
      const curr = new Uint8Array(rows * cols)
      const next = new Uint8Array(rows * cols)
      for (let i = 0; i < curr.length; i++) curr[i] = rng() < aliveProb ? 1 : 0
      currRef.current = curr
      nextRef.current = next
    }

    let animationId = 0

    let dpr = 1
    const resize = () => {
      const displayW = container.clientWidth
      const displayH = container.clientHeight
      if (displayW === 0 || displayH === 0) return

      dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
      canvas.width = Math.round(displayW * dpr)
      canvas.height = Math.round(displayH * dpr)
      canvas.style.width = `${displayW}px`
      canvas.style.height = `${displayH}px`

      // From now on, draw in CSS pixel coords (resize sets transform before first draw)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const curr = currRef.current
      if (!curr) return

      const displayW = container.clientWidth
      const displayH = container.clientHeight
      if (displayW === 0 || displayH === 0) return

      // Ensure canvas buffer matches container (e.g. after first layout)
      const wantW = Math.round(displayW * dpr)
      const wantH = Math.round(displayH * dpr)
      if (canvas.width !== wantW || canvas.height !== wantH) {
        resize()
      }

      // Use a single uniform scale (letterbox) so cells remain square
      const scale = Math.min(displayW / logicalW, displayH / logicalH)

      // Center the grid in the container (in CSS pixels)
      const offsetX = (displayW - logicalW * scale) / 2
      const offsetY = (displayH - logicalH * scale) / 2

      // Background: full canvas in CSS pixel space (transform is dpr from resize)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = THEME.background
      ctx.fillRect(0, 0, displayW, displayH)

      // Map logical grid coords -> CSS px with translate+scale
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Grid + cell inset thickness in *logical* coords such that it becomes 1 CSS px on screen.
      // (Because we scaled by `scale`, line thickness should be 1/scale in logical units.)
      const t = 1 / scale
      const inset = t // keep a 1px CSS gutter so grid stays visible

      // Grid lines using filled rects (avoids half-pixel stroke blur)
      ctx.fillStyle = THEME.grid
      // vertical lines
      for (let x = 0; x <= logicalW; x += cellSize) {
        ctx.fillRect(x - t / 2, 0, t, logicalH)
      }
      // horizontal lines
      for (let y = 0; y <= logicalH; y += cellSize) {
        ctx.fillRect(0, y - t / 2, logicalW, t)
      }

      // Alive cells (inset so lines remain visible)
      ctx.fillStyle = THEME.ink
      for (let r = 0; r < rows; r++) {
        const rowBase = r * cols
        const y = r * cellSize
        for (let c = 0; c < cols; c++) {
          if (curr[rowBase + c]) {
            const x = c * cellSize
            const w = Math.max(0, cellSize - 2 * inset)
            const h = Math.max(0, cellSize - 2 * inset)
            ctx.fillRect(x + inset, y + inset, w, h)
          }
        }
      }
    }

    function tick(now: number) {
      animationId = requestAnimationFrame(tick)

      if (now - lastStepRef.current >= frameIntervalMs) {
        lastStepRef.current = now
        const curr = currRef.current
        const next = nextRef.current
        if (curr && next) {
          stepLifeToroidal(curr, next, rows, cols)
          // swap buffers
          currRef.current = next
          nextRef.current = curr
        }
      }

      draw()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    lastStepRef.current = performance.now()
    animationId = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(animationId)
    }
  }, [width, height, cellSize, seed, aliveProb, frameIntervalMs])

  return (
    <div
      ref={containerRef}
      className={className}
      // Keep layout stable; letterboxing inside draw preserves square cells
      style={{ aspectRatio: `${width * cellSize}/${height * cellSize}` }}
      aria-label="Conway's Game of Life animation"
    >
      <canvas ref={canvasRef} className="block w-full h-full" aria-hidden />
    </div>
  )
}