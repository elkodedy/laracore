# Multi-stage build for Laravel PHP-FPM
FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    curl \
    wget \
    git \
    zip \
    unzip \
    supervisor \
    postgresql-client \
    postgresql-dev \
    libxml2-dev \
    oniguruma-dev \
    redis \
    bash \
    dcron \
    && rm -rf /var/cache/apk/*

# Install PHP extensions required by Laravel
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    bcmath \
    fileinfo \
    mbstring \
    xml \
    exif

# Install additional useful extensions
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy PHP configuration
COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini

# Copy supervisord configuration
COPY docker/php/supervisord.conf /etc/supervisord.conf

# Copy entrypoint script
COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create necessary directories
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/bootstrap/cache \
    && mkdir -p /var/log/supervisor

RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD php -r "exit(0);"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]