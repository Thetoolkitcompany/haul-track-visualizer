# Logistics CRM Application

## Overview

This is a full-stack logistics CRM (Customer Relationship Management) application built with React and Express.js. The application provides a comprehensive dashboard for managing shipments, tracking logistics data, and analyzing business metrics. It features a modern UI built with React and shadcn/ui components, with a backend designed for REST API endpoints.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local storage persistence
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with planned database persistence
- **API Design**: RESTful endpoints with /api prefix

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: Hot module replacement (HMR) via Vite
- **TypeScript**: Strict mode with path aliases

## Key Components

### Frontend Components
1. **Dashboard**: Main analytics view with metrics cards and charts
2. **ShipmentForm**: Form for creating new shipment records
3. **ShipmentList**: Table view with filtering and export capabilities
4. **ResourceManagement**: CRUD interface for managing master data
5. **SearchableSelect**: Reusable dropdown with search functionality

### Data Models
- **Shipment**: Core entity with freight, delivery, and location data
- **User**: Authentication entity with username/password
- **Resources**: Master data lists (consignors, consignees, locations, etc.)

### Storage Layer
- **Database Schema**: Defined in shared/schema.ts using Drizzle ORM
- **Memory Storage**: Temporary in-memory implementation for development
- **Local Storage**: Client-side persistence for shipments and resources

## Data Flow

1. **Client State**: React components manage local state with hooks
2. **Local Storage**: Browser storage for offline capability and persistence
3. **API Layer**: RESTful endpoints for server communication (planned)
4. **Database**: PostgreSQL via Drizzle ORM for persistent storage
5. **Real-time Updates**: React Query for efficient data synchronization

## External Dependencies

### Core Framework Dependencies
- React ecosystem (react, react-dom, react-router-dom)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL dialect
- Neon Database serverless driver

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- Replit-specific plugins for cloud development

### Data Handling
- TanStack Query for server state management
- React Hook Form with Zod validation
- date-fns for date manipulation
- XLSX for spreadsheet export functionality

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 and PostgreSQL 16 modules
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Enabled via Vite middleware integration
- **Database**: Automatic provisioning via Replit PostgreSQL module

### Production Build
- **Frontend**: Vite build outputs to dist/public
- **Backend**: esbuild bundles server to dist/index.js
- **Static Assets**: Served via Express static middleware
- **Deployment Target**: Replit Autoscale for automatic scaling

### Database Migration
- **Schema Management**: Drizzle Kit for database migrations
- **Migration Path**: ./migrations directory
- **Environment**: DATABASE_URL environment variable required

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```