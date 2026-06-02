FROM node:22-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    bash

# Copy only package files
COPY src/package.json src/package-lock.json* src/pnpm-lock.yaml* src/yarn.lock* ./

# Install dependencies
RUN npm install --legacy-peer-deps && \
    chmod -R +x node_modules/.bin/

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev"]
