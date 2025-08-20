# Roomify - AI-Powered AR Interior Design

Roomify is a Next.js application that combines AI-powered interior design with AR visualization to help users transform their spaces.

## Features

- 🎨 AI-powered interior design generation
- 📱 AR visualization of furniture and designs
- 📸 Room photo upload and processing
- 🔐 User authentication and profile management
- 💾 Design saving and sharing
- 🏷️ Multiple style options and room types

## Setup Instructions

1. Clone the repository
2. Create a `.env` file with the required environment variables (see `.env.example`)
3. Run the setup script:
   ```bash
   # On Windows
   bash setup.sh
   
   # On Unix-based systems
   chmod +x setup.sh
   ./setup.sh
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/roomify"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and API handlers
- `/prisma` - Database schema and migrations
- `/public` - Static assets and 3D models

## Technologies Used

- Next.js 13+ with App Router
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- Three.js / React Three Fiber
- Firebase Storage
- Tailwind CSS
- Radix UI Components

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
