const PANEL_URL = process.env.PTERODACTYL_URL || 'http://69.164.203.24:8081';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

export interface ServerDetails {
  identifier: string;
  uuid: string;
  name: string;
  description: string;
  status: string | null;
  is_suspended: boolean;
  is_installing: boolean;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  sftp_details: {
    ip: string;
    port: number;
  };
  allocations: {
    ip: string;
    port: number;
    is_default: boolean;
  }[];
  relationships?: {
    allocations?: {
      data: {
        attributes: {
          ip: string;
          port: number;
          is_default: boolean;
        };
      }[];
    };
  };
}

export interface ServerResources {
  current_state: 'running' | 'starting' | 'stopping' | 'offline';
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    memory_limit_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}

export interface WebSocketCredentials {
  token: string;
  socket: string;
}

class PterodactylClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.baseUrl = `${PANEL_URL}/api/client`;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pterodactyl API error: ${response.status} - ${error}`);
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async listServers(): Promise<{ data: { attributes: ServerDetails }[] }> {
    return this.request('/');
  }

  async getServer(serverId: string): Promise<{ attributes: ServerDetails }> {
    return this.request(`/servers/${serverId}`);
  }

  async getResources(serverId: string): Promise<{ attributes: ServerResources }> {
    return this.request(`/servers/${serverId}/resources`);
  }

  async sendPowerAction(serverId: string, signal: PowerAction): Promise<void> {
    await this.request(`/servers/${serverId}/power`, {
      method: 'POST',
      body: JSON.stringify({ signal }),
    });
  }

  async sendCommand(serverId: string, command: string): Promise<void> {
    await this.request(`/servers/${serverId}/command`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  }

  async getWebSocketCredentials(serverId: string): Promise<{ data: WebSocketCredentials }> {
    return this.request(`/servers/${serverId}/websocket`);
  }
}

export function createPterodactylClient(apiKey: string): PterodactylClient {
  return new PterodactylClient(apiKey);
}

// Admin client for server provisioning (uses Application API)
export async function createPterodactylUser(email: string, username: string, password: string) {
  const adminKey = process.env.PTERODACTYL_ADMIN_KEY;
  if (!adminKey) throw new Error('Admin API key not configured');

  const response = await fetch(`${PANEL_URL}/api/application/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email,
      username,
      first_name: username,
      last_name: 'User',
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Pterodactyl user: ${error}`);
  }

  return response.json();
}

// Interface for server creation options
export interface CreateServerOptions {
  name: string;
  userId: number;        // Pterodactyl user ID
  memory: number;        // MB
  cpu: number;           // Percentage (200 = 2 cores)
  disk: number;          // MB
}

// Paper 1.21.1 - pinned version for fast deployment (no API lookup needed)
const PAPER_VERSION = '1.21.1';
const PAPER_BUILD = '133';
const PAPER_JAR_URL = `https://api.papermc.io/v2/projects/paper/versions/${PAPER_VERSION}/builds/${PAPER_BUILD}/downloads/paper-${PAPER_VERSION}-${PAPER_BUILD}.jar`;

// Wait for server installation to complete and accept EULA
export async function waitForInstallAndAcceptEula(serverIdentifier: string, maxWaitSeconds = 60): Promise<void> {
  const adminClient = createAdminPterodactylClient();
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitSeconds * 1000) {
    try {
      // Try to accept EULA - will fail if server isn't ready
      await adminClient.acceptEula(serverIdentifier);
      console.log(`EULA accepted for server ${serverIdentifier}`);
      return;
    } catch (err) {
      // Server might still be installing, wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.warn(`Could not auto-accept EULA for ${serverIdentifier} within ${maxWaitSeconds}s`);
}

// Create a new server via Application API (optimized for fast deployment)
export async function createPterodactylServer(options: CreateServerOptions) {
  const adminKey = process.env.PTERODACTYL_ADMIN_KEY;
  if (!adminKey) throw new Error('Admin API key not configured');

  const MINECRAFT_EGG_ID = parseInt(process.env.PTERODACTYL_MINECRAFT_EGG_ID || '1');
  const MINECRAFT_NEST_ID = parseInt(process.env.PTERODACTYL_MINECRAFT_NEST_ID || '1');
  const DEFAULT_LOCATION_ID = parseInt(process.env.PTERODACTYL_DEFAULT_LOCATION || '1');

  const response = await fetch(`${PANEL_URL}/api/application/servers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: options.name,
      user: options.userId,
      nest: MINECRAFT_NEST_ID,
      egg: MINECRAFT_EGG_ID,
      docker_image: 'ghcr.io/pterodactyl/yolks:java_21',
      startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
      environment: {
        SERVER_JARFILE: 'server.jar',
        // Pinned Paper version - skips version lookup API calls
        MINECRAFT_VERSION: PAPER_VERSION,
        BUILD_NUMBER: PAPER_BUILD,
        // Direct download URL - fastest possible JAR fetch
        DL_PATH: PAPER_JAR_URL,
      },
      limits: {
        memory: options.memory,
        swap: 0,
        disk: options.disk,
        io: 500,
        cpu: options.cpu,
      },
      feature_limits: {
        databases: 0,
        backups: 1,
        allocations: 1,
      },
      deploy: {
        locations: [DEFAULT_LOCATION_ID],
        dedicated_ip: false,
        port_range: [],
      },
      // Don't auto-start - we'll upload EULA first then start manually
      start_on_completion: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Pterodactyl server: ${error}`);
  }

  return response.json();
}

