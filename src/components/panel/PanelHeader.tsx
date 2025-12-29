'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PanelHeaderProps {
  userName: string;
  serverId?: string | null;
}

export function PanelHeader({ userName, serverId }: PanelHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--white-6)]" style={{ background: 'rgba(11, 11, 11, 0.9)', backdropFilter: 'blur(20px)' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={serverId ? `/panel/server/${serverId}` : '/panel'} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <div className="w-3 h-3 bg-white/90 rounded-sm" />
          </div>
          <span className="text-[17px] font-semibold tracking-tight">CloudCraft</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[var(--text-secondary)]">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
