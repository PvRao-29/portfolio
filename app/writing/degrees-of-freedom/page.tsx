"use client"

import { TextScramble } from "@/components/text-scramble"
import { GameOfLife } from "@/components/game-of-life"

export default function DegreesOfFreedomPage() {
  return (
    <main className="flex flex-1 w-full flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto px-4 pt-6 pb-4 sm:px-8 sm:pt-8 flex-grow">
        <div className="w-full font-serif text-lg text-[#2d2d2d] space-y-8">
          <nav className="mb-6">
            <a
              href="/writing"
              className="text-sm font-pixel text-[#78716c] hover:text-[#b45309] transition-colors"
            >
              ← Writing
            </a>
          </nav>

          <article className="space-y-6">
            <header className="space-y-1">
              <p className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[Feb 25, 2026]" />
              </p>
              <h1 className="text-2xl font-serif text-[#2d2d2d]">
                Degrees of Freedom
              </h1>
            </header>

            <div className="space-y-4 text-base leading-relaxed">
              <figure className="my-8 flex justify-center">
                <GameOfLife
                  width={120}
                  height={72}
                  cellSize={10}
                  seed={29}
                  aliveProb={0.3}
                  frameIntervalMs={125}
                  className="w-[1200px] max-w-full rounded border border-[#d4cfc4]"
                />
              </figure>
            </div>
          </article>
        </div>
      </div>

      <footer className="w-full border-t border-[#2d2d2d]/10 py-3 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-[#78716c] text-sm">
          <TextScramble text="© 2026 Pranshu Rao" />
        </div>
      </footer>
    </main>
  )
}
