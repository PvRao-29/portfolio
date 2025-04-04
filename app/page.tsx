"use client"

import Link from "next/link"
import { TextScramble } from "@/components/text-scramble"

export default function Home() {
  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center justify-start p-8 pt-16 text-sm sm:p-16 sm:pt-16">
      <div className="sm:space-y-15 h-full w-full max-w-md space-y-10 transition-all duration-[2000ms] sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <div className="flex w-full flex-wrap gap-x-1">
          <Link href="/" className="transition-all duration-150">
            <TextScramble text="[pranshurao.com]" />
          </Link>
        </div>

        <div className="flex h-full w-full flex-col items-start space-y-5">
          <h1 className="text-2xl">
            <TextScramble text="Pranshu Rao" />
          </h1>

          <h3 className="text-gray-600">
            <TextScramble text="Currently in: Berkeley, CA" />
          </h3>

          <div className="h-full w-full items-start space-y-4 font-serif text-lg">
            <p>Hi, I'm Pranshu.</p>
            <p>
              I'm a first-year EECS major at UC Berkeley, minoring in Philosophy, originally from Winnetka, IL.
              I am interested in the use of mathematical modeling and machine learning in real world predictive
              systems.
            </p>
            <p>
              Currently, I work on red teaming LLMs @ Scale AI, specializing in probing a model's mathematical reasoning
              and researching jailbreaking strategies.
            </p>
            <p>
              In addition to pushing the limits of machine cognition, I also work on sending mankind to space as an engineer
              at Space Enterprise at Berkeley, where I simulate the effects of fin flutter on rocket stability.
            </p>
            <p>
              In my spare time, you'll find me at the felt, punting with a VPIP of 70%. Surprisingly, I am a profitable player.
            </p>
            <p>
              I thrive on creative problem-solving—whether it's modeling my expected value in Blackjack with advanced card
              counting strategies or fine-tuning a rocket's trajectory to cut through hypersonic winds.
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

