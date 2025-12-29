import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

const PANEL_URL = process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081';
const CLIENT_KEY = process.env.PTERODACTYL_CLIENT_KEY;

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

    // Fetch logs from Pterodactyl using the files API (reading server.log or latest.log)
    // First try to get the console output via the activity log or server files
    const apiKey = session.user.pterodactylApiKey || CLIENT_KEY;

    // Try to read the latest.log file from the server
    const response = await fetch(
      `${PANEL_URL}/api/client/servers/${id}/files/contents?file=%2Flogs%2Flatest.log`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const logContent = await response.text();
      // Get last 100 lines
      const lines = logContent.split('\n').slice(-100);
      return NextResponse.json({ logs: lines });
    }

    // If that fails, return empty logs
    return NextResponse.json({ logs: [] });
  } catch (error) {
    console.error('Logs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
