#!/bin/sh

set -e

echo "Running Prisma Migrations..."
npx prisma migrate deploy

echo "Starting the application..."
exec "$@"