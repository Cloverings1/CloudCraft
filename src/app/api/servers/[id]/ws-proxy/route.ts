import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createPterodactylClient, createAdminPterodactylClient } from '@/lib/pterodactyl';

// This endpoint provides WebSocket credentials with instructions for direct connection
// For browsers that can't connect due to CORS, we fall back to polling
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;

    // Verify user owns this server
    const server = await db.server.findFirst({
      where: {
        pterodactylIdentifier: id,
        userId: session.user.id,
      },
    });

    if (!server) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get WebSocket credentials
    let wsCredentials;
    if (session.user.pterodactylApiKey) {
      const client = createPterodactylClient(session.user.pterodactylApiKey);
      wsCredentials = await client.getWebSocketCredentials(id);
    } else {
      const adminClient = createAdminPterodactylClient();
      wsCredentials = await adminClient.getWebSocketCredentials(id);
    }

    // Return credentials - the client will try direct connection
    // If that fails due to CORS, it should use the panel directly
    return new Response(JSON.stringify({
      token: wsCredentials.data.token,
      url: wsCredentials.data.socket,
      panelOrigin: process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081',
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('WS proxy error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get credentials' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
