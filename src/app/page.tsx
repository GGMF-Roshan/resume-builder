import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex flex-col">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(60,60,90,0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(40,50,80,0.25), transparent 60%)',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <span
          className="text-3xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Velora<sup className="text-xs">®</sup>
        </span>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-foreground">
            Home
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#formats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Formats
          </a>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
        </div>

        <Link
          href="/signup"
          className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform"
        >
          Begin Journey
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 flex-1">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl font-normal animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Your resume,{' '}
          <em className="not-italic text-muted-foreground">
            built the way it should be.
          </em>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          Modern resumes for the jobs you want, and traditional Indian bio-data
          for the ones that need it. Fill once, download a polished PDF in minutes.
        </p>

        <Link
          href="/signup"
          className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] transition-transform cursor-pointer animate-fade-rise-delay-2"
        >
          Begin Journey
        </Link>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Built by{' '}
          <a
            href="https://roshan-portfolio-omega.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            Roshan Sultane
          </a>
        </p>
      </footer>
    </div>
  )
}