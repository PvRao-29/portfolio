"use client"

import Link from "next/link"
import { TextScramble } from "@/components/text-scramble"

export default function Projects() {
  const projects = [
    {
      title: "Scholarhive",
      description:
        "A platform for scholarships that received interest in acquisition from ScholarshipOwl and was invited to interview at Y Combinator W25.",
      link: "https://www.scholarhive.app",
    },
    {
      title: "Course Scheduling & Extracurricular RAG Recommender",
      description:
        "1st place overall at HackRice 14. A personalized course scheduling and extracurricular RAG recommender system.",
      link: "#",
    },
  ]

  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center justify-start p-8 pt-16 text-sm sm:p-16 sm:pt-16">
      <div className="h-full w-full max-w-md space-y-10 sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <div className="flex w-full flex-wrap gap-x-1">
          <Link href="/" className="transition-all duration-150">
            <TextScramble text="[home]" />
          </Link>
          <p className="inline sm:invisible sm:block sm:pr-0">•</p>
          <Link href="/projects" className="transition-all duration-150">
            <TextScramble text="[projects]" />
          </Link>
        </div>

        <div className="flex h-full w-full flex-col items-start space-y-5">
          <h1 className="text-2xl">
            <TextScramble text="Projects" />
          </h1>

          <div className="h-full w-full items-start space-y-8 font-serif text-lg">
            {projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-xl font-medium">
                  <Link href={project.link} className="transition-all duration-150">
                    {project.title}
                  </Link>
                </h2>
                <p>{project.description}</p>
              </div>
            ))}
          </div>

          <div className="flex h-full w-full flex-wrap items-end justify-end space-x-1 space-y-10 text-sm">
            <Link className="transition-all duration-150" href="/">
              <TextScramble text="[back to home]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

