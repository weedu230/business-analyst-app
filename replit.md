# Requirements Management System

## Overview

This is a full-stack web application built for managing project requirements and stakeholders. The system provides a step-by-step workflow for collecting project details, managing stakeholders, defining functional and non-functional requirements, and generating professional requirement documents. It features a React frontend with TypeScript, an Express backend, and PostgreSQL database integration through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and design tokens
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Data Storage**: Dual storage implementation with in-memory storage (MemStorage) as fallback and PostgreSQL as primary
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reloading with Vite middleware integration

### Database Schema
- **Projects Table**: Stores project metadata including name, domain, description
- **JSON Fields**: Stakeholders, functional requirements, and non-functional requirements stored as JSONB arrays
- **Schema Validation**: Zod schemas for runtime type checking and API validation
- **Migration System**: Drizzle Kit for database migrations and schema management

### Key Design Patterns
- **Modular Components**: Reusable UI components with consistent props interfaces
- **Type Safety**: End-to-end TypeScript with shared schemas between frontend and backend
- **Progressive Enhancement**: Step-by-step form wizard with validation at each stage
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Error Handling**: Comprehensive error boundaries and user feedback systems

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection**: Uses DATABASE_URL environment variable for connection string

### UI and Styling
- **Radix UI**: Headless UI components for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### PDF Generation
- **jsPDF**: Client-side PDF generation for requirements documents

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation for entities
- **clsx**: Conditional CSS class composition

### Development Environment
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **TypeScript**: Full type checking and IntelliSense support