#!/bin/bash

echo "🏗️  Building Fastify application..."

# Clean previous build
rm -rf dist/

# Type check
echo "🔍 Running TypeScript compiler..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
  echo "❌ TypeScript compilation failed"
  exit 1
fi

# Build
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build completed successfully!"