// Fast server setup: upload EULA and start server immediately after install
export async function setupAndStartServer(serverIdentifier: string, maxWaitSeconds = 120): Promise<void> {
  const client = createAdminPterodactylClient();
  const startTime = Date.now();

  // Wait for installation to complete (JAR download)
  while (Date.now() - startTime < maxWaitSeconds * 1000) {
    try {
      // Try to write EULA - fails if server still installing
      await client.writeFile(serverIdentifier, '/eula.txt', 'eula=true');
      console.log(`EULA written for server ${serverIdentifier}`);

      // Small delay to ensure file is synced
      await new Promise(resolve => setTimeout(resolve, 500));

      // Start the server
      await client.sendPowerAction(serverIdentifier, 'start');
      console.log(`Server ${serverIdentifier} started`);
      return;
    } catch (err) {
      // Server still installing, wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.warn(`Server setup timed out for ${serverIdentifier} after ${maxWaitSeconds}s`);
}

// Suspend a server via Application API
export async function suspendPterodactylServer(serverId: string) {
  const adminKey = process.env.PTERODACTYL_ADMIN_KEY;
  if (!adminKey) throw new Error('Admin API key not configured');

  const response = await fetch(`${PANEL_URL}/api/application/servers/${serverId}/suspend`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminKey}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to suspend server: ${error}`);
  }
}

// Unsuspend a server via Application API (for upgrade flow)
export async function unsuspendPterodactylServer(serverId: string) {
  const adminKey = process.env.PTERODACTYL_ADMIN_KEY;
  if (!adminKey) throw new Error('Admin API key not configured');

  const response = await fetch(`${PANEL_URL}/api/application/servers/${serverId}/unsuspend`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminKey}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to unsuspend server: ${error}`);
  }
}

// Service client for server management (uses Client API with service account key)
// This is used when user doesn't have their own Client API key (e.g., demo users)
class ServicePterodactylClient {
  private clientKey: string;

  constructor() {
    const clientKey = process.env.PTERODACTYL_CLIENT_KEY;
    if (!clientKey) throw new Error('Client API key not configured');
    this.clientKey = clientKey;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${PANEL_URL}/api/client${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.clientKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();

      // Handle 409 - server still installing (return placeholder data instead of error)
      if (response.status === 409 && error.includes('installation')) {
        throw new Error('SERVER_INSTALLING');
      }

      throw new Error(`Pterodactyl Client API error: ${response.status} - ${error}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Get server resources
  async getServerResources(serverIdentifier: string): Promise<{ attributes: ServerResources }> {
    return this.request(`/servers/${serverIdentifier}/resources`);
  }

  // Get server details
  async getServerDetails(serverIdentifier: string): Promise<{ attributes: ServerDetails }> {
    return this.request(`/servers/${serverIdentifier}?include=allocations`);
  }

  // Send power action
  async sendPowerAction(serverIdentifier: string, signal: PowerAction): Promise<void> {
    await this.request(`/servers/${serverIdentifier}/power`, {
      method: 'POST',
      body: JSON.stringify({ signal }),
    });
  }

  // Send command
  async sendCommand(serverIdentifier: string, command: string): Promise<void> {
    await this.request(`/servers/${serverIdentifier}/command`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  }

  // Get WebSocket credentials
  async getWebSocketCredentials(serverIdentifier: string): Promise<{ data: WebSocketCredentials }> {
    return this.request(`/servers/${serverIdentifier}/websocket`);
  }

  // Write file to server
  async writeFile(serverIdentifier: string, filePath: string, content: string): Promise<void> {
    const response = await fetch(`${PANEL_URL}/api/client/servers/${serverIdentifier}/files/write?file=${encodeURIComponent(filePath)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.clientKey}`,
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
      },
      body: content,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to write file: ${response.status} - ${error}`);
    }
  }

  // Accept EULA for Minecraft server
  async acceptEula(serverIdentifier: string): Promise<void> {
    await this.writeFile(serverIdentifier, '/eula.txt', 'eula=true');
  }
}

export function createAdminPterodactylClient(): ServicePterodactylClient {
  return new ServicePterodactylClient();
}
