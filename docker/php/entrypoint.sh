#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
/scripts/wait-for-postgres.sh postgres 5432 300
echo "✓ PostgreSQL is ready"

# Install composer dependencies if not already done
if [ ! -d "/var/www/html/vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction  # ← hapus --no-dev untuk development
fi

# Generate app key if not set
if [ -z "$(php artisan key:show 2>/dev/null | grep 'base64')" ]; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Run migrations if ARTISAN_MIGRATE env var is set
if [ "${ARTISAN_MIGRATE}" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

# Cache hanya untuk production
if [ "${APP_ENV}" = "production" ]; then
    echo "Caching for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    # Clear cache untuk development
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
fi

# Fix permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "✓ Laravel is ready"

# Start supervisord (manages php-fpm and other processes)
exec /usr/bin/supervisord -c /etc/supervisord.conf