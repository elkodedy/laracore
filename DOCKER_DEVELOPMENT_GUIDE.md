# LaraCore - Docker Development Guide

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git
- VS Code (optional)

### Initial Setup (One Time)

1. **Clone/Navigate to the project**
   ```bash
   cd /Code/laracore
   ```

2. **Copy environment file**
   ```bash
   cp .env.docker .env
   ```

3. **Start all services**
   ```bash
   docker compose up -d
   ```

4. **Wait for services to be ready** (30-60 seconds)
   ```bash
   docker compose logs -f
   ```

5. **Access the application**
   - **Application**: http://localhost
   - **Email UI**: http://localhost:8025
   - **API**: http://localhost/api

---

## Development Workflow

### Start Development Environment

```bash
# Start all services in background
docker compose up -d

# View logs from all services
docker compose logs -f

# View logs from specific service
docker compose logs -f php
docker compose logs -f nginx
docker compose logs -f node
docker compose logs -f postgres
```

### Stop Development Environment

```bash
# Stop all services (data persists)
docker compose down

# Stop and remove all data
docker compose down -v
```

---

## Running Laravel Commands

### Artisan Commands

```bash
# Run any artisan command
docker compose exec php artisan <command>

# Examples:
docker compose exec php artisan migrate              # Run migrations
docker compose exec php artisan migrate:fresh        # Fresh migration
docker compose exec php artisan seed:seed            # Run seeders
docker compose exec php artisan tinker               # Open tinker REPL
docker compose exec php artisan make:model Post      # Generate model
docker compose exec php artisan make:controller PostController
docker compose exec php artisan make:migration create_posts_table
docker compose exec php artisan route:list           # List all routes
docker compose exec php artisan optimize             # Optimize for production
```

### Database Operations

```bash
# Access PostgreSQL directly
docker compose exec postgres psql -U postgres -d laracore

# Common PostgreSQL commands in psql:
# \dt              - List tables
# \d table_name    - Describe table
# SELECT * FROM users;  - Query data
# \q               - Exit psql
```

### Cache & Queue

```bash
# Clear application cache
docker compose exec php artisan cache:clear

# Clear all caches
docker compose exec php artisan optimize:clear

# Flush Redis
docker compose exec redis redis-cli FLUSHALL

# Monitor queue workers
docker compose exec php artisan queue:work --sleep=3 --tries=3

# Process queued jobs once
docker compose exec php artisan queue:work --stop-when-empty
```

---

## Running Composer Commands

### Package Management

```bash
# Install dependencies
docker compose exec php composer install

# Require a new package
docker compose exec php composer require vendor/package

# Require a dev package
docker compose exec php composer require --dev vendor/package

# Update dependencies
docker compose exec php composer update

# Update one package
docker compose exec php composer update vendor/package

# Remove a package
docker compose exec php composer remove vendor/package

# Show installed packages
docker compose exec php composer show

# Validate composer.json
docker compose exec php composer validate

# Optimize autoloader
docker compose exec php composer dump-autoload -o
```

---

## Running NPM/Node Commands

### Frontend Development

```bash
# Install frontend dependencies
docker compose exec node npm install

# Start development server with hot reload
docker compose exec node npm run dev

# Build for production
docker compose exec node npm run build

# Run TypeScript compiler
docker compose exec node npm run build

# Install a package
docker compose exec node npm install package-name

# Install dev package
docker compose exec node npm install --save-dev package-name

# Update packages
docker compose exec node npm update

# Check outdated packages
docker compose exec node npm outdated
```

**Note:** The Node service automatically runs `npm run dev` which:
- Starts Vite dev server on port 5173
- Enables hot module replacement (HMR)
- Watches for file changes in resources/

---

## Running Database Commands

### PostgreSQL

```bash
# Access database CLI
docker compose exec postgres psql -U postgres -d laracore

# Run SQL file
docker compose exec postgres psql -U postgres -d laracore -f /path/to/file.sql

# Create backup
docker compose exec postgres pg_dump -U postgres -d laracore > backup.sql

# Restore from backup
docker compose exec postgres psql -U postgres -d laracore < backup.sql

# List databases
docker compose exec postgres psql -U postgres -l

# List tables
docker compose exec postgres psql -U postgres -d laracore -c "\dt"
```

### Redis

