import Link from "next/link";

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function MarketingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-[var(--white-6)] bg-[rgba(6,10,24,0.55)] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
            <span className="text-[13px] text-[var(--text-secondary)] truncate">
              New: free 24-hour demo servers are live.
            </span>
          </div>
          <Link
            href="/try-demo"
            className="text-[13px] text-[var(--text-primary)] hover:opacity-90 transition-opacity whitespace-nowrap inline-flex items-center gap-1"
          >
            Try Demo
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <nav className="border-b border-[var(--white-6)] bg-[rgba(11,11,11,0.55)] backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[0_10px_30px_rgba(34,211,238,0.18)]">
              <div className="w-3 h-3 bg-black/80 rounded-sm" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              CloudCraft
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/pricing"
              className="flex items-center gap-1 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Minecraft Hosting
              <ChevronDownIcon />
            </Link>
            <Link
              href="/#features"
              className="flex items-center gap-1 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Support
              <ChevronDownIcon />
            </Link>
            <Link
              href="/pricing"
              className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/panel"
              className="hidden sm:block text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/pricing" className="btn-primary text-[14px] py-2.5 px-5">
              Order Now
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}


