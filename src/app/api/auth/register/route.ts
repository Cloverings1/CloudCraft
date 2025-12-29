import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { createPterodactylUser, createPterodactylServer, setupAndStartServer } from '@/lib/pterodactyl';

// Demo server specs (maxed out for single demo on 4-core/8GB node)
const DEMO_SPECS = {
  memory: 6144,   // 6GB RAM
  cpu: 300,       // 3 vCPUs (Pterodactyl percentage)
  disk: 20480,    // 20GB disk
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, isDemo } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if email already exists (abuse prevention for demos)
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Generate unique username for Pterodactyl
    const baseUsername = normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const username = `${baseUsername}${Date.now().toString().slice(-4)}`;

    // 5. Create Pterodactyl user
    let pteroUser;
    try {
      pteroUser = await createPterodactylUser(normalizedEmail, username, password);
    } catch (err) {
      console.error('Failed to create Pterodactyl user:', err);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Create database user
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: username,
        pterodactylUserId: pteroUser.attributes.id,
        pterodactylApiKey: null, // Will be set later if needed
      },
    });

    // 7. If demo requested, create demo server
    let server = null;
    if (isDemo) {
      try {
        const demoExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const pteroServer = await createPterodactylServer({
          name: `${username}-demo`,
          userId: pteroUser.attributes.id,
          memory: DEMO_SPECS.memory,
          cpu: DEMO_SPECS.cpu,
          disk: DEMO_SPECS.disk,
        });

        server = await db.server.create({
          data: {
            pterodactylServerId: pteroServer.attributes.id.toString(),
            pterodactylIdentifier: pteroServer.attributes.identifier,
            name: `${username}'s Demo Server`,
            planType: 'demo',
            isDemo: true,
            demoExpiresAt,
            userId: user.id,
          },
        });

        // Fire-and-forget: Setup EULA and start server in background
        // User is redirected immediately while this runs async
        setupAndStartServer(pteroServer.attributes.identifier).catch(err => {
          console.error('Background server setup failed:', err);
        });
      } catch (err) {
        console.error('Failed to create demo server:', err);
        // User was created but server failed - still allow login
        // They can try again from the panel
      }
    }

    // 8. Create session and log user in
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      serverId: server?.pterodactylIdentifier || null,
      demoExpiresAt: server?.demoExpiresAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
