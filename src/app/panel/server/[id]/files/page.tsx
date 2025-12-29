import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FilesPage({ params }: Props) {
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

  const pterodactylUrl = process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081';
  const fileManagerUrl = `${pterodactylUrl}/server/${id}/files`;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-display text-[24px] mb-1">File Manager</h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Manage your server files
        </p>
      </div>

      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--white-6)] border border-[var(--white-8)] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>

        <h2 className="text-heading mb-2">Open File Manager</h2>
        <p className="text-body text-[var(--text-secondary)] max-w-md mx-auto mb-6">
          The file manager opens in the Pterodactyl panel. You can browse, edit, upload, and manage all your server files there.
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href={fileManagerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Open File Manager
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <Link
            href={`/panel/server/${id}`}
            className="btn-secondary"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
