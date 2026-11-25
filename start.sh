#!/bin/sh
set -e

echo "=== MediConnect Starting ==="

# Check if DATABASE_URL is configured
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    file:*)
      echo "Using SQLite local database: $DATABASE_URL"
      ;;
    *)
      echo "Detected remote database connection. Syncing Prisma schema..."
      node node_modules/prisma/build/index.js db push --skip-generate || echo "Warning: prisma db push failed or timed out. Continuing application launch."
      ;;
  esac
else
  echo "Warning: DATABASE_URL environment variable is not set."
fi

echo "Starting Next.js standalone server..."
exec node server.js
