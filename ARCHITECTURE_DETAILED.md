# LaraCore Architecture - Visual Guide

## System Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                            HOST MACHINE (macOS/Linux/Windows)              │
│                     Running Docker Desktop with Docker Compose             │
│                                                                             │
│  Requirements:                                                             │
│  ✓ Docker Desktop (with Docker Engine & Docker Compose)                   │
│  ✓ Git                                                                     │
│  ✓ VS Code (optional)                                                      │
│  ✓ NO PHP, NO Node.js, NO PostgreSQL needed locally                       │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ docker compose up -d
                                    │
                 ┌──────────────────┴──────────────────┐
                 │                                     │
                 ▼                                     ▼
         Docker Network               Volume Mounts
         (laracore-network)           (Bind Mounts & Named)
         Bridge Driver
```

---

## Container Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DOCKER COMPOSE SERVICES                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ NGINX (nginx:alpine)                                               │ │
│  │ ├─ Port 80 → 80 (HTTP)                                            │ │
│  │ ├─ Port 443 → 443 (HTTPS, optional)                              │ │
│  │ ├─ Health Check: /health endpoint                                │ │
│  │ ├─ Volume: ./src → /var/www/html:delegated                       │ │
│  │ ├─ Volume: ./docker/nginx → /etc/nginx/conf.d                    │ │
│  │ ├─ Network: laracore-network                                      │ │
│  │ └─ Restart: unless-stopped                                        │ │
│  │                                                                    │ │
│  │ Responsibilities:                                                  │ │
│  │ • Entry point for all HTTP requests                               │ │
│  │ • Route static files (/public/*, /css/*, /js/*)                  │ │
│  │ • Reverse proxy to PHP-FPM for dynamic content                   │ │
│  │ • Proxy to Node.js for Vite HMR (@vite, /node_modules/)         │ │
│  │ • Gzip compression                                                │ │
│  │ • Security headers                                                │ │
│  │ • Cache control for static assets                                │ │
│  │ • SPA routing (/* → index.php)                                    │ │
│  │ • API routing (/api/* → index.php)                               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ PHP-FPM (Custom: php:8.4-fpm-alpine)                              │ │
│  │ ├─ Port 9000 → 9000 (Internal: FastCGI)                          │ │
│  │ ├─ Health Check: php -r "exit(0);"                               │ │
│  │ ├─ Volume: ./src → /var/www/html:delegated                       │ │
│  │ ├─ Volume: ./docker/scripts → /scripts:ro                        │ │
│  │ ├─ Volume: ./docker/php → /usr/local/etc/php:ro                  │ │
│  │ ├─ Network: laracore-network                                      │ │
│  │ ├─ Environment: DB_HOST=postgres, REDIS_HOST=redis               │ │
│  │ ├─ Restart: unless-stopped                                        │ │
│  │ └─ Depends On: postgres (healthy), redis (healthy)               │ │
│  │                                                                    │ │
│  │ Extensions & Tools Installed:                                     │ │
│  │ • PHP: pdo, pdo_pgsql, bcmath, ctype, fileinfo, mbstring, xml   │ │
│  │ • Redis extension (php-redis)                                     │ │
│  │ • Composer (dependency manager)                                   │ │
│  │ • Supervisor (process manager)                                    │ │
│  │ • Git, curl, zip (utility tools)                                  │ │
│  │                                                                    │ │
│  │ Processes Managed by Supervisor:                                 │ │
│  │ 1. laravel-worker (queue:work)                                    │ │
│  │    - Processes queued jobs continuously                           │ │
│  │    - Handles background tasks (emails, reports, etc.)           │ │
│  │    - Configured with --sleep=3, --tries=3                        │ │
│  │                                                                    │ │
│  │ 2. laravel-scheduler                                              │ │
│  │    - Runs scheduled tasks every minute                            │ │
│  │    - Executes cron-like jobs from schedule()                      │ │
│  │                                                                    │ │
│  │ 3. laravel-horizon (optional)                                     │ │
│  │    - Queue monitoring dashboard                                   │ │
│  │    - Install via: php artisan horizon:install                    │ │
│  │                                                                    │ │
│  │ Startup Process (entrypoint.sh):                                 │ │
│  │ 1. Wait for PostgreSQL to be ready                               │ │
│  │ 2. Run migrations (if ARTISAN_MIGRATE=true)                      │ │
│  │ 3. Install composer dependencies (if not exists)                 │ │
│  │ 4. Cache configuration, routes, views                             │ │
│  │ 5. Start Supervisor (manages all background processes)           │ │
│  │ 6. Start PHP-FPM (main application server)                       │ │
│  │                                                                    │ │
│  │ Responsibilities:                                                  │ │
│  │ • Execute Laravel application code                                │ │
│  │ • Process HTTP requests from Nginx                                │ │
│  │ • Connect to PostgreSQL database                                  │ │
│  │ • Connect to Redis for cache/sessions                             │ │
│  │ • Execute queued jobs                                             │ │
│  │ • Execute scheduled tasks                                         │ │
│  │ • Handle file uploads                                             │ │
│  │ • Execute Artisan commands via docker compose exec                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ NODE.js (node:22-alpine)                                          │ │
│  │ ├─ Port 5173 → 5173 (Vite dev server)                            │ │
│  │ ├─ Health Check: HTTP request to localhost:5173                  │ │
│  │ ├─ Volume: ./src → /var/www/html:delegated                       │ │
│  │ ├─ Volume: /var/www/html/node_modules (anonymous)                │ │
│  │ ├─ Network: laracore-network                                      │ │
│  │ ├─ Environment: NODE_ENV=development                             │ │
│  │ ├─ Restart: unless-stopped                                        │ │
│  │ └─ Command: npm run dev -- --host 0.0.0.0 --port 5173           │ │
│  │                                                                    │ │
│  │ Package Manager Support:                                          │ │
│  │ • npm (default)                                                   │ │
│  │ • yarn (if yarn.lock detected)                                    │ │
│  │ • pnpm (if pnpm-lock.yaml detected)                               │ │
│  │                                                                    │ │
│  │ Vite Dev Server Features:                                         │ │
│  │ • Hot Module Replacement (HMR) for React                         │ │
│  │ • Automatic component refresh                                     │ │
│  │ • WebSocket connection for live updates                          │ │
│  │ • Fast ES modules compilation                                     │ │
│  │ • Sourcemaps for debugging                                        │ │
│  │                                                                    │ │
│  │ Responsibilities:                                                  │ │
│  │ • Compile React components (JSX)                                  │ │
│  │ • Serve frontend dev server on :5173                              │ │
│  │ • Hot reload on file changes                                      │ │
│  │ • Build production assets (npm run build)                         │ │
│  │ • Manage npm dependencies                                         │ │
│  │ • Run frontend tests (if configured)                              │ │
│  │ • Lint frontend code (if configured)                              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ PostgreSQL 17 (postgres:17-alpine)                                │ │
│  │ ├─ Port 5432 → 5432 (SQL interface)                              │ │
│  │ ├─ Health Check: pg_isready command                              │ │
│  │ ├─ Volume: postgres_data ← /var/lib/postgresql/data (Named)      │ │
│  │ ├─ Network: laracore-network                                      │ │
│  │ ├─ Environment:                                                   │ │
│  │ │  • POSTGRES_DB=laracore                                        │ │
│  │ │  • POSTGRES_USER=postgres                                       │ │
│  │ │  • POSTGRES_PASSWORD=secret                                     │ │
│  │ │  • POSTGRES_INITDB_ARGS=--encoding=UTF8 --locale=C             │ │
│  │ ├─ Restart: unless-stopped                                        │ │
│  │ └─ Wait Time: 10s before services can connect                    │ │
│  │                                                                    │ │
│  │ Data Types Supported:                                             │ │
│  │ • TEXT, VARCHAR, CHAR                                             │ │
│  │ • INTEGER, BIGINT, DECIMAL, NUMERIC                               │ │
│  │ • BOOLEAN                                                          │ │
│  │ • DATE, TIME, TIMESTAMP, INTERVAL                                 │ │
│  │ • JSON, JSONB                                                      │ │
│  │ • UUID                                                             │ │
│  │ • ARRAY types                                                      │ │
│  │ • HSTORE (key-value)                                               │ │
│  │ • ENUM custom types                                                │ │
│  │ • INET, CIDR (network types)                                      │ │
│  │                                                                    │ │
│  │ Responsibilities:                                                  │ │
│  │ • Store all application data                                      │ │
│  │ • Execute SQL queries from Laravel Eloquent ORM                   │ │
│  │ • Persist data across container restarts                          │ │
│  │ • Support transactions and relationships                          │ │
│  │ • Provide tools for backup/restore                                │ │
│  │ • Allow direct access from host (tools like DBeaver)             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Redis 7 (redis:7-alpine)                                          │ │
│  │ ├─ Port 6379 → 6379 (Redis protocol)                             │ │
│  │ ├─ Health Check: redis-cli ping                                  │ │
│  │ ├─ Volume: redis_data ← /data (Named, appendonly persistence)    │ │
│  │ ├─ Network: laracore-network                                      │ │
│  │ ├─ Restart: unless-stopped                                        │ │
│  │ └─ Command: redis-server --appendonly yes                         │ │
│  │                                                                    │ │
│  │ Primary Functions in LaraCore:                                    │ │
│  │ 1. Cache Store                                                     │ │
│  │    - CACHE_DRIVER=redis                                           │ │
│  │    - Cache::put(), Cache::get(), Cache::forget()                 │ │
│  │    - Default TTL: configurable per key                            │ │
│  │                                                                    │ │
│  │ 2. Session Storage                                                 │ │
│  │    - SESSION_DRIVER=redis                                         │ │
│  │    - Session persistence across requests                          │ │
│  │    - Auto-cleanup after SESSION_LIFETIME                          │ │
│  │                                                                    │ │
│  │ 3. Queue Storage                                                   │ │
│  │    - QUEUE_CONNECTION=redis                                       │ │
│  │    - Queue::push() stores jobs in Redis                           │ │
│  │    - Queue workers retrieve jobs for processing                   │ │
│  │    - Supports failed job queue                                    │ │
│  │                                                                    │ │
│  │ Data Structures:                                                   │ │
│  │ • Strings (simple key-value)                                      │ │
│  │ • Hashes (object-like structures)                                 │ │
│  │ • Lists (ordered collections)                                     │ │
│  │ • Sets (unique collections)                                       │ │
│  │ • Sorted Sets (scored collections)                                │ │
│  │ • Streams (log-like structures)                                   │ │
│  │                                                                    │ │
│  │ Responsibilities:                                                  │ │
│  │ • Fast in-memory caching                                          │ │
│  │ • Session data persistence                                        │ │
│  │ • Background job queue storage                                    │ │
│  │ • Rate limiting (optional)                                        │ │
│  │ • Pub/Sub messaging (optional)                                    │ │
│  │ • Leaderboards & analytics (optional)                             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Mailpit (axllent/mailpit:latest)                                  │ │
│  │ ├─ Port 1025 → 1025 (SMTP for sending)                           │ │
│  │ ├─ Port 8025 → 8025 (Web UI for viewing)                         │ │
│  │ ├─ Network: laracore-network                                      │ │
│  │ ├─ Environment:                                                   │ │
│  │ │  • MP_SMTP_AUTH_ACCEPT_ANY=true                                │ │
│  │ │  • MP_UI_ALLOWED_NETWORKS=0.0.0.0/0                           │ │
│  │ ├─ Restart: unless-stopped                                        │ │
│  │ └─ No persistent volume (emails stored in memory)                │ │
│  │                                                                    │ │
│  │ Email Workflow:                                                    │ │
│  │ 1. Laravel app sends email via MAIL_HOST=mailpit:1025            │ │
│  │ 2. Mailpit intercepts SMTP connection                             │ │
│  │ 3. Email stored in memory (survives container restart)            │ │
│  │ 4. View in browser at http://localhost:8025                      │ │
│  │ 5. Perfect for testing email templates                            │ │
│  │                                                                    │ │
│  │ Responsibilities:                                                  │ │
│  │ • Capture all outgoing emails                                     │ │
│  │ • Store emails in memory                                          │ │
│  │ • Provide web UI for viewing                                      │ │
│  │ • Support SMTP debugging                                          │ │
│  │ • HTML preview and raw email viewing                              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### HTTP Request Flow

```
┌─ Client (Browser)
│
▼
   http://localhost/
   ↓