```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Common commands:
# PING              - Test connection
# GET key           - Get value
# SET key value     - Set value
# DEL key           - Delete key
# KEYS *            - List all keys
# FLUSHALL          - Clear all data
# DBSIZE            - Number of keys
# INFO              - Server info
```

---

## Running Tests

### PHPUnit

```bash
# Run all tests
docker compose exec php artisan test

# Run specific test file
docker compose exec php artisan test tests/Feature/ExampleTest.php

# Run with verbose output
docker compose exec php artisan test --verbose

# Run with coverage
docker compose exec php artisan test --coverage

# Run only feature tests
docker compose exec php artisan test --testsuite=Feature

# Run only unit tests
docker compose exec php artisan test --testsuite=Unit
```

### Jest/Vitest (if using)

```bash
# Run frontend tests
docker compose exec node npm run test

# Watch mode
docker compose exec node npm run test:watch

# Coverage
docker compose exec node npm run test:coverage
```

---

## Service Management

### View Service Status

```bash
# Show all running containers
docker compose ps

# Show detailed container info
docker compose ps -a

# Check service health
docker compose ps --no-trunc
```

### Inspect Services

```bash
# View service logs
docker compose logs <service_name>

# Follow logs
docker compose logs -f <service_name>

# Last 50 lines
docker compose logs -n 50 <service_name>

# Logs since timestamp
docker compose logs --since 2024-05-30T10:00:00 <service_name>
```

### Execute Commands in Containers

```bash
# Generic command
docker compose exec <service> <command>

# Examples:
docker compose exec php bash                  # Shell into PHP container
docker compose exec node sh                   # Shell into Node container
docker compose exec postgres bash             # Shell into PostgreSQL container
docker compose exec nginx sh                  # Shell into Nginx container
```

---

## Accessing Services

### Web Services

| Service       | URL                 | Purpose                      |
|---------------|---------------------|------------------------------|
| App           | http://localhost    | Main application             |
| Email UI      | http://localhost:8025 | View captured emails         |
| API Base      | http://localhost/api | API endpoints                |
| Health Check  | http://localhost/health | Service health              |

### Direct Connection (from host)

| Service     | Host              | Port | Connection            |
|-------------|-------------------|------|----------------------|
| PostgreSQL  | localhost         | 5432 | pgAdmin, DBeaver, etc |
| Redis       | localhost         | 6379 | Redis Desktop, CLI    |
| Mailpit     | localhost         | 8025 | Web browser           |

**Connect with your favorite database tools:**
```bash
# PostgreSQL
Host: localhost
Port: 5432
User: postgres
Password: secret
Database: laracore

# Redis
Host: localhost
Port: 6379
```

---

## Common Development Tasks

### Fresh Development Setup

```bash
# Start services
docker compose up -d

# Wait for services (check logs)
docker compose logs -f

# Run migrations
docker compose exec php artisan migrate:fresh

# Seed database
docker compose exec php artisan db:seed

# Install frontend deps
docker compose exec node npm install

# Build assets
docker compose exec node npm run build
```

### Enable Auto-Migrations

To automatically run migrations when the container starts, set in `.env`:
```bash
ARTISAN_MIGRATE=true
```

### Monitor Queue Processing

In a separate terminal:
```bash
docker compose exec php artisan queue:work --sleep=3 --tries=3
```

To watch worker logs:
```bash
docker compose logs -f php | grep -i queue
```

### Run Scheduler Manually

```bash
# Run schedule once
docker compose exec php artisan schedule:run

# Run schedule every minute (simulates cron)
docker compose exec php artisan schedule:work
```

### Check Supervisor Status (queue/scheduler)

Supervisord runs inside the PHP container and manages:
- Queue workers
- Scheduler
- Horizon (if installed)

```bash
# Access container
docker compose exec php bash

# Inside container:
supervisorctl status
supervisorctl restart laravel-worker
supervisorctl restart laravel-scheduler
supervisorctl tail laravel-worker
```

---

## Debugging

### Debug PHP with Xdebug (if configured)

In `.env`:
```bash
XDEBUG_MODE=develop,debug
XDEBUG_CONFIG=client_host=host.docker.internal
```

VS Code `.vscode/launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "port": 9003,
            "pathMapping": {
                "/var/www/html": "${workspaceFolder}/src"
            }
        }
    ]
}
```

### View Container Filesystem

