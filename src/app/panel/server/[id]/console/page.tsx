import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ConsoleTerminal } from '@/components/panel/ConsoleTerminal';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConsolePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id } = await params;

  const server = await db.server.findFirst({
    where: {
      pterodactylIdentifier: id,
      userId: session.user.id,
    },
  });

  if (!server) {
    redirect('/panel');
  }

  const panelUrl = process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081';

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-[24px] mb-1">Console</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">
            Live server console with real-time output
          </p>
        </div>
        <a
          href={`${panelUrl}/server/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--white-8)] rounded-lg hover:border-[var(--white-12)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Panel
        </a>
      </div>

      <ConsoleTerminal serverId={id} />
    </div>
  );
}
