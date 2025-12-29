import Link from "next/link";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const plans = [
  {
    name: "Starter",
    description: "Perfect for small communities",
    price: "8.99",
    priceId: "price_1SjR2UI8BOT4K7trfks34L41",
    popular: false,
    specs: {
      ram: "2 GB",
      cpu: "1 Core",
      storage: "10 GB",
      players: "12"
    },
    features: [
      "Instant deployment",
      "DDoS Protection",
      "1 MySQL database",
      "3 Automatic backups",
      "Modpack support",
      "24/7 Uptime",
      "Discord support"
    ]
  },
  {
    name: "Pro",
    description: "For growing communities",
    price: "18.99",
    priceId: "price_1SjR2UI8BOT4K7trcBCbWd5S",
    popular: true,
    specs: {
      ram: "6 GB",
      cpu: "3 Cores",
      storage: "35 GB",
      players: "50"
    },
    features: [
      "Everything in Starter",
      "Priority DDoS Protection",
      "2 MySQL databases",
      "7 Automatic backups",
      "Custom JAR support",
      "Subdomain included",
      "Priority email support",
      "Console access"
    ]
  },
  {
    name: "Elite",
    description: "Maximum performance",
    price: "34.99",
    priceId: "price_1SjR2VI8BOT4K7trmDMDYRtb",
    popular: false,
    specs: {
      ram: "12 GB",
      cpu: "4 Cores",
      storage: "60 GB",
      players: "100"
    },
    features: [
      "Everything in Pro",
      "Enterprise DDoS",
      "4 MySQL databases",
      "14 Automatic backups",
      "Dedicated IP",
      "Custom domain",
      "Phone support",
      "API access"
    ]
  }
];

const faqs = [
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes. Change your plan anytime. Upgrades take effect immediately, downgrades apply at billing cycle end."
  },
  {
    question: "What payment methods do you accept?",
    answer: "All major credit cards and PayPal. Payments are securely processed through Stripe."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "7-day free trial on all plans. Full refund within 30 days if not satisfied."
  },
  {
    question: "How quickly is my server deployed?",
    answer: "Your server is provisioned within 60 seconds of payment. Credentials sent via email immediately."
  },
  {
    question: "Can I install custom modpacks?",
    answer: "Yes. One-click installer for popular modpacks. Pro and Elite plans support custom JAR files."
  },
  {
    question: "What kind of support do you offer?",
    answer: "Starter: Discord support. Pro: Priority email. Elite: Dedicated phone support."
  }
];

export default function PricingPage() {
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
            <Link href="/#features" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Features</Link>
            <Link href="/pricing" className="text-[14px] text-[var(--text-primary)]">Pricing</Link>
            <Link href="#" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="hidden sm:block text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">
              Sign In
            </Link>
            <Link href="#plans" className="btn-primary text-[14px] py-2.5 px-5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--white-6)] border border-[var(--white-8)] mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            <span className="text-label text-[var(--text-secondary)]">7-day free trial</span>
          </div>

          <h1 className="text-display text-[clamp(28px,5vw,40px)] mb-5 animate-fade-up delay-1">
            Simple, Transparent Pricing
          </h1>

          <p className="text-body text-[var(--text-secondary)] max-w-lg mx-auto animate-fade-up delay-2">
            No hidden fees. No complexity. Powerful hosting at prices that make sense.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="plans" className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative glass-card p-7 flex flex-col ${
                  plan.popular ? "border-[var(--accent)]/40" : ""
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--accent)] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-5">
                  <h3 className="text-[18px] font-semibold mb-1 text-[var(--text-primary)]">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[36px] font-semibold tracking-tight text-[var(--text-primary)]">
                      ${plan.price}
                    </span>
                    <span className="text-[13px] text-[var(--text-muted)]">/mo</span>
                  </div>
                </div>

                {/* Specs grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-[var(--white-45)] border border-[var(--white-6)]">
                  <div className="text-center">
                    <div className="text-[15px] font-medium text-[var(--text-primary)]">{plan.specs.ram}</div>
                    <div className="text-label text-[var(--text-muted)]">RAM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[15px] font-medium text-[var(--text-primary)]">{plan.specs.cpu}</div>
                    <div className="text-label text-[var(--text-muted)]">CPU</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[15px] font-medium text-[var(--text-primary)]">{plan.specs.storage}</div>
                    <div className="text-label text-[var(--text-muted)]">Storage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[15px] font-medium text-[var(--text-primary)]">{plan.specs.players}</div>
                    <div className="text-label text-[var(--text-muted)]">Players</div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/checkout?plan=${plan.name.toLowerCase()}`}
                  className={`w-full py-3 px-6 rounded-full font-semibold text-[14px] text-center transition-all duration-200 mb-6 ${
                    plan.popular
                      ? "btn-primary"
                      : "bg-[var(--white-6)] border border-[var(--white-10)] hover:bg-[var(--white-8)] hover:border-[var(--white-12)] text-[var(--text-primary)]"
                  }`}
                >
                  Start Free Trial
                </Link>

                {/* Features list */}
                <div className="flex-grow">
                  <p className="text-label text-[var(--text-muted)] mb-4">
                    Includes:
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise note */}
      <section className="py-10 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-7">
            <h3 className="text-[17px] font-medium mb-2 text-[var(--text-primary)]">
              Need more resources?
            </h3>
            <p className="text-[14px] text-[var(--text-secondary)] mb-4">
              Custom solutions for large-scale deployments and enterprise requirements.
            </p>
            <Link href="#" className="text-[14px] text-[var(--accent)] font-medium hover:opacity-80 transition-opacity">
              Contact Sales &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-label text-[var(--accent)] mb-4 block">
              FAQ
            </span>
            <h2 className="text-display text-[28px] mb-3">
              Common Questions
            </h2>
            <p className="text-body text-[var(--text-secondary)]">
              Everything you need to know about our plans
            </p>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-[15px] font-medium mb-2 text-[var(--text-primary)]">
                  {faq.question}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-display text-[26px] mb-4">
            Ready to get started?
          </h2>
          <p className="text-body text-[var(--text-secondary)] mb-8">
            Join thousands of server owners. Start your free trial today.
          </p>
          <Link href="#plans" className="btn-primary inline-flex items-center gap-2">
            Choose Your Plan
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[var(--white-6)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
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

            <div>
              <h4 className="text-label text-[var(--text-muted)] mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</Link></li>
                <li><Link href="/#features" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</Link></li>
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
