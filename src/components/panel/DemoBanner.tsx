'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DemoBannerProps {
  expiresAt: string;
}

export function DemoBanner({ expiresAt }: DemoBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const expires = new Date(expiresAt);
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="glass-card p-4 bg-amber-500/5 border-amber-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] text-amber-200 font-medium">
              Demo Server
            </p>
            <p className="text-[12px] text-amber-200/70">
              Expires in {timeRemaining}
            </p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="btn-primary text-[13px] py-2 px-4 bg-amber-500 hover:bg-amber-400 border-amber-400"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}
