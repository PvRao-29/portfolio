"use client"

import { TextScramble } from "@/components/text-scramble"

export default function WritingPage() {
  return (
    <main className="flex flex-1 w-full flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto px-4 pt-6 pb-4 sm:px-8 sm:pt-8 flex-grow flex items-center">
        <div className="w-full font-serif text-lg text-[#2d2d2d] space-y-8">
          <section>
            <p className="mb-3">Just some thoughts.</p>
          </section>

          <section className="space-y-6 text-base">
            <article>
              <a
                href="/writing/degrees-of-freedom"
                className="inline-flex items-baseline gap-2 text-lg hover:text-[#b45309] transition-colors"
              >
                <span className="text-sm font-pixel text-[#78716c]">
                  <TextScramble text="[Feb 25, 2026]" />
                </span>
                Degrees of Freedom
              </a>
            </article>
          </section>
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


