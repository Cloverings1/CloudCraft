import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createPterodactylClient, createAdminPterodactylClient } from '@/lib/pterodactyl';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Use user's API key if available, otherwise use admin client
    let wsCredentials;
    if (session.user.pterodactylApiKey) {
      const client = createPterodactylClient(session.user.pterodactylApiKey);
      wsCredentials = await client.getWebSocketCredentials(id);
    } else {
      const adminClient = createAdminPterodactylClient();
      wsCredentials = await adminClient.getWebSocketCredentials(id);
    }

    // Log the raw URL for debugging
    console.log('WebSocket URL from Pterodactyl:', wsCredentials.data.socket);

    // The Wings websocket might use a hostname that's not accessible from browser
    // Transform it to use the known panel IP if needed
    let socketUrl = wsCredentials.data.socket;

    // If the URL uses localhost or internal hostname, replace with panel IP
    // This handles cases where Wings returns an inaccessible URL
    const panelUrl = process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081';
    const panelHost = new URL(panelUrl).hostname;

    // Replace any localhost references with the panel host
    socketUrl = socketUrl.replace(/localhost/g, panelHost);
    socketUrl = socketUrl.replace(/127\.0\.0\.1/g, panelHost);

    // Ensure correct WebSocket protocol based on current page protocol
    // For development (http), use ws://. For production (https), use wss://
    // Note: Wings typically runs on port 8080
    const isHttps = panelUrl.startsWith('https');
    if (!isHttps && socketUrl.startsWith('wss://')) {
      socketUrl = socketUrl.replace('wss://', 'ws://');
    } else if (isHttps && socketUrl.startsWith('ws://') && !socketUrl.startsWith('wss://')) {
      socketUrl = socketUrl.replace('ws://', 'wss://');
    }

    console.log('Transformed WebSocket URL:', socketUrl);

    return NextResponse.json({
      token: wsCredentials.data.token,
      url: socketUrl,
    });
  } catch (error) {
    console.error('WebSocket credentials error:', error);
    return NextResponse.json(
      { error: 'Failed to get WebSocket credentials' },
      { status: 500 }
    );
  }
}
