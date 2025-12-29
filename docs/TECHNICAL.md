# CloudCraft Technical Architecture

This document provides a comprehensive overview of the CloudCraft platform architecture, data flows, and system design.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDCRAFT PLATFORM                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │   Browser    │         │   Browser    │         │   Browser    │
    │   (User 1)   │         │   (User 2)   │         │   (User N)   │
    └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
           │                        │                        │
           └────────────────────────┼────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL EDGE NETWORK                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Next.js Application                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Landing   │  │  Try Demo   │  │    Login    │  │    Panel    │  │  │
│  │  │    Page     │  │    Page     │  │    Page     │  │  Dashboard  │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      API Routes (Serverless)                    │  │  │
│  │  │  /api/auth/*  │  /api/servers/*  │  /api/health  │  /api/...   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
           │                                              │
           │ Database Queries                             │ API Calls
           ▼                                              ▼
┌─────────────────────────┐              ┌─────────────────────────────────────┐
│      SUPABASE           │              │           HETZNER VPS               │
│  ┌───────────────────┐  │              │  ┌─────────────────────────────────┐│
│  │    PostgreSQL     │  │              │  │      Pterodactyl Panel          ││
│  │  ┌─────────────┐  │  │              │  │  ┌─────────────────────────────┐││
│  │  │    User     │  │  │              │  │  │    Application API          │││
│  │  │   Session   │  │  │              │  │  │    (Server Management)      │││
│  │  │   Server    │  │  │              │  │  └─────────────────────────────┘││
│  │  └─────────────┘  │  │              │  │  ┌─────────────────────────────┐││
│  │                   │  │              │  │  │      Client API             │││
│  │  Connection Pool  │  │              │  │  │   (Console, Commands)       │││
│  │    (Supavisor)    │  │              │  │  └─────────────────────────────┘││
│  └───────────────────┘  │              │  └─────────────────────────────────┘│
└─────────────────────────┘              │  ┌─────────────────────────────────┐│
                                         │  │      Pterodactyl Wings          ││
                                         │  │  ┌─────────┐ ┌─────────┐        ││
                                         │  │  │ Server  │ │ Server  │  ...   ││
                                         │  │  │   #1    │ │   #2    │        ││
                                         │  │  │(Docker) │ │(Docker) │        ││
                                         │  │  └─────────┘ └─────────┘        ││
                                         │  └─────────────────────────────────┘│
                                         └─────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Registration & Demo Server Creation

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌────────────────┐
│  User    │     │   Vercel     │     │  Supabase   │     │  Pterodactyl   │
│ Browser  │     │   (Next.js)  │     │  (Postgres) │     │    (Panel)     │
└────┬─────┘     └──────┬───────┘     └──────┬──────┘     └───────┬────────┘
     │                  │                    │                    │
     │  1. Submit Form  │                    │                    │
     │  (email/pass)    │                    │                    │
     │─────────────────>│                    │                    │
     │                  │                    │                    │
     │                  │  2. Check if       │                    │
     │                  │  email exists      │                    │
     │                  │───────────────────>│                    │
     │                  │<───────────────────│                    │
     │                  │                    │                    │
     │                  │  3. Create         │                    │
     │                  │  Pterodactyl User  │                    │
     │                  │───────────────────────────────────────>│
     │                  │<───────────────────────────────────────│
     │                  │                    │     User ID        │
     │                  │                    │                    │
     │                  │  4. Create         │                    │
     │                  │  Demo Server       │                    │
     │                  │───────────────────────────────────────>│
     │                  │<───────────────────────────────────────│
     │                  │                    │    Server ID       │
     │                  │                    │                    │
     │                  │  5. Save User      │                    │
     │                  │  & Server to DB    │                    │
     │                  │───────────────────>│                    │
     │                  │<───────────────────│                    │
     │                  │                    │                    │
     │                  │  6. Create Session │                    │
     │                  │───────────────────>│                    │
     │                  │<───────────────────│                    │
     │                  │                    │                    │
     │  7. Set Cookie   │                    │                    │
     │  Redirect /panel │                    │                    │
     │<─────────────────│                    │                    │
     │                  │                    │                    │
     │                  │  8. Background:    │                    │
     │                  │  Accept EULA       │                    │
     │                  │───────────────────────────────────────>│
     │                  │                    │                    │
```

### 2. Real-time Console Connection

```
┌──────────┐     ┌──────────────┐     ┌────────────────┐     ┌─────────────┐
│  User    │     │   Vercel     │     │  Pterodactyl   │     │   Wings     │
│ Browser  │     │   (API)      │     │    (Panel)     │     │  (Docker)   │
└────┬─────┘     └──────┬───────┘     └───────┬────────┘     └──────┬──────┘
     │                  │                     │                     │
     │  1. Request WS   │                     │                     │
     │  Credentials     │                     │                     │
     │─────────────────>│                     │                     │
     │                  │                     │                     │
     │                  │  2. Get WS Token    │                     │
     │                  │  from Client API    │                     │
     │                  │────────────────────>│                     │
     │                  │<────────────────────│                     │
     │                  │     {token, socket} │                     │
     │                  │                     │                     │
     │  3. Return       │                     │                     │
     │  Credentials     │                     │                     │
     │<─────────────────│                     │                     │
     │                  │                     │                     │
     │  4. Connect WebSocket directly to Wings                      │
     │─────────────────────────────────────────────────────────────>│
     │<─────────────────────────────────────────────────────────────│
     │                  │                     │    Bidirectional    │
     │                  │                     │    Console Stream   │
     │                  │                     │                     │
     │  5. Send Command │                     │                     │
     │─────────────────────────────────────────────────────────────>│
     │                  │                     │                     │
     │  6. Receive Output                     │                     │
     │<─────────────────────────────────────────────────────────────│
     │                  │                     │                     │
```

### 3. Server Power Control

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌────────────────┐
│  User    │     │   Vercel     │     │  Supabase   │     │  Pterodactyl   │
│ Browser  │     │   (API)      │     │    (DB)     │     │   (Client)     │
└────┬─────┘     └──────┬───────┘     └──────┬──────┘     └───────┬────────┘
     │                  │                    │                    │
     │  1. Click Start  │                    │                    │
     │  POST /power     │                    │                    │
     │  {action:"start"}│                    │                    │
     │─────────────────>│                    │                    │
     │                  │                    │                    │
     │                  │  2. Verify Session │                    │
     │                  │───────────────────>│                    │
     │                  │<───────────────────│                    │
     │                  │                    │                    │
     │                  │  3. Get Server     │                    │
     │                  │  Details           │                    │
     │                  │───────────────────>│                    │
     │                  │<───────────────────│                    │
     │                  │                    │                    │
     │                  │  4. Send Power     │                    │
     │                  │  Signal            │                    │
     │                  │───────────────────────────────────────>│
     │                  │<───────────────────────────────────────│
     │                  │                    │                    │
     │  5. Success      │                    │                    │
     │<─────────────────│                    │                    │
     │                  │                    │                    │
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                           DATABASE                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐       ┌─────────────────────────┐
│         User            │       │        Session          │
├─────────────────────────┤       ├─────────────────────────┤
│ id: String (PK, CUID)   │──┐    │ id: String (PK, CUID)   │
│ email: String (Unique)  │  │    │ token: String (Unique)  │
│ passwordHash: String    │  │    │ userId: String (FK)     │──┐
│ name: String?           │  │    │ expiresAt: DateTime     │  │
│ pterodactylUserId: Int? │  │    │ createdAt: DateTime     │  │
│ pterodactylApiKey: Str? │  │    └─────────────────────────┘  │
│ createdAt: DateTime     │  │                                 │
│ updatedAt: DateTime     │  │                                 │
└─────────────────────────┘  │                                 │
           │                 │                                 │
           │ 1:1             │ 1:N                             │
           ▼                 └─────────────────────────────────┘
┌─────────────────────────┐
│        Server           │
├─────────────────────────┤
│ id: String (PK, CUID)   │
│ pterodactylServerId: Str│ (Unique)
│ pterodactylIdentifier:  │ String
│ name: String            │
│ planType: String        │ (starter/pro/elite/demo)
│ isDemo: Boolean         │
│ demoExpiresAt: DateTime?│
│ userId: String (FK)     │ (Unique - 1 server per user)
│ createdAt: DateTime     │
│ updatedAt: DateTime     │
└─────────────────────────┘
```

---

## Technology Stack Details

### Frontend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 16 | Server-side rendering, routing |
| UI Library | React 19 | Component-based UI |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Icons | Inline SVG | Custom icons |
| State | React useState | Local component state |

### Backend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 20 | JavaScript execution |
| API | Next.js API Routes | Serverless functions |
| ORM | Prisma 5.22 | Database queries |
| Auth | bcryptjs | Password hashing |
| Sessions | HTTP-only cookies | Secure session management |

### Infrastructure

| Component | Provider | Purpose |
|-----------|----------|---------|
| Web Hosting | Vercel | Edge deployment, serverless |
| Database | Supabase | PostgreSQL with connection pooling |
| Game Servers | Hetzner VPS | Pterodactyl Panel + Wings |
| DNS | Vercel | Automatic SSL, CDN |

---

## Server Provisioning Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                     DEMO SERVER PROVISIONING                           │
└────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│  User submits   │
│  email/password │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Email already  │────>│  Return error:  │
│    exists?      │ Yes │ "Account exists"│
└────────┬────────┘     └─────────────────┘
         │ No
         ▼
┌─────────────────┐
│  Hash password  │
│  (bcrypt)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Create user in │────>│  API Error?     │───> Rollback & Error
│  Pterodactyl    │     │                 │
└────────┬────────┘     └─────────────────┘
         │ Success
         ▼
┌─────────────────┐
│  Save user to   │
│  database       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Create demo    │────>│  No resources?  │───> User created,
│  server (6GB)   │     │                 │     no server
└────────┬────────┘     └─────────────────┘
         │ Success
         ▼
┌─────────────────┐
│  Save server to │
│  database       │
│  (24hr expiry)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create session │
│  Set cookie     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Background:    │
│  Accept EULA    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect to    │
│  /panel/server  │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │   END   │
    └─────────┘
```

---

## Security Measures

### Authentication

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

  Password Storage:
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  Plain-text │────>│   bcrypt    │────>│   Hashed    │
  │  Password   │     │  (10 rounds)│     │  Password   │
  └─────────────┘     └─────────────┘     └─────────────┘

  Session Management:
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  Generate   │────>│  Store in   │────>│  HTTP-only  │
  │  Token      │     │  Database   │     │   Cookie    │
  │  (crypto)   │     │  (Session)  │     │  (Secure)   │
  └─────────────┘     └─────────────┘     └─────────────┘
```

### API Security

| Measure | Implementation |
|---------|---------------|
| Session Validation | Every API call verifies session token |
| Server Ownership | Users can only access their own servers |
| Password Hashing | bcrypt with 10 rounds |
| Cookie Security | HTTP-only, Secure, SameSite=Lax |
| Input Validation | Email format, password length |

---

## Environment Configuration

### Production (Vercel)

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[pass]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Pterodactyl Panel
PTERODACTYL_URL=http://69.164.203.24:8081
PTERODACTYL_ADMIN_KEY=ptla_xxx    # Application API (admin)
PTERODACTYL_CLIENT_KEY=ptlc_xxx   # Client API (service account)

# Pterodactyl Server Config
PTERODACTYL_MINECRAFT_EGG_ID=3
PTERODACTYL_MINECRAFT_NEST_ID=1
PTERODACTYL_DEFAULT_LOCATION=1
```

### Resource Limits

| Resource | Demo Server | Pro Server | Elite Server |
|----------|-------------|------------|--------------|
| RAM | 6 GB | 6 GB | 12 GB |
| CPU | 3 vCPUs | 3 vCPUs | 4 vCPUs |
| Storage | 20 GB | 35 GB | 60 GB |
| Duration | 24 hours | Unlimited | Unlimited |
| Backups | 1 | 7 | 14 |

---

## API Reference

### Authentication

#### POST `/api/auth/register`

Creates a new user account and optionally provisions a demo server.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "isDemo": true
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "cmjrheg4e0000oslenheb722s",
    "email": "user@example.com",
    "name": "user1234"
  },
  "serverId": "7683afc0",
  "demoExpiresAt": "2025-12-30T18:18:08.809Z"
}
```

#### POST `/api/auth/login`

Authenticates an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "cmjrheg4e0000oslenheb722s",
    "email": "user@example.com"
  }
}
```

### Server Management

#### POST `/api/servers/[id]/power`

Controls server power state.

**Request:**
```json
{
  "action": "start" | "stop" | "restart" | "kill"
}
```

#### POST `/api/servers/[id]/command`

Sends a command to the server console.

**Request:**
```json
{
  "command": "say Hello World"
}
```

#### GET `/api/servers/[id]/websocket`

Returns WebSocket credentials for real-time console access.

**Response:**
```json
{
  "token": "eyJ...",
  "socket": "wss://node.example.com:8080/api/servers/xxx/ws"
}
```

---

## Pterodactyl Integration

### API Keys Required

| Key Type | Purpose | Permissions |
|----------|---------|-------------|
| Application API | User/Server creation | Admin access |
| Client API | Console/Commands | Service account |

### Server Creation Parameters

```javascript
{
  name: "username-demo",
  user: pterodactylUserId,
  nest: 1,                    // Minecraft nest
  egg: 3,                     // Paper MC egg
  docker_image: "ghcr.io/pterodactyl/yolks:java_21",
  startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
  environment: {
    SERVER_JARFILE: "server.jar",
    MINECRAFT_VERSION: "latest",
    BUILD_NUMBER: "latest"
  },
  limits: {
    memory: 6144,             // 6 GB
    swap: 0,
    disk: 20480,              // 20 GB
    io: 500,
    cpu: 300                  // 3 vCPUs
  },
  feature_limits: {
    databases: 0,
    backups: 1,
    allocations: 1
  },
  deploy: {
    locations: [1],
    dedicated_ip: false,
    port_range: []
  },
  start_on_completion: true
}
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEPLOYMENT TOPOLOGY                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   CloudFlare    │
                              │      DNS        │
                              └────────┬────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │                          │                          │
            ▼                          ▼                          ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   Vercel Edge       │   │   Supabase Cloud    │   │    Hetzner VPS      │
│   (Web App)         │   │   (Database)        │   │   (Game Servers)    │
├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
│ • Next.js SSR       │   │ • PostgreSQL 17     │   │ • Pterodactyl Panel │
│ • API Routes        │   │ • Connection Pool   │   │ • Wings Daemon      │
│ • Static Assets     │   │ • Auto Backups      │   │ • Docker Containers │
│ • Edge Caching      │   │ • Row Level Sec.    │   │ • 7 GB RAM          │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
        │                          │                          │
        │    HTTPS/WSS             │   PostgreSQL             │   REST API
        │                          │   (Port 6543)            │   (Port 8081)
        └──────────────────────────┴──────────────────────────┘
```

---

## Monitoring & Health Checks

### Health Endpoint

**GET `/api/health`**

```json
{
  "DATABASE_URL": "set",
  "PTERODACTYL_URL": "http://69.164.203.24:8081",
  "PTERODACTYL_ADMIN_KEY": "set",
  "database": "connected (0 users)",
  "pterodactyl": "connected"
}
```

### Metrics to Monitor

| Metric | Warning | Critical |
|--------|---------|----------|
| Database Connection | > 1s latency | Connection failed |
| Pterodactyl API | > 2s latency | Connection failed |
| Server Provisioning | > 60s | Failed |
| Memory Usage | > 80% | > 95% |

---

## Future Enhancements

### Phase 2 (Planned)
- [ ] Stripe payment integration
- [ ] Multiple server plans (Pro, Elite)
- [ ] Custom domain support
- [ ] Automated backups to S3

### Phase 3 (Future)
- [ ] Multi-region deployment
- [ ] Modpack marketplace
- [ ] Server analytics dashboard
- [ ] DDoS protection metrics

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "No nodes satisfying requirements" | VPS out of resources | Delete old servers or upgrade node |
| "Tenant or user not found" | Wrong DB connection string | Use pooler format: `postgres.[ref]` |
| Server won't start | EULA not accepted | Wait 30s for auto-accept or manually accept |
| WebSocket disconnects | Token expired | Refresh credentials from API |

---

*Last updated: December 2025*
