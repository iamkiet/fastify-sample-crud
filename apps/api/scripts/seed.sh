#!/bin/bash

echo "🌱 Seeding database..."

# Check if database is available
until pg_isready -h localhost -p 5432; do
  echo "⏳ Waiting for database..."
  sleep 2
done

# Run seed
npm run seed

if [ $? -eq 0 ]; then
  echo "✅ Database seeded successfully!"
else
  echo "❌ Seeding failed"
  exit 1
fi