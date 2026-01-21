import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { TextScramble } from "@/components/text-scramble"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pranshu Rao",
  description: "The Personal website of Pranshu Rao.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png" />
        <link rel="manifest" href="favicon/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-4 flex items-center gap-6 text-sm text-[#78716c]">
            <Link
              href="/"
              className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
            >
              <TextScramble text="[Pranshu Rao]" />
            </Link>
            <Link
              href="/reading"
              className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
            >
              <TextScramble text="[Reading]" />
            </Link>
            <Link
              href="/writing"
              className="transition-all duration-150 text-[#78716c] hover:text-[#b45309]"
            >
              <TextScramble text="[Writing]" />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex flex-col">{children}</div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

