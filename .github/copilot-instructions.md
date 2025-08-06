# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a React TypeScript restaurant review service application with the following characteristics:

## Project Overview
- **Framework**: React 18 with TypeScript and Vite
- **Database**: Supabase for backend services
- **Styling**: Dark theme with modern CSS
- **Deployment**: Optimized for Vercel deployment
- **Icons**: Lucide React for consistent iconography

## Key Features
- Restaurant listings and search
- User authentication via Supabase Auth
- Review system with ratings (1-5 stars)
- Dark theme UI/UX
- Responsive design
- Real-time data updates

## Code Conventions
- Use TypeScript for all new files
- Functional components with React hooks
- CSS modules or styled-components for styling
- Dark theme color palette throughout
- Follow React best practices for state management
- Use Supabase client for all database operations

## Database Schema (Supabase)
- restaurants: id, name, description, address, cuisine_type, image_url, created_at
- reviews: id, restaurant_id, user_id, rating, comment, created_at
- profiles: id, username, avatar_url, created_at

Please ensure all code follows these conventions and maintains the dark theme aesthetic.
