#!/bin/bash

echo "🗄️  Running database migrations..."

# Check if database is available
until pg_isready -h localhost -p 5432; do
  echo "⏳ Waiting for database..."
  sleep 2
done

# Run migrations
npm run migrate

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully!"
else
  echo "❌ Migration failed"
  exit 1
fi