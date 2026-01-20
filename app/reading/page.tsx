"use client"

import { TextScramble } from "@/components/text-scramble"

export default function ReadingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-8 sm:px-8 sm:pt-16 flex-grow flex items-center">
        <div className="w-full font-serif text-lg text-[#2d2d2d] space-y-8">
          <section>
            <p className="mb-3">A collection of reads I find interesting / have inspired me in some way.</p>
          </section>

          <section className="space-y-6 text-base">
            {/* Nagel – What Is It Like to Be a Bat? */}
            <article className="space-y-1">
              <div className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[philosophy of mind]" />
              </div>
              <a
                href="/reads/Nagel - What its like to be a Bat.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lg hover:text-[#b45309] transition-colors"
              >
                Thomas Nagel – <span className="italic">What Is It Like to Be a Bat?</span>
              </a>
            </article>

            {/* LEANN – Low-Storage Vector Index */}
            <article className="space-y-1">
              <div className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[systems / retrieval]" />
              </div>
              <a
                href="/reads/LEANN.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lg hover:text-[#b45309] transition-colors"
              >
                <span className="italic">LEANN: A Low-Storage Vector Index</span>
              </a>
            </article>

            {/* AI-Newton – Concept-Driven Physical Law Discovery */}
            <article className="space-y-1">
              <div className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[scientific discovery / ml]" />
              </div>
              <a
                href="/reads/AI Newton.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lg hover:text-[#b45309] transition-colors"
              >
                <span className="italic">
                  AI-Newton: A Concept-Driven Physical Law Discovery System without Prior Physical Knowledge
                </span>
              </a>
            </article>
          </section>
        </div>
      </div>

      <footer className="w-full border-t border-[#2d2d2d]/10 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-[#78716c] text-sm">
          <TextScramble text="© 2025 Pranshu Rao" />
        </div>
      </footer>
    </main>
  )
}


