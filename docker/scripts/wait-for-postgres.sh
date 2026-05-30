#!/bin/bash
# Wait for PostgreSQL to be ready

HOST=$1
PORT=$2
TIMEOUT=${3:-30}

echo "Waiting for PostgreSQL at $HOST:$PORT (timeout: ${TIMEOUT}s)..."

start_time=$(date +%s)
while true; do
    current_time=$(date +%s)
    elapsed=$((current_time - start_time))

    if [ $elapsed -gt $TIMEOUT ]; then
        echo "✗ Timeout waiting for PostgreSQL after ${TIMEOUT}s"
        exit 1
    fi

    if nc -z -v -w1 $HOST $PORT 2>/dev/null; then
        echo "✓ PostgreSQL is ready!"
        exit 0
    fi

    echo "PostgreSQL not ready yet (${elapsed}s elapsed)..."
    sleep 2
done
