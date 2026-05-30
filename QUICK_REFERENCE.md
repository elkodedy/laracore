# Quick Reference - LaraCore Docker Commands

## Essential Commands (Copy & Paste Ready)

### Start/Stop

```bash
# ✅ Start all services
docker compose up -d

# ⏹️ Stop all services
docker compose down

# 🔄 Restart services
docker compose restart

# 🏗️ Build images from scratch
docker compose build --no-cache && docker compose up -d
```

### Artisan (Laravel)

```bash
# Migrate database
docker compose exec php artisan migrate

# Fresh migration
docker compose exec php artisan migrate:fresh

# Seed database
docker compose exec php artisan db:seed

# Fresh + seed
docker compose exec php artisan migrate:fresh --seed

# Open REPL/Tinker
docker compose exec php artisan tinker

# Create model
docker compose exec php artisan make:model Post -m

# Create controller
docker compose exec php artisan make:controller PostController --model=Post

# Create migration
docker compose exec php artisan make:migration create_posts_table

# Run tests
docker compose exec php artisan test

# Clear cache
docker compose exec php artisan optimize:clear

# Run specific command
docker compose exec php artisan <command>
```

### Composer

```bash
# Install dependencies
docker compose exec php composer install

# Require new package
docker compose exec php composer require vendor/package

# Require dev package
docker compose exec php composer require --dev vendor/package

# Update composer
docker compose exec php composer update

# Validate
docker compose exec php composer validate
```

### NPM/Node

```bash
# Install dependencies
docker compose exec node npm install

# Add package
docker compose exec node npm install package-name

# Run dev (starts Vite)
docker compose exec node npm run dev

# Build for production
docker compose exec node npm run build

# Run tests
docker compose exec node npm run test
```

### Database

```bash
# Access PostgreSQL
docker compose exec postgres psql -U postgres -d laracore

# Run SQL file
docker compose exec postgres psql -U postgres -d laracore -f file.sql

# Backup database
docker compose exec postgres pg_dump -U postgres -d laracore > backup.sql

# Restore database
docker compose exec postgres psql -U postgres -d laracore < backup.sql
```

### Redis

```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Inside redis-cli:
# PING              - Test connection
# FLUSHALL          - Clear all data
# KEYS *            - List keys
# GET key           - Get value
# INFO              - Server info
```

### Logs & Debugging

```bash
# View all logs
docker compose logs -f

# Specific service
docker compose logs -f php
docker compose logs -f nginx
docker compose logs -f node
docker compose logs -f postgres
docker compose logs -f redis

# Last 100 lines
docker compose logs -n 100 php

# Since time
docker compose logs --since 10m php

# Container status
docker compose ps

# Resource usage
docker stats
```

### Container Access

```bash
# Shell into PHP container
docker compose exec php bash

# Shell into Node container
docker compose exec node sh

# Shell into PostgreSQL container
docker compose exec postgres bash

# View container filesystem
docker compose cp php:/var/www/html/storage/logs ./logs
```

### Database Credentials

```
Host: postgres (internal) or localhost (external)
Port: 5432
User: postgres
Password: secret
Database: laracore
```

### Web URLs

```
Application:    http://localhost
Email/Mailpit:  http://localhost:8025
API Base:       http://localhost/api
Health Check:   http://localhost/health
```

### Troubleshooting

```bash
# Rebuild everything from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d

# Check service health
docker compose ps

# View detailed logs
docker compose logs php | tail -50

# Force kill stuck container
docker compose kill

# Clean up everything
docker compose down --volumes --remove-orphans
```

## Initial Setup Checklist

- [ ] `cd /Code/laracore`
- [ ] `cp .env.docker .env`
- [ ] `docker compose up -d`
- [ ] Wait for services (view `docker compose logs`)
- [ ] `docker compose exec php composer install`
- [ ] `docker compose exec node npm install`
- [ ] `docker compose exec php artisan migrate`
- [ ] Visit http://localhost
- [ ] Check emails at http://localhost:8025

## Service Details

| Service    | Image            | Port    | URL                   |
|------------|------------------|---------|----------------------|
| Nginx      | nginx:alpine     | 80/443  | http://localhost     |
| PHP        | Custom 8.4       | 9000    | Internal only        |
| Node       | node:22-alpine   | 5173    | http://localhost:5173|
| PostgreSQL | postgres:17      | 5432    | localhost:5432       |
| Redis      | redis:7-alpine   | 6379    | localhost:6379       |
| Mailpit    | axllent/mailpit  | 1025/8025 | http://localhost:8025|

## Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdn='docker compose down'
alias dclogs='docker compose logs -f'
alias dcphp='docker compose exec php'
alias dcnode='docker compose exec node'
alias dcdb='docker compose exec postgres psql -U postgres -d laracore'
alias dcredis='docker compose exec redis redis-cli'
alias dcmigrate='docker compose exec php artisan migrate'
alias dcartisan='docker compose exec php artisan'
```

**Then use:** `dcup && dcmigrate` instead of full commands!
