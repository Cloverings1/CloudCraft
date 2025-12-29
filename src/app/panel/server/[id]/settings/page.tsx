import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SettingsPage({ params }: Props) {
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

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-display text-[24px] mb-1">Settings</h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Server configuration and settings
        </p>
      </div>

      {/* Server Info */}
      <div className="glass-card p-6">
        <h2 className="text-[16px] font-medium mb-4">Server Information</h2>
        <div className="grid gap-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--white-6)]">
            <span className="text-[14px] text-[var(--text-secondary)]">Server Name</span>
            <span className="text-[14px] text-[var(--text-primary)]">{server.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--white-6)]">
            <span className="text-[14px] text-[var(--text-secondary)]">Plan</span>
            <span className="text-[14px] text-[var(--text-primary)] capitalize">{server.planType}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--white-6)]">
            <span className="text-[14px] text-[var(--text-secondary)]">Server ID</span>
            <code className="text-[13px] text-[var(--accent)] bg-[var(--white-6)] px-2 py-1 rounded">{id}</code>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] text-[var(--text-secondary)]">Created</span>
            <span className="text-[14px] text-[var(--text-primary)]">
              {new Date(server.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="glass-card p-6">
        <h2 className="text-[16px] font-medium mb-4">Advanced Settings</h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-4">
          For advanced server settings like startup parameters, allocations, and more, use the Pterodactyl panel.
        </p>
        <a
          href={`${pterodactylUrl}/server/${id}/settings`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-2 text-[14px]"
        >
          Open Advanced Settings
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/20">
        <h2 className="text-[16px] font-medium text-red-400 mb-4">Danger Zone</h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-4">
          To delete your server or cancel your subscription, please contact support.
        </p>
        <a
          href="mailto:support@craftcloud.com"
          className="text-[14px] text-red-400 hover:text-red-300 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
