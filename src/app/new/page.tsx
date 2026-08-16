'use client'

import Link from 'next/link'

export default function NewResumePage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2">Choose a Format</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Pick the style that fits what you're applying for.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/editor/new?format=modern"
          className="border border-white/20 rounded-lg p-5 hover:border-white/40 transition-colors block"
        >
          <h2 className="font-semibold mb-1">Modern Resume</h2>
          <p className="text-sm text-muted-foreground">
            Clean, ATS-friendly format for corporate and tech jobs.
          </p>
        </Link>

        <Link
          href="/editor/new?format=biodata"
          className="border border-white/20 rounded-lg p-5 hover:border-white/40 transition-colors block"
        >
          <h2 className="font-semibold mb-1">Indian Bio-data</h2>
          <p className="text-sm text-muted-foreground">
            Traditional format with personal details for govt jobs and formal applications.
          </p>
        </Link>
      </div>
    </div>
  )
}