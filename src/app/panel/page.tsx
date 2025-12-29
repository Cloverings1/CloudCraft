import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function PanelPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const server = await db.server.findFirst({
    where: { userId: session.user.id },
  });

  if (server) {
    redirect(`/panel/server/${server.pterodactylIdentifier}`);
  }

  // No server - show empty state
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--white-6)] border border-[var(--white-8)] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3" />
          </svg>
        </div>
        <h2 className="text-heading mb-2">No Server Found</h2>
        <p className="text-body text-[var(--text-secondary)] mb-6">
          You don&apos;t have a server yet. Get started with a plan.
        </p>
        <a href="/pricing" className="btn-primary">
          View Plans
        </a>
      </div>
    </div>
  );
}
