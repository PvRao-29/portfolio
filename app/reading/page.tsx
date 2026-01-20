"use client"

import { TextScramble } from "@/components/text-scramble"

export default function ReadingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-8 sm:px-8 sm:pt-16 flex-grow flex items-center">
        <div className="w-full font-serif text-lg text-[#2d2d2d] space-y-8">
          <section>
            <p className="mb-3">A loose log of things I&apos;m reading or re-reading.</p>
            <p className="text-[#78716c] text-base">
              Not a ranked list—just papers and essays that are interesting enough to keep around.
            </p>
          </section>

          <section className="space-y-6 text-base">
            {/* Nagel – What Is It Like to Be a Bat? */}
            <article className="space-y-1">
              <div className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[philosophy of mind]" />
              </div>
              <h2 className="text-lg">
                Thomas Nagel –{" "}
                <span className="italic">What Is It Like to Be a Bat?</span>
              </h2>
              <p className="text-[#78716c]">
                The Philosophical Review, 83(4), 1974. A classic argument that any physical theory of mind has to make
                sense of the subjective character of experience—what it is like <em>for</em> a creature to be itself.{" "}
              </p>
            </article>

            {/* LEANN – Low-Storage Vector Index */}
            <article className="space-y-1">
              <div className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[systems / retrieval]" />
              </div>
              <h2 className="text-lg">
                <span className="italic">LEANN: A Low-Storage Vector Index</span>
              </h2>
              <p className="text-[#78716c]">
                An embedding index focused on keeping memory footprint small while preserving retrieval quality—useful
                for making large-scale vector search actually deployable on real hardware.
              </p>
            </article>

            {/* AI-Newton – Concept-Driven Physical Law Discovery */}
            <article className="space-y-1">
              <div className="text-sm font-pixel text-[#78716c]">
                <TextScramble text="[scientific discovery / ml]" />
              </div>
              <h2 className="text-lg">
                <span className="italic">
                  AI-Newton: A Concept-Driven Physical Law Discovery System without Prior Physical Knowledge
                </span>
              </h2>
              <p className="text-[#78716c]">
                A system that tries to recover human-interpretable physical laws directly from data, without hard-coding
                the right equations in advance—a nice example of ML aimed at scientific understanding, not just
                prediction.
              </p>
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


