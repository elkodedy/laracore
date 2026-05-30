# LaraCore Folder Structure

## Complete Project Layout

```
/Code/laracore/
│
├── 📄 docker-compose.yml              # Main orchestration file - defines all services
├── 📄 .env.docker                     # Docker environment variables template
├── 📄 DOCKER_ARCHITECTURE.md          # System architecture & design documentation
├── 📄 DOCKER_DEVELOPMENT_GUIDE.md     # Comprehensive development guide & commands
├── 📄 QUICK_REFERENCE.md              # Quick command reference (this file)
├── 📄 README.md                       # Project README
│
├── 📁 docker/                         # Docker configuration files
│   ├── 📁 nginx/
│   │   └── 📄 default.conf            # Nginx configuration - routes, proxies, caching
│   │                                   # - Routes to PHP for API
│   │                                   # - Proxies to Node for Vite HMR
│   │                                   # - Serves static files
│   │
│   ├── 📁 php/
│   │   ├── 📄 Dockerfile              # PHP 8.4-FPM image definition
│   │   │                              # - Multi-stage build
│   │   │                              # - Includes all Laravel extensions
│   │   │                              # - Installs Composer
│   │   │                              # - Installs Supervisor
│   │   │
│   │   ├── 📄 php.ini                 # PHP configuration
│   │   │                              # - Memory limits
│   │   │                              # - OPcache settings
│   │   │                              # - Error logging
│   │   │                              # - Session storage (Redis)
│   │   │
│   │   ├── 📄 supervisord.conf        # Supervisor process manager config
│   │   │                              # - Manages queue workers
│   │   │                              # - Manages scheduler
│   │   │                              # - Can manage Horizon
│   │   │
│   │   └── 📄 entrypoint.sh           # Container startup script
│   │                                   # - Waits for PostgreSQL
│   │                                   # - Runs migrations (if enabled)
│   │                                   # - Caches configuration
│   │                                   # - Starts Supervisor
│   │
│   ├── 📁 node/
│   │   └── 📄 Dockerfile              # Node.js 22 image definition
│   │                                   # - Installs npm/yarn/pnpm support
│   │                                   # - Runs Vite dev server
│   │                                   # - Enables HMR for React
│   │
│   └── 📁 scripts/
│       └── 📄 wait-for-postgres.sh    # Utility script
│                                       # - Waits for PostgreSQL service startup
│                                       # - Used by PHP container initialization
│
├── 📁 src/                            # Laravel application code
│   ├── 📄 artisan                     # Laravel CLI
│   ├── 📄 composer.json               # PHP dependencies
│   ├── 📄 package.json                # Node.js dependencies
│   ├── 📄 vite.config.js              # Vite configuration
│   │
│   ├── 📁 app/
│   │   ├── 📁 Http/
│   │   │   └── 📁 Controllers/        # API controllers
│   │   │
│   │   ├── 📁 Models/
│   │   │   └── 📄 User.php            # Eloquent models
│   │   │
│   │   └── 📁 Providers/
│   │       └── 📄 AppServiceProvider.php
│   │
│   ├── 📁 bootstrap/
│   │   ├── 📄 app.php                 # Application bootstrap
│   │   ├── 📄 providers.php           # Service provider loader
│   │   │
│   │   └── 📁 cache/
│   │       ├── 📄 packages.php        # Cached packages (generated)
│   │       └── 📄 services.php        # Cached services (generated)
│   │
│   ├── 📁 config/                     # Configuration files
│   │   ├── 📄 app.php                 # Application config
│   │   ├── 📄 auth.php                # Authentication config
│   │   ├── 📄 cache.php               # Cache settings (Redis)
│   │   ├── 📄 database.php            # Database settings (PostgreSQL)
│   │   ├── 📄 filesystems.php         # Filesystem config
│   │   ├── 📄 logging.php             # Logging setup
│   │   ├── 📄 mail.php                # Mail config (Mailpit)
│   │   ├── 📄 queue.php               # Queue settings (Redis)
│   │   ├── 📄 services.php            # External services
│   │   └── 📄 session.php             # Session config (Redis)
│   │
│   ├── 📁 database/
│   │   ├── 📁 factories/
│   │   │   └── 📄 UserFactory.php     # Model factories for testing
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 📄 0001_01_01_000000_create_users_table.php
│   │   │   ├── 📄 0001_01_01_000001_create_cache_table.php
│   │   │   └── 📄 0001_01_01_000002_create_jobs_table.php
│   │   │
│   │   └── 📁 seeders/
│   │       └── 📄 DatabaseSeeder.php
│   │
│   ├── 📁 public/
│   │   ├── 📄 index.php               # Application entry point (served by Nginx)
│   │   └── 📄 robots.txt              # SEO/crawler rules
│   │
│   ├── 📁 resources/
│   │   ├── 📁 css/
│   │   │   └── 📄 app.css             # Global CSS
│   │   │
│   │   ├── 📁 js/
│   │   │   └── 📄 app.js              # React entry point (Vite)
│   │   │
│   │   └── 📁 views/
│   │       └── 📄 welcome.blade.php   # Blade template for SPA shell
│   │
│   ├── 📁 routes/
│   │   ├── 📄 api.php                 # API routes (JSON responses)
│   │   ├── 📄 web.php                 # Web routes (HTML responses)
│   │   └── 📄 console.php             # Artisan commands
│   │
│   ├── 📁 storage/                    # File storage & logs
│   │   ├── 📁 app/
│   │   │   ├── 📁 private/            # Non-public files
│   │   │   └── 📁 public/             # Publicly accessible files
│   │   │
│   │   ├── 📁 framework/
│   │   │   ├── 📁 cache/              # Framework cache
│   │   │   ├── 📁 sessions/           # Session files (not used, using Redis)
│   │   │   ├── 📁 testing/            # Test framework files
│   │   │   └── 📁 views/              # Compiled view cache
│   │   │
│   │   └── 📁 logs/
│   │       └── 📄 laravel.log         # Application logs
│   │
│   ├── 📁 tests/
│   │   ├── 📄 TestCase.php            # Base test class
│   │   │
│   │   ├── 📁 Feature/
│   │   │   └── 📄 ExampleTest.php     # Feature tests (full app)
│   │   │
│   │   └── 📁 Unit/
│   │       └── 📄 ExampleTest.php     # Unit tests (isolated)
│   │
│   └── 📁 vendor/                     # Composer packages (excluded from repo)
│       ├── 📁 autoload.php            # Composer autoloader
│       ├── 📁 bin/                    # Executable binaries
│       │   ├── phpunit               # PHPUnit test runner
│       │   ├── artisan               # Laravel CLI symlink
│       │   └── composer              # Composer symlink
│       │
│       └── [Other vendor packages...]
│
└── 📁 steps/                          # Setup instructions & roadmap
    ├── 📄 setup.md                    # Setup documentation
    ├── 📄 tech-stack.md               # Technology stack details
    ├── 📄 0-docker-first.md           # Docker setup instructions
    ├── 📄 1-setup-foundation.md       # Initial Laravel setup
    ├── 📄 2-install-core-packages.md  # Core package installation
    ├── 📄 3-shadcn-ui.md              # UI library setup
    ├── 📄 4-authentication-module.md  # Auth implementation
    ├── 📄 5-authorization.md          # Authorization setup
    ├── 📄 6-application-layout.md     # Application layout
    ├── 📄 7-core-components.md        # Component library
    ├── 📄 8-notification-and-toast.md # Notifications UI
    ├── 📄 9-user-management-module.md # User management
    └── 📄 10-production-ready.md      # Production checklist
```

