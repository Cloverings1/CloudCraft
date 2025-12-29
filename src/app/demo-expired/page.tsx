import Link from 'next/link';

export default function DemoExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="gradient-overlay" />

      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <div className="w-4 h-4 bg-white/90 rounded-sm" />
          </div>
          <span className="text-[20px] font-semibold tracking-tight">CloudCraft</span>
        </Link>

        <div className="glass-card-elevated p-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-heading mb-3">Demo Expired</h1>
          <p className="text-body text-[var(--text-secondary)] mb-8">
            Your 24-hour demo has ended, but your server data is safe.
            Upgrade to a paid plan to resume where you left off.
          </p>

          <div className="space-y-3">
            <Link href="/pricing" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              Choose a Plan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/"
              className="btn-secondary w-full py-3 flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-[12px] text-[var(--text-muted)] mt-8">
            Your world, plugins, and settings are preserved for 7 days.
            <br />
            Upgrade now to keep your progress.
          </p>
        </div>

        {/* Features reminder */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[18px] font-medium text-[var(--text-primary)]">$8.99</div>
            <div className="text-[11px] text-[var(--text-muted)]">Starter/mo</div>
          </div>
          <div>
            <div className="text-[18px] font-medium text-[var(--text-primary)]">$18.99</div>
            <div className="text-[11px] text-[var(--text-muted)]">Pro/mo</div>
          </div>
          <div>
            <div className="text-[18px] font-medium text-[var(--text-primary)]">$34.99</div>
            <div className="text-[11px] text-[var(--text-muted)]">Elite/mo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
