"use client"

import { TextScramble } from "@/components/text-scramble"

export default function WritingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-8 sm:px-8 sm:pt-16 flex-grow flex items-center">
        <div className="w-full font-serif text-lg text-[#2d2d2d]">
          <p className="mb-5">
            <TextScramble text="Writing coming soon." />
          </p>
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