┌──────────────────────────────────────────────────┐
│ Nginx (Port 80)                                   │
│ • Receives HTTP request                           │
│ • Checks URL pattern:                             │
│   - Static files (/css, /js, /images) → Serve   │
│   - Vite dev path (@vite, /node_modules) → Node │
│   - Everything else → PHP                         │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│ PHP-FPM via FastCGI                               │
│ • Receives request                                │
│ • Laravel Bootstrap:                              │
│   - Load .env config                              │
│   - Register service providers                    │
│   - Parse route definition                        │
│   - Match route to controller                     │
│   - Execute middleware stack                      │
│ • Execute Controller Action:                      │
│   - Query database (PostgreSQL)                   │
│   - Check cache (Redis)                           │
│   - Build response data                           │
│   - Render React component                        │
│ • Return HTTP Response                            │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│ Nginx                                             │
│ • Receives response from PHP                      │
│ • Adds security headers                           │
│ • Gzip compression                                │
│ • Caches if needed                                │
└──────────────────────────────────────────────────┘
   ↓
   Response → Client (Browser)
```

### Background Job Flow (Queue)

```
┌─ Laravel Code
│  Queue::dispatch(new SendEmailJob($user));
│
▼
┌──────────────────────────────────────────────────┐
│ PHP-FPM                                           │
│ • Job serialized                                  │
│ • Stored in Redis (QUEUE_CONNECTION=redis)       │
└──────────────────────────────────────────────────┘
   ↓
   Jobs stored in: redis:6379 queue:default
   ↓
