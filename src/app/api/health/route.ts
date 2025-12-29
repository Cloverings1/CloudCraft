import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const checks: Record<string, string> = {};

  // Check environment variables
  checks.DATABASE_URL = process.env.DATABASE_URL ? 'set' : 'missing';
  checks.PTERODACTYL_URL = process.env.PTERODACTYL_URL || 'not set';
  checks.PTERODACTYL_ADMIN_KEY = process.env.PTERODACTYL_ADMIN_KEY ? 'set' : 'missing';

  // Test database connection
  try {
    const userCount = await db.user.count();
    checks.database = `connected (${userCount} users)`;
  } catch (err) {
    checks.database = `error: ${err instanceof Error ? err.message : 'unknown'}`;
  }

  // Test Pterodactyl connection
  try {
    const pteroUrl = process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081';
    const response = await fetch(`${pteroUrl}/api/application/users`, {
      headers: {
        'Authorization': `Bearer ${process.env.PTERODACTYL_ADMIN_KEY}`,
        'Accept': 'application/json',
      },
    });
    checks.pterodactyl = response.ok ? 'connected' : `error: ${response.status}`;
  } catch (err) {
    checks.pterodactyl = `error: ${err instanceof Error ? err.message : 'unknown'}`;
  }

  return NextResponse.json(checks);
}
