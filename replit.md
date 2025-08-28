# Invoice Management Application

## Overview

This is a full-stack invoice management application built with React, Express, and TypeScript. The application allows users to manage suppliers, items, and invoices with a focus on creating invoices with multiple line items. It features a modern UI built with shadcn/ui components and uses Drizzle ORM for database operations with PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation using @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured error handling
- **Request/Response**: JSON-based communication with proper HTTP status codes
- **Development Setup**: Hot reloading with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle ORM with schema-first approach
- **Connection**: Neon Database serverless connection (@neondatabase/serverless)
- **Schema Management**: Shared schema definitions between client and server
- **Validation**: Zod schemas generated from Drizzle tables using drizzle-zod
- **Development Storage**: In-memory storage implementation for development/testing

### Database Schema Design
- **Suppliers Table**: Core entity storing supplier information (name, address, phone)
- **Items Table**: Product catalog with name and price
- **Invoices Table**: Invoice headers with supplier reference and total amount
- **Invoice Lines Table**: Line items linking invoices to items with quantities
- **Relationships**: Foreign key constraints ensuring data integrity between related entities

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: No explicit authentication system implemented in current codebase
- **Data Access**: Direct database access through storage layer abstraction

### Development and Build Process
- **Development**: Concurrent client and server development with Vite HMR
- **Build Process**: Separate builds for client (Vite) and server (esbuild)
- **Type Safety**: Shared TypeScript definitions across client and server
- **Path Aliases**: Configured path mapping for clean imports (@/, @shared/)

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection Pool**: Managed through @neondatabase/serverless driver

### UI and Styling
- **Radix UI**: Headless component library providing accessible primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system with customizable themes

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **PostCSS**: CSS processing with Autoprefixer
- **ESBuild**: Fast JavaScript bundler for server build
- **Replit Integration**: Development environment integration with cartographer and runtime error overlay

### Form and Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Schema validation for type-safe data handling
- **Date-fns**: Date manipulation and formatting utilities

### Utility Libraries
- **clsx & class-variance-authority**: Conditional CSS class management
- **nanoid**: Unique ID generation
- **cmdk**: Command palette component for search interfaces