# Logistics CRM Dashboard Project

## Overview
A comprehensive logistics management system with React frontend and Express backend. Successfully migrated from Lovable to Replit environment.

## Project Architecture
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (Drizzle ORM ready)
- **UI Framework**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query

## Recent Changes
- ✓ Migration from Lovable to Replit completed (2024)
- ✓ Dependencies installed and configured
- ✓ Application running successfully on port 5000
- ✓ PostgreSQL database integrated with Drizzle ORM (June 25, 2025)
- ✓ Added comprehensive shipment data table with search, export, and CRUD operations
- ✓ Fixed API validation issues and confirmed database operations working (June 25, 2025)
- ✓ Implemented delete functionality across All Shipments and Data Table pages
- ✓ Added rate radio button with conditional freight calculation
- ✓ Fixed freight calculation formula: (Weight/1000) × Rate + Delivery Charge
- ✓ Restructured form layout and set numberOfArticles to fixed "Loose" value
- ✓ Enhanced dashboard with advanced date filtering system (June 26, 2025)
- ✓ Supabase database integration completed with DATABASE_URL secret (June 26, 2025)
- ✓ Schema synchronized and data operations verified working

## Current Features
- Dashboard with analytics
- Shipment form for data entry
- Shipment list view
- Comprehensive data table with search, view details, delete, and Excel export
- Resource management
- Tabbed navigation interface
- Full database integration with PostgreSQL

## User Preferences
- Prefers clean, functional interfaces
- Values efficient data management workflows

## Development Notes
- Server binds to 0.0.0.0:5000 for Replit compatibility
- Uses PostgreSQL database with Drizzle ORM
- Hot reloading enabled in development mode
- API endpoints: GET/POST/PUT/DELETE /api/shipments