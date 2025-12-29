import Link from "next/link";

// Icons with thinner strokes for minimal aesthetic
const ShieldIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ServerIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
  </svg>
);

const CubeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const features = [
  {
    icon: <ShieldIcon />,
    title: "Enterprise DDoS Protection",
    description: "Multi-layer protection shields your server from sophisticated attacks."
  },
  {
    icon: <BoltIcon />,
    title: "Instant Deployment",
    description: "Your server spins up in under 60 seconds. No waiting, no complexity."
  },
  {
    icon: <ServerIcon />,
    title: "99.9% Uptime SLA",
    description: "Redundant infrastructure ensures your world is always accessible."
  },
  {
    icon: <CubeIcon />,
    title: "One-Click Modpacks",
    description: "Install Forge, Fabric, Paper, or 500+ modpacks instantly."
  },
  {
    icon: <ClockIcon />,
    title: "24/7 Expert Support",
    description: "Real humans who understand Minecraft. Always available."
  },
  {
    icon: <ChartIcon />,
    title: "Real-Time Analytics",
    description: "Monitor player activity and performance through our dashboard."
  }
];

const stats = [
  { value: "NVMe", label: "SSD Storage" },
  { value: "DDR5", label: "ECC Memory" },
  { value: "<50ms", label: "Latency" },
  { value: "10Gbps", label: "Network" }
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Subtle gradient overlay */}
      <div className="gradient-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--white-6)]" style={{ background: 'rgba(11, 11, 11, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <div className="w-3 h-3 bg-white/90 rounded-sm" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">
              CloudCraft
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Features</Link>
            <Link href="/pricing" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Pricing</Link>
            <Link href="#" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">
              Sign In
            </Link>
            <Link href="/try-demo" className="btn-primary text-[14px] py-2.5 px-5">
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--white-6)] border border-[var(--white-8)] mb-10 animate-fade-up">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            <span className="text-label text-[var(--text-secondary)]">Now with global edge locations</span>
          </div>

          {/* Main headline */}
          <h1 className="text-display text-[clamp(32px,6vw,48px)] mb-6 animate-fade-up delay-1">
            Premium Minecraft Hosting.
            <br />
            <span className="text-[var(--text-secondary)]">Zero Complexity.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body text-[var(--text-secondary)] max-w-xl mx-auto mb-10 animate-fade-up delay-2">
            Instant deployment, enterprise protection,
            global infrastructure. Launch your server in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up delay-3">
            <Link href="/try-demo" className="btn-primary flex items-center gap-2">
              Try Demo Server
              <ArrowIcon />
            </Link>
            <Link href="/pricing" className="btn-secondary flex items-center gap-2">
              View Pricing
              <span className="text-[10px] bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">Free Trial</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto animate-fade-up delay-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-heading text-[var(--text-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-label text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure bar */}
      <section className="py-12 px-6 border-y border-[var(--white-6)]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-label text-[var(--text-muted)] mb-8">
            Enterprise-grade infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {[
              { icon: "🖥️", text: "Dedicated Hardware" },
              { icon: "⚡", text: "AMD EPYC CPUs" },
              { icon: "🛡️", text: "DDoS Protected" },
              { icon: "🔒", text: "Full Root Access" }
            ].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-[14px] text-[var(--text-muted)]"
              >
                <span>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-label text-[var(--accent)] mb-4 block">
              Features
            </span>
            <h2 className="text-display text-[28px] mb-4">
              Everything You Need
            </h2>
            <p className="text-body text-[var(--text-secondary)] max-w-lg mx-auto">
              We handle the infrastructure so you can focus on building your community.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card p-7 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--white-6)] border border-[var(--white-8)] flex items-center justify-center mb-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-[16px] font-medium mb-2 text-[var(--text-primary)]">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card-elevated p-12 sm:p-16 text-center">
            <h2 className="text-display text-[28px] mb-4">
              Ready to Launch?
            </h2>
            <p className="text-body text-[var(--text-secondary)] mb-10 max-w-md mx-auto">
              Get your Minecraft server running in under 60 seconds.
              No credit card required to start.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {["24-hour free demo", "No credit card", "Instant setup"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  {item}
                </div>
              ))}
            </div>

            <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
              Get Started Free
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[var(--white-6)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white/90 rounded-sm" />
                </div>
                <span className="text-[15px] font-semibold">CloudCraft</span>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                Premium Minecraft server hosting for communities that demand excellence.
              </p>
            </div>

            {/* Links columns */}
            <div>
              <h4 className="text-label text-[var(--text-muted)] mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</Link></li>
                <li><Link href="#features" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</Link></li>
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-label text-[var(--text-muted)] mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">About</Link></li>
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-label text-[var(--text-muted)] mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Terms</Link></li>
                <li><Link href="#" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">SLA</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--white-6)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} CloudCraft. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* Social icons */}
              <Link href="#" className="btn-ghost w-9 h-9 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="btn-ghost w-9 h-9 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="btn-ghost w-9 h-9 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
