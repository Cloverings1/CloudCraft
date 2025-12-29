# CloudCraft - Minecraft Server Hosting Platform

A fully automated Minecraft server hosting platform with instant provisioning, real-time console access, and a premium dark-mode UI.

## Live Demo

**Production:** https://minecraft-hosting-gilt.vercel.app

## Features

- **Instant Server Provisioning** - Spin up a Minecraft server in under 60 seconds
- **24-Hour Free Demo** - Try before you buy with no credit card required
- **Real-time Console** - WebSocket-powered live console with command input
- **File Manager** - Browse and manage server files directly from the panel
- **Power Controls** - Start, stop, restart servers with one click
- **Auto EULA Acceptance** - Servers are ready to play immediately

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **Game Servers** | Pterodactyl Panel + Wings |
| **Hosting** | Vercel (Web) + Hetzner VPS (Game Servers) |
| **Auth** | Custom session-based authentication |

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (or Supabase account)
- Pterodactyl Panel with Wings installed

### Installation

```bash
# Clone the repository
git clone https://github.com/Cloverings1/CloudCraft.git
cd CloudCraft

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

### Environment Variables

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Pterodactyl Configuration
PTERODACTYL_URL=http://your-panel-ip:8081
PTERODACTYL_ADMIN_KEY=ptla_your_admin_api_key
PTERODACTYL_CLIENT_KEY=ptlc_your_client_api_key
PTERODACTYL_MINECRAFT_EGG_ID=3
PTERODACTYL_MINECRAFT_NEST_ID=1
PTERODACTYL_DEFAULT_LOCATION=1
```

## Project Structure

```
cloudcraft/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── health/    # Health check endpoint
│   │   │   └── servers/   # Server management APIs
│   │   ├── panel/         # Dashboard pages
│   │   │   └── server/[id]/ # Server management UI
│   │   ├── try-demo/      # Demo signup page
│   │   ├── login/         # Login page
│   │   └── page.tsx       # Landing page
│   └── lib/
│       ├── auth.ts        # Authentication utilities
│       ├── db.ts          # Prisma client
│       └── pterodactyl.ts # Pterodactyl API client
└── docs/
    └── TECHNICAL.md       # Architecture documentation
```

## Demo Server Specs

| Resource | Allocation |
|----------|------------|
| RAM | 2 GB |
| CPU | 1 vCPU |
| Storage | 5 GB |
| Duration | 24 hours |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account + demo server |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/logout` | POST | End session |
| `/api/servers/[id]/power` | POST | Power actions (start/stop/restart) |
| `/api/servers/[id]/command` | POST | Send console command |
| `/api/servers/[id]/websocket` | GET | Get WebSocket credentials |
| `/api/health` | GET | System health check |

## Documentation

- [Technical Architecture](./docs/TECHNICAL.md) - System design and architecture
- [Pterodactyl Setup](./docs/PTERODACTYL.md) - Game server configuration

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Website)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### VPS (Game Servers)

1. Install Pterodactyl Panel and Wings
2. Configure node with available RAM/CPU
3. Create Minecraft egg with Java 21
4. Set up port allocations (25565+)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with Next.js and Pterodactyl Panel
