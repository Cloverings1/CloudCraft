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
    const useAdminClient = !session.user.pterodactylApiKey;

    let serverDetails;
    let resources;

    try {
      if (useAdminClient) {
        const adminClient = createAdminPterodactylClient();
        [serverDetails, resources] = await Promise.all([
          adminClient.getServerDetails(id),
          adminClient.getServerResources(id),
        ]);
      } else {
        const client = createPterodactylClient(session.user.pterodactylApiKey!);
        [serverDetails, resources] = await Promise.all([
          client.getServer(id),
          client.getResources(id),
        ]);
      }
    } catch (pterodactylError) {
      // Handle server still installing
      if (pterodactylError instanceof Error && pterodactylError.message === 'SERVER_INSTALLING') {
        return NextResponse.json({
          installing: true,
          server: null,
          resources: null,
        });
      }
      throw pterodactylError;
    }

    return NextResponse.json({
      server: {
        name: serverDetails.attributes.name,
        identifier: serverDetails.attributes.identifier,
        uuid: serverDetails.attributes.uuid,
        description: serverDetails.attributes.description || '',
        limits: serverDetails.attributes.limits,
        feature_limits: serverDetails.attributes.feature_limits,
        is_suspended: serverDetails.attributes.is_suspended,
        is_installing: serverDetails.attributes.is_installing,
        sftp_details: serverDetails.attributes.sftp_details,
        allocations: serverDetails.attributes.relationships?.allocations?.data?.map((a: { attributes: { ip: string; port: number; is_default: boolean } }) => ({
          ip: a.attributes.ip,
          port: a.attributes.port,
          is_default: a.attributes.is_default,
        })) || [],
      },
      resources: {
        current_state: resources.attributes.current_state,
        is_suspended: resources.attributes.is_suspended,
        resources: resources.attributes.resources,
      },
    });
  } catch (error) {
    console.error('Get server error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server details' },
      { status: 500 }
    );
  }
}
