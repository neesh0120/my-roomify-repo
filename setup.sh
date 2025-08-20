#!/bin/bash

# Update package.json with required dependencies
echo "Updating package.json..."
npm pkg set dependencies.next-auth="^4.22.1"
npm pkg set dependencies.@prisma/client="^5.2.0"
npm pkg set dependencies.@auth/prisma-adapter="^1.0.1"
npm pkg set dependencies.bcryptjs="^2.4.3"
npm pkg set dependencies.@types/bcryptjs="^2.4.2"
npm pkg set dependencies.@react-three/fiber="^8.13.6"
npm pkg set dependencies.@react-three/drei="^9.80.2"
npm pkg set dependencies.three="^0.155.0"
npm pkg set dependencies.@types/three="^0.155.0"
npm pkg set dependencies.firebase="^10.1.0"
npm pkg set dependencies.@firebase/storage="^0.11.2"

# Install dependencies
echo "Installing dependencies..."
npm install

# Initialize Prisma
echo "Initializing Prisma..."
npx prisma generate

# Create necessary directories
mkdir -p public/models
mkdir -p public/textures
mkdir -p app/components/ar
mkdir -p app/components/upload
mkdir -p app/components/generate

echo "Setup complete! Please update your .env file with your database credentials and other environment variables."