```bash
# Copy file from container
docker compose cp php:/var/www/html/storage/logs/laravel.log ./

# Copy to container
docker compose cp ./file.txt php:/var/www/html/storage/
```

### Monitor Resource Usage

```bash
# View CPU, memory, network stats
docker stats
```

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose logs

# Check specific service
docker compose logs php
docker compose logs postgres

# Rebuild images
docker compose down
docker compose build --no-cache
docker compose up -d
```

### PostgreSQL Connection Failed

```bash
# Check if service is healthy
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Verify connection
docker compose exec postgres psql -U postgres -c "SELECT 1"
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :80
lsof -i :5432

# Stop containers and services using ports
docker compose down
sudo killall nginx  # if running locally
```

### Slow File Sync (macOS/Windows)

Docker Desktop sync can be slow. To improve:

1. Add `delegated` volume mount (already in compose file):
   ```yaml
   volumes:
     - ./src:/var/www/html:delegated
   ```

2. Or use named volumes for better performance:
   ```yaml
   volumes:
     - app:/var/www/html
   
   volumes:
     app:
       driver: local
   ```

### Memory Issues

If services crash or are slow:
```bash
# Increase Docker Desktop resources
# Docker Desktop → Preferences → Resources
# Set CPU: 4+
# Set Memory: 8GB+
```

### Container Won't Stop

```bash
# Force kill
docker compose kill

# Remove all containers
docker compose rm -f

# Clean up everything
docker compose down --volumes
```

---

## Performance Tips

### Development Optimization

1. **Use delegated mounts** (already configured)
   ```yaml
   volumes:
     - ./src:/var/www/html:delegated
   ```

2. **Enable OPcache** (already configured in php.ini)

3. **Keep node_modules out of sync**
   ```yaml
   volumes:
     - /var/www/html/node_modules  # Anonymous volume
   ```

4. **Use Alpine images** (lighter, already used)

5. **Exclude files from sync**
   Create `.dockerignore`:
   ```
   node_modules/
   vendor/
   .git/
   .env
   storage/logs/*
   bootstrap/cache/*
   ```

---

## Environment Variables Reference

| Variable               | Default          | Description                                    |
|----------------------|------------------|------------------------------------------------|
| `APP_NAME`           | LaraCore         | Application name                               |
| `APP_ENV`            | local            | Environment (local/testing/production)         |
| `APP_DEBUG`          | true             | Debug mode (development: true, prod: false)    |
| `APP_URL`            | http://localhost | Application URL                                |
| `DB_HOST`            | postgres         | Database host                                  |
| `DB_DATABASE`        | laracore         | Database name                                  |
| `DB_USERNAME`        | postgres         | Database user                                  |
| `DB_PASSWORD`        | secret           | Database password                              |
| `REDIS_HOST`         | redis            | Redis host                                     |
| `CACHE_DRIVER`       | redis            | Cache driver                                   |
| `SESSION_DRIVER`     | redis            | Session driver                                 |
| `QUEUE_CONNECTION`   | redis            | Queue driver                                   |
| `MAIL_HOST`          | mailpit          | Mail server host                               |
| `MAIL_PORT`          | 1025             | Mail server port                               |
| `MAIL_FROM_ADDRESS`  | dev@laracore.test | From email address                             |

---

## Useful Aliases

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# LaraCore aliases
alias lc='cd /Code/laracore'
alias lcu='docker compose up -d'
alias lcd='docker compose down'
alias lclogs='docker compose logs -f'
alias lcphp='docker compose exec php'
alias lcnode='docker compose exec node'
alias lcdb='docker compose exec postgres psql -U postgres -d laracore'
alias lcredis='docker compose exec redis redis-cli'
alias lcmigrate='docker compose exec php artisan migrate'
alias lctest='docker compose exec php artisan test'
alias lcartisan='docker compose exec php artisan'
```

Then use:
```bash
lcu                              # Start services
lcu && sleep 10 && lcmigrate     # Start and migrate
lcphp artisan tinker             # Tinker session
```

---

## Next Steps

1. ✅ Docker environment is ready
2. ⏭️ Run `docker compose up -d` to start
3. ⏭️ Run `docker compose exec php composer install` 
4. ⏭️ Run `docker compose exec node npm install`
5. ⏭️ Run `docker compose exec php artisan migrate`
6. ⏭️ Visit http://localhost

**Happy coding! 🚀**
