import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createPterodactylClient, createAdminPterodactylClient } from '@/lib/pterodactyl';

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
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required' },
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
      await client.sendCommand(id, command);
    } else {
      const adminClient = createAdminPterodactylClient();
      await adminClient.sendCommand(id, command);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Command error:', error);
    return NextResponse.json(
      { error: 'Failed to send command' },
      { status: 500 }
    );
  }
}
