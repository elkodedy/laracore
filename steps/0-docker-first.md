You are a senior DevOps and Laravel architect.

I want to build a Laravel 12 + Inertia React application.

IMPORTANT:

The development environment MUST be fully Dockerized.

Developers should NOT need to install:

* PHP
* Composer
* Node.js
* PostgreSQL
* Redis
* Nginx

The only requirements on the host machine are:

* Docker Desktop
* Git
* VS Code

Create a complete local development environment.

Requirements:

Services:

1. nginx
2. php-fpm (PHP 8.4)
3. node 22
4. postgres 17
5. redis
6. mailpit

Features:

* Hot reload for React/Vite
* Laravel queue support
* Scheduler support
* Horizon support
* Redis cache support
* PostgreSQL persistence
* Mail testing using Mailpit

Create:

* docker-compose.yml
* Dockerfiles
* nginx configuration
* volume strategy
* environment variables
* startup scripts

Requirements:

* Fast container startup
* Production-like architecture
* Multi-stage Dockerfiles where appropriate
* Clean folder structure

Output:

1. Architecture diagram
2. Folder structure
3. Docker files
4. Nginx configuration
5. Environment variables
6. Commands to start development
7. Commands to run artisan
8. Commands to run composer
9. Commands to run npm
10. Explanation of every service

Do NOT install Laravel packages yet.

Wait for approval before continuing.