## Key Directories

### `/docker` - Docker Infrastructure
Contains all Docker-related configuration:
- **nginx/**: Web server reverse proxy configuration
- **php/**: PHP application server Dockerfile and config
- **node/**: Node.js Vite development server Dockerfile
- **scripts/**: Utility scripts for container initialization

### `/src` - Laravel Application
Your actual application code:
- **app/**: Business logic (Models, Controllers)
- **config/**: Configuration files
- **database/**: Migrations, seeders, factories
- **resources/**: Frontend code (React, CSS)
- **routes/**: API and web route definitions
- **storage/**: File uploads, logs, cache
- **tests/**: Test suites

### `/steps` - Documentation & Roadmap
Progressive setup instructions for the application.

## Environment Files

### `.env.docker`
Template environment variables for Docker development. Copy this to `.env`:
```bash
cp .env.docker .env
```

Includes:
- Database connection (PostgreSQL)
- Redis settings (cache, sessions, queues)
- Mail settings (Mailpit)
- Application configuration

## Docker Service Mapping

```
┌─ Nginx (Port 80)
│  ├─ Static files from /src/public
│  ├─ API requests → PHP-FPM
│  └─ Vite HMR → Node (5173)
│
├─ PHP-FPM (Port 9000, internal)
│  ├─ Processes /src Laravel code
│  ├─ Connects to PostgreSQL
│  ├─ Connects to Redis
│  └─ Manages queues & scheduler via Supervisor
│
├─ Node (Port 5173)
│  ├─ Vite dev server
│  ├─ React HMR
│  └─ Watches /src/resources
│
├─ PostgreSQL (Port 5432)
│  └─ Data stored in postgres_data volume
│
├─ Redis (Port 6379)
│  ├─ Cache driver
│  ├─ Session storage
│  └─ Queue storage
│
└─ Mailpit (Port 1025/8025)
   ├─ SMTP server
   └─ Web UI for email testing
```

## Volume Strategy

### Bind Mounts (Development Files)
- `/docker/` → Container configuration (read-only)
- `/src/` → Application code (read-write, delegated for performance)
- `/docker/scripts/` → Initialization scripts

### Named Volumes (Data Persistence)
- `postgres_data` → PostgreSQL database files
- `redis_data` → Redis snapshot files

Named volumes provide better performance than bind mounts for large datasets.

## Build Layers

### PHP Container
1. Base: `php:8.4-fpm-alpine`
2. System packages (git, curl, etc.)
3. PHP extensions (pdo, redis, etc.)
4. Composer installation
5. Configuration files
6. Supervisor setup
7. Entrypoint script

### Node Container
1. Base: `node:22-alpine`
2. System packages
3. Dependency installation (npm/yarn/pnpm)
4. Application code
5. Vite startup

## File Sync & Performance

- **delegated**: Files modified on host sync to container immediately
- Anonymous volumes (`/var/www/html/node_modules`): Prevents sync overhead
- Alpine images: Smaller, faster containers
- Multi-stage builds: Optimized final image sizes

---

**See also:**
- [DOCKER_ARCHITECTURE.md](DOCKER_ARCHITECTURE.md) - System design
- [DOCKER_DEVELOPMENT_GUIDE.md](DOCKER_DEVELOPMENT_GUIDE.md) - Commands & workflows
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick command copy-paste
