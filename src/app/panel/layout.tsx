import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PanelSidebar } from '@/components/panel/PanelSidebar';
import { PanelHeader } from '@/components/panel/PanelHeader';

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const server = await db.server.findFirst({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="gradient-overlay" />

      {/* Header */}
      <PanelHeader
        userName={session.user.name || session.user.email}
        serverId={server?.pterodactylIdentifier}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <PanelSidebar serverId={server?.pterodactylIdentifier} />

        {/* Main content */}
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
