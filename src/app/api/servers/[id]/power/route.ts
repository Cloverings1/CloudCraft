import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createPterodactylClient, createAdminPterodactylClient, type PowerAction } from '@/lib/pterodactyl';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!['start', 'stop', 'restart', 'kill'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid power signal' },
        { status: 400 }
      );
    }

    // Verify user owns this server
    const server = await db.server.findFirst({
      where: {
        pterodactylIdentifier: id,
        userId: session.user.id,
      },
    });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Use user's API key if available, otherwise use admin client
    if (session.user.pterodactylApiKey) {
      const client = createPterodactylClient(session.user.pterodactylApiKey);
      await client.sendPowerAction(id, action as PowerAction);
    } else {
      const adminClient = createAdminPterodactylClient();
      await adminClient.sendPowerAction(id, action as PowerAction);
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error('Power action error:', error);
    return NextResponse.json(
      { error: 'Failed to send power signal' },
      { status: 500 }
    );
  }
}