┌──────────────────────────────────────────────────┐
│ Queue Worker (via Supervisor)                     │
│ • Monitors Redis for jobs                         │
│ • Retrieves job from queue                        │
│ • Deserializes job class                          │
│ • Executes handle() method                        │
│ • If error: tries again (3 times max)             │
│ • If failed: moved to failed_jobs table           │
│ • Loops back to wait for next job                 │
└──────────────────────────────────────────────────┘
   ↓
   Email sent / Task completed
```

### Scheduled Task Flow (Scheduler)

```
┌─ time (every minute)
│
▼
┌──────────────────────────────────────────────────┐
│ Laravel Scheduler (via Supervisor)                │
│ • Runs every 60 seconds                           │
│ • Checks schedule() in Kernel.php                 │
│ • Compares due vs current time                    │
│ • Executes matching scheduled tasks               │
└──────────────────────────────────────────────────┘
   ↓
   Examples:
   • Cleanup expired sessions
   • Generate daily reports
   • Send daily digest emails
   • Backup databases
   • Prune old logs
```

### Cache Flow

```
┌─ $value = Cache::get('key')
│
▼
┌──────────────────────────────────────────────────┐
│ PHP-FPM (Laravel Cache Facade)                    │
│ • Checks CACHE_DRIVER=redis                       │
│ • Sends GET command to Redis                      │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│ Redis (Port 6379)                                 │
│ • Looks up key in memory                          │
│ • Returns value or null                           │
│ • TTL countdown in progress (if set)              │
│ • Returns data to PHP                             │
└──────────────────────────────────────────────────┘
   ↓
   Data returned to application
   or null if expired/not found
