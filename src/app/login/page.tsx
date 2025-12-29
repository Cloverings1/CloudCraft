'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Redirect to panel
      if (data.serverId) {
        router.push(`/panel/server/${data.serverId}`);
      } else {
        router.push('/panel');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="gradient-overlay" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <div className="w-4 h-4 bg-white/90 rounded-sm" />
          </div>
          <span className="text-[20px] font-semibold tracking-tight">CloudCraft</span>
        </Link>

        <div className="glass-card-elevated p-8">
          <div className="text-center mb-8">
            <h1 className="text-heading mb-2">Welcome back</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">
              Sign in to manage your server
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
                {error}
              </div>
            )}

            <div>
              <label className="text-label text-[var(--text-muted)] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl bg-[var(--white-6)] border border-[var(--white-8)] text-[var(--text-primary)] text-[15px] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-label text-[var(--text-muted)] block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl bg-[var(--white-6)] border border-[var(--white-8)] text-[var(--text-primary)] text-[15px] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Don&apos;t have an account? Get Started
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-[12px] text-[var(--text-muted)]">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
