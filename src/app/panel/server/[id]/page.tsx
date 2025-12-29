import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ServerOverview } from '@/components/panel/ServerOverview';
import { suspendPterodactylServer } from '@/lib/pterodactyl';
import { DemoBanner } from '@/components/panel/DemoBanner';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ServerPage({ params }: Props) {
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

  // Check if demo has expired
  if (server.isDemo && server.demoExpiresAt && new Date() > server.demoExpiresAt) {
    // Suspend the server in Pterodactyl
    try {
      await suspendPterodactylServer(server.pterodactylServerId);
    } catch (err) {
      console.error('Failed to suspend expired demo server:', err);
    }
    redirect('/demo-expired');
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-display text-[24px] mb-1">{server.name}</h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Server Overview
        </p>
      </div>

      {/* Demo expiration banner */}
      {server.isDemo && server.demoExpiresAt && (
        <DemoBanner expiresAt={server.demoExpiresAt.toISOString()} />
      )}

      <ServerOverview serverId={id} />
    </div>
  );
}