```

---

## Volume Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│ HOST MACHINE                                                     │
│                                                                  │
│  Directory Structure:                                            │
│  /Code/laracore/                                                │
│  ├── src/                    ← Your Laravel app                 │
│  ├── docker/                 ← Docker configs                   │
│  ├── docker-compose.yml      ← Main config                      │
│  └── .env                    ← Environment vars                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Bind Mounts (Delegated - Fast)
         │ & Named Volumes (Persistent)
         │
┌─────────────────────────────────────────────────────────────────┐
│ DOCKER CONTAINERS                                                │
│                                                                  │
│  Bind Mounts (Files sync between host & container):             │
│  ./src                          ↔ /var/www/html (PHP)           │
│  ./src                          ↔ /var/www/html (Node)          │
│  ./docker/nginx/default.conf    ↔ /etc/nginx/conf.d             │
│  ./docker/php/                  ↔ /usr/local/etc/php            │
│                                                                  │
│  Named Volumes (Persistent data):                               │
│  postgres_data                  ← /var/lib/postgresql/data      │
│  redis_data                     ← /data (Redis)                 │
│                                                                  │
│  Anonymous Volumes (Container-only):                            │
│  /var/www/html/node_modules     ← Prevents sync overhead        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Docker Network: laracore-network (bridge driver)                │
│                                                                  │
│ Service Discovery via DNS:                                      │
│ - nginx (resolvable as: nginx:80)                              │
│ - php (resolvable as: php:9000)                                │
│ - node (resolvable as: node:5173)                              │
│ - postgres (resolvable as: postgres:5432)                      │
│ - redis (resolvable as: redis:6379)                            │
│ - mailpit (resolvable as: mailpit:1025)                        │
│                                                                  │
│ Internal Communication Routes:                                  │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │ PHP → PostgreSQL (Database):                              │ │
│ │   DB_HOST=postgres                                         │ │
│ │   → connects to postgres:5432 internally                  │ │
│ │                                                             │ │
│ │ PHP → Redis (Cache/Queue):                                │ │
│ │   REDIS_HOST=redis                                         │ │
│ │   → connects to redis:6379 internally                     │ │
│ │                                                             │ │
│ │ PHP → Mailpit (Email):                                    │ │
│ │   MAIL_HOST=mailpit                                        │ │
│ │   → connects to mailpit:1025 internally                   │ │
│ │                                                             │ │
│ │ Nginx → PHP (Application):                                 │ │
│ │   fastcgi_pass php:9000                                    │ │
│ │   → connects to php:9000 internally                       │ │
│ │                                                             │ │
│ │ Nginx → Node (Vite HMR):                                  │ │
│ │   proxy_pass http://node:5173                             │ │
│ │   → connects to node:5173 internally                      │ │
│ │                                                             │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Port Mapping (Host → Container):                                │
│ Host Port    Container Port    Service     Protocol              │
│ ─────────────────────────────────────────────────────          │
│ 80          80                Nginx       HTTP                   │
│ 443         443               Nginx       HTTPS                  │
│ 5173        5173              Node        WebSocket (HMR)        │
│ 5432        5432              PostgreSQL  SQL                    │
│ 6379        6379              Redis       Redis Protocol         │
│ 1025        1025              Mailpit     SMTP                   │
│ 8025        8025              Mailpit     HTTP (Web UI)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Startup Sequence

```
▼ docker compose up -d

