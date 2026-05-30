FROM node:22-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    bash

# Copy package files from src/
COPY src/package.json src/package-lock.json* src/pnpm-lock.yaml* src/yarn.lock* ./

# Install dependencies (support npm, yarn, pnpm)
RUN if [ -f pnpm-lock.yaml ]; then \
        npm install -g pnpm && pnpm install; \
    elif [ -f yarn.lock ]; then \
        npm install -g yarn && yarn install; \
    else \
        npm install; \
    fi

# Copy application files from src/
COPY src/ .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server with HMR support for Docker
CMD ["npm", "run", "dev"]
