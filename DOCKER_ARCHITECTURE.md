# Docker Development Environment Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Host Machine (Local)                          │
│                                                                       │
│  Requirements: Docker Desktop, Git, VS Code                         │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              Volumes                    Network Bridge
                    │                           │
    ┌───────────────┼───────────────┐          │
    │               │               │          │
    ▼               ▼               ▼          ▼
  
┌──────────────────────────────────────────────────────────────────────────────┐
│                    Docker Compose Environment                                 │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Reverse Proxy: Nginx (Port 80, 443)                                   │  │
│  │ - Routes /api/* → PHP-FPM                                             │  │
│  │ - Routes /* → Nginx for static files & SPA                           │  │
│  │ - Hot reload proxy for Vite (http://node:5173)                       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                 │                                            │
│        ┌────────────────────────┼────────────────────────┐                   │
│        │                        │                        │                   │
│  ┌─────▼────────┐        ┌──────▼──────┐        ┌───────▼──────┐            │
│  │  PHP-FPM 8.4 │        │   Node 22   │        │  PostgreSQL  │            │
│  │              │        │             │        │   17         │            │
│  │ - Artisan    │        │ - Vite Dev  │        │              │            │
│  │ - Laravel    │        │ - Hot reload│        │ - Persistence│            │
│  │ - Queue      │        │ - Build     │        │ - Port 5432  │            │
│  │ - Scheduler  │        │ - Port 5173 │        │              │            │
│  │ - Horizon    │        │ (http://*)  │        └──────────────┘            │
│  └──────────────┘        └─────────────┘                                    │
│        │                                                                     │
│        │                      ┌──────────────┐       ┌──────────────┐       │
│        └──────────────────────│    Redis     │       │   Mailpit    │       │
│                               │              │       │              │       │
│                               │ - Cache      │       │ - SMTP       │       │
│                               │ - Sessions   │       │ - Web UI     │       │
│                               │ - Queues     │       │ - Port 1025  │       │
│                               │ - Port 6379  │       │ - Port 8025  │       │
│                               └──────────────┘       └──────────────┘       │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

All services communicate via Docker network "laracore-network"
```

## Service Breakdown

### 1. **Nginx (Reverse Proxy & Web Server)**
- **Port**: 80 (HTTP), 443 (HTTPS - optional for local)
- **Role**: Entry point for all requests
- **Configuration**: 
  - Static files & front-end assets from `/public`
  - API requests to PHP-FPM via unix socket
  - Vite dev server proxy for hot reload
- **Volume**: Mounts `src/` directory

### 2. **PHP-FPM 8.4 (Application Server)**
- **Port**: 9000 (FastCGI, internal only)
- **Role**: Process Laravel application
- **Capabilities**:
  - Artisan commands
  - Queue workers (supervisord-managed in container)
  - Scheduler (cron jobs)
  - Horizon (queue UI)
- **Volume**: Mounts `src/` directory
- **Extensions**: All Laravel 12 requirements pre-installed

### 3. **Node.js 22 (Frontend Toolchain)**
- **Port**: 5173 (Vite dev server)
- **Role**: Frontend development & build
- **Features**:
  - Vite dev server with hot module replacement (HMR)
  - React compilation
  - Asset bundling
- **Volume**: Mounts `src/` directory for `resources/` access

### 4. **PostgreSQL 17 (Database)**
- **Port**: 5432
- **Role**: Primary database
- **Features**:
  - Data persistence via named volume
  - Automatic initialization from SQL scripts
- **Volume**: Named volume `postgres_data`

### 5. **Redis (Cache & Queue Store)**
- **Port**: 6379
- **Role**: Caching, session storage, queue backend
- **Features**:
  - In-memory data store
  - Used by Laravel for:
    - Cache driver
    - Session storage
    - Queue jobs
- **Volume**: Optional (can be volatile or persistent)

### 6. **Mailpit (Email Testing)**
- **Port**: 1025 (SMTP)
- **Port**: 8025 (Web UI at http://localhost:8025)
- **Role**: Capture and view emails in development
- **Features**:
  - All emails sent to localhost:1025 are captured
  - View in web browser
  - Perfect for development & testing

## Volume Strategy

### Bind Mounts (Development)
```
src/                    → /var/www/html (Read-write for development)
docker/nginx            → /etc/nginx (Nginx configuration)
docker/php              → /usr/local/etc/php (PHP configuration)
docker/scripts          → /scripts (Startup scripts)
```

### Named Volumes (Persistence)
```
postgres_data           → /var/lib/postgresql/data (Database)
redis_data (optional)   → /data (Redis persistence)
```

## Network Architecture

- **Network Name**: `laracore-network` (bridge)
- **Service Discovery**: Docker internal DNS (hostname = service name)
- **Internal Communication**:
  - PHP connects to `postgres:5432`
  - PHP connects to `redis:6379`
  - Nginx connects to `php:9000`
  - Node accessible at `node:5173` from nginx

## Port Mapping

| Service      | Container Port | Host Port | Purpose                           |
|--------------|----------------|-----------|-----------------------------------|
| Nginx        | 80             | 80        | HTTP traffic                      |
| Nginx        | 443            | 443       | HTTPS (optional)                  |
| Vite (Node)  | 5173           | 5173      | Frontend dev server + HMR         |
| PostgreSQL   | 5432           | 5432      | Database access                   |
| Redis        | 6379           | 6379      | Cache/queue access                |
| Mailpit SMTP | 1025           | 1025      | Email capture                     |
| Mailpit Web  | 8025           | 8025      | Email UI (http://localhost:8025)  |

## Development Workflow

### Container Startup (One Command)
```bash
docker compose up -d
```

### Run Artisan Commands
```bash
docker compose exec php artisan migrate
docker compose exec php artisan tinker
docker compose exec php artisan queue:work
```

### Run Composer
```bash
docker compose exec php composer require vendor/package
docker compose exec php composer install
```

### Run NPM Commands
```bash
docker compose exec node npm install
docker compose exec node npm run dev
```

### View Logs
```bash
docker compose logs -f php
docker compose logs -f node
docker compose logs -f nginx
```

### Access Services
- **Application**: http://localhost
- **Email UI**: http://localhost:8025
- **Database**: localhost:5432 (via database tools)
- **Redis**: localhost:6379 (via redis CLI)

## Environment Variables

Key files:
- `.env` - Main Laravel environment
- `.env.docker` - Docker-specific overrides
- `docker-compose.yml` - Service definitions and defaults

Critical Laravel settings for Docker:
```
DB_HOST=postgres              (not localhost)
DB_CONNECTION=pgsql
REDIS_HOST=redis              (not localhost)
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS=dev@laracore.test
```

## Production-Like Architecture

This setup mirrors production:
- Nginx as reverse proxy (like AWS ELB)
- PHP-FPM for application (like Lambda or ECS)
- PostgreSQL as managed database (like AWS RDS)
- Redis for cache/sessions (like AWS ElastiCache)
- Queue workers separate from web server
- Consistent environment variables

## File Structure
```
/Code/laracore/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   ├── Dockerfile
│   │   ├── php.ini
│   │   └── supervisord.conf
│   ├── node/
│   │   └── Dockerfile
│   └── scripts/
│       ├── entrypoint.sh
│       └── wait-for-postgres.sh
├── src/                 (Laravel app)
├── docker-compose.yml
├── .env.docker
└── DOCKER_ARCHITECTURE.md
```