1. Parse docker-compose.yml
   ├─ Create network: laracore-network
   ├─ Create volumes: postgres_data, redis_data
   └─ Queue services for startup

2. Start Services (Parallel where possible):

   ┌─ PostgreSQL
   │  └─ docker run postgres:17-alpine
   │     ├─ Initialize database
   │     ├─ Create laracore database
   │     ├─ Start listening on 5432
   │     └─ Health check: pg_isready ✓
   │
   ├─ Redis
   │  └─ docker run redis:7-alpine
   │     ├─ Start in-memory store
   │     ├─ Load AOF if exists
   │     ├─ Start listening on 6379
   │     └─ Health check: redis-cli ping ✓
   │
   ├─ Mailpit
   │  └─ docker run axllent/mailpit
   │     ├─ Start SMTP server (1025)
   │     ├─ Start Web UI (8025)
   │     └─ Ready to receive emails
   │
   ├─ Node (Independent)
   │  └─ docker run node:22-alpine
   │     ├─ Build image from Dockerfile
   │     ├─ npm install dependencies
   │     ├─ npm run dev (Vite server)
   │     ├─ Start on port 5173
   │     ├─ Enable HMR
   │     └─ Health check ✓
   │
   └─ PHP (Depends on: postgres healthy, redis healthy)
      └─ docker run custom-php
         ├─ Build image from Dockerfile
         ├─ Execute entrypoint.sh:
         │  1. Wait for postgres:5432 ready
         │  2. Run migrations (if ARTISAN_MIGRATE=true)
         │  3. composer install (if no vendor/)
         │  4. php artisan config:cache
         │  5. php artisan route:cache
         │  6. php artisan view:cache
         │  7. Start supervisord (manages workers/scheduler)
         │  8. Start php-fpm
         ├─ Start on port 9000 (internal)
         └─ Health check ✓

3. Start Nginx (Depends on: php and node)
   └─ docker run nginx:alpine
      ├─ Load configuration
      ├─ Start on port 80, 443
      ├─ Begin accepting connections
      └─ Health check ✓

4. All Services Ready
   └─ Application accessible at http://localhost
      Email UI at http://localhost:8025
      Vite HMR at http://localhost:5173
```

---

## Performance Characteristics

```
Container Startup Times (from docker compose up -d):
- PostgreSQL:   5-10 seconds
- Redis:        2-3 seconds
- Mailpit:      1-2 seconds
- Node.js:      10-20 seconds (first build)
- PHP-FPM:      15-30 seconds (migrations, caching)
- Nginx:        1-2 seconds
────────────────────────────────
Total:          ~35-60 seconds (first time)

Subsequent Starts: 15-25 seconds (containers already built)

Request Latency:
- Static files: 1-5ms
- PHP via Nginx: 50-200ms (depending on operation)
- Database query: 10-50ms
- Cache hit: 1-5ms
- Queue job: immediate (async)

Memory Usage (Typical):
- Nginx:        ~10MB
- PHP-FPM:      ~50-100MB (varies with app)
- Node:         ~150-200MB (React + Vite)
- PostgreSQL:   ~100-200MB
- Redis:        ~10-50MB (varies with data)
- Mailpit:      ~20-30MB
────────────────
Total:          ~350-600MB

Docker Desktop Allocation:
Recommended:
- CPU: 4 cores
- Memory: 8GB
- Disk: 20GB available
```

---

## Security Model

```
┌─ Container Isolation
│  • Each service runs in separate container
│  • Cannot access host filesystem directly
│  • Cannot access other containers except via network
│  • Explicit port mapping required
│
├─ Network Security
│  • Services communicate via private network
│  • Only ports in docker-compose.yml exposed
│  • No direct access to internal ports
│  • Default deny-all for unmapped ports
│
├─ Data Protection
│  • Sensitive files (.env) never in image
│  • Environment variables injected at runtime
│  • Database passwords from env vars
│  • No secrets in version control
│
├─ File Permissions
│  • www-data user for PHP processes
│  • Proper file ownership set
│  • Storage/cache directories writable
│  • Public files read-only where possible
│
└─ Production Considerations
   • Set APP_DEBUG=false
   • Use strong DB passwords
   • Enable HTTPS (SSL certificates)
   • Implement rate limiting
   • Use environment-specific .env files
   • Enable security headers (already configured)
```

---

## Scaling Concepts (Future)

```
Current Single-Machine Setup:
┌──────────────────────┐
│   Docker Compose     │
│   (Local Dev)        │
│                      │
│  ┌──────────────┐   │
│  │  All Services │   │
│  │  Same Machine │   │
│  └──────────────┘   │
└──────────────────────┘

Potential Scaling Path:
1. Docker Swarm (local cluster)
   • Multiple machines
   • Service replication
   • Load balancing

2. Kubernetes (advanced)
   • Multiple pods
   • Auto-scaling
   • Service mesh
   • Persistent storage

3. Managed Services (cloud)
   • AWS ECS / Fargate
   • Google Cloud Run
   • Azure Container Instances
   • Services handled: DB, Cache, Email, etc.

Current setup is easily deployable to any of these platforms
without significant code changes.
```

---

## Monitoring & Debugging Points

```
View Logs:
├─ docker compose logs -f              # All services
├─ docker compose logs -f php          # PHP errors, warnings
├─ docker compose logs -f nginx        # Request logs
├─ docker compose logs -f postgres     # Database logs
├─ docker compose logs -f redis        # Cache/queue logs
└─ docker compose logs -f node         # Vite dev server

Access Containers:
├─ docker compose exec php bash        # Interactive shell
├─ docker compose exec node sh         # Node container
├─ docker compose exec postgres psql   # PostgreSQL CLI
└─ docker compose exec redis redis-cli # Redis CLI

Performance Metrics:
├─ docker stats                        # Real-time stats
├─ docker inspect <container>          # Container details
└─ docker compose ps                   # Service status

Application Monitoring:
├─ /health endpoint (Nginx)            # Health check
├─ php artisan queue:list              # Queue status
├─ php artisan horizon                 # Queue dashboard
├─ http://localhost:8025               # Email testing
└─ Database direct tools               # DBeaver, pgAdmin
```

---

This architecture provides:
✅ **Development Speed** - Hot reload, fast iteration
✅ **Production Parity** - Mirrors real infrastructure
✅ **Scalability** - Easy to add services
✅ **Maintainability** - Clear separation of concerns
✅ **Debugging** - Full access to all layers
✅ **Reliability** - Health checks, auto-restart

**Status: READY FOR DEVELOPMENT** 🚀
