# Supply Chain Operations Dashboard - Replit Configuration

## Overview

This is a full-stack supply chain operations dashboard application designed to manage test kit inventory across 133 Department of Defense (DoD) base facilities. The application provides real-time monitoring, analytics, and operational recommendations for medical supply chain management across military services (Army Medical, Navy Medicine, Air Force Medical, Marine Corps Health, and Defense Health Agency).

**Key Features:**
- Data Upload Portal for weekly testing data submission (Step 1 of workflow)
- Interactive geographical mapping of locations (CONUS/OCONUS regions)
- Real-time inventory tracking and burn rate analysis
- Automated operational recommendations with level-loading suggestions
- Service-based and machine-type analytics
- Health status monitoring (Red/Yellow/Green status indicators)

**Tech Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Express.js
- Database: PostgreSQL (via Neon serverless)
- ORM: Drizzle
- UI Components: shadcn/ui (Radix UI primitives)
- Styling: Tailwind CSS with IBM Design System inspiration
- Maps: Leaflet

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 3, 2025 - Data Upload Portal (Step 1 of Workflow)
- **New Page Created**: Added dedicated Data Upload Portal at `/upload` route for weekly data submission
  - Implements Step 1 of the Robinhood workflow: "Generals upload testing data from the last week"
  - Drag-and-drop file upload interface with support for Excel (.xlsx, .xls) and CSV files
  - Visual file upload area with browse button and clear file format requirements
  - Upload history table showing past submissions with status tracking (Completed/Processing/Failed)
  - Each upload entry displays: filename, uploader name, timestamp, record count, facilities count
  - Color-coded status badges: Green (completed), Yellow (processing), Red (failed)
  - Data submission guidelines explaining the 5-step workflow process
  - Expected data columns documentation (Facility Name, Test Kits, Burn Rate, Machine Type, etc.)
- **App-Level Navigation**: Restructured application with shared layout and main sidebar
  - Created Layout component in App.tsx with main navigation sidebar
  - Two primary navigation items: "Operations Dashboard" and "Data Upload Portal"
  - Moved page-level header and sidebar from Dashboard to App-level Layout
  - Dashboard now has secondary tab navigation for different views (Global Map, By Service, etc.)
  - Active navigation states with blue highlighting (bg-primary/10)
  - Consistent Palantir-inspired design across both pages
- **Workflow Context**: Portal aligns with overall Robinhood workflow:
  1. Step 1: Generals upload weekly testing data (Data Upload Portal page)
  2. Step 2: Pre-process, clean & consolidate
  3. Step 3: Run supply/capacity/burn rate calculations
  4. Step 4: Update dashboard for next week's control tower operations

### November 2, 2025 - Red/Yellow/Green Status Colors & Purchase Suggestions
- **Status Badge Colors**: Updated all status indicators to use intuitive traffic-light colors
  - Critical: Red (bg-red-500) for locations with <3 days supply
  - Warning: Yellow (bg-yellow-500) for locations with 3-7 days supply
  - Healthy: Green (bg-emerald-500) for locations with 7+ days supply
  - Applied consistently across map legend, location badges, and map markers
- **Purchase Suggestions**: Enhanced operational recommendations with intelligent fallback suggestions
  - When no nearby level-load sources are available, displays purchase suggestion
  - Format: "Purchase additional {machineType} test kits from {supplier}"
  - Machine type to supplier mapping for 7 test types (Cepheid, Roche, Abbott, etc.)
  - Amber/yellow background (bg-amber-500/5) distinguishes from level-load suggestions
  - Guards against missing machine type data with fallback to "authorized supplier"
  - Includes data-testid for automated testing parity

### November 2, 2025 - Palantir-Inspired Redesign
- **Complete Visual Redesign**: Transformed dashboard to sleek, futuristic, calming aesthetic inspired by Palantir Foundry
  - Switched to light mode with clean white/light gray color scheme
  - Background: HSL(210, 20%, 98%) - very light blue-gray for calm atmosphere
  - Cards: Pure white (HSL 0, 0%, 100%) with subtle borders
  - Primary color: Soft blue HSL(207, 90%, 54%) for professional appearance
- **Muted Professional Palette**: Updated all colors to be calm and reassuring for crisis response
  - Chart colors: Soft blues, teals, muted purples (low saturation)
  - Priority badges: Rose/orange/sky/slate with reduced opacity (75/65/60/50%)
  - Trend indicators: Emerald green and rose red (emerald-600, rose-600)
- **Minimal Borders & Spacing**: Simplified visual design for clean, modern look
  - Border radius: 6px (reduced from 8px) for sharper, cleaner appearance
  - Subtle borders: border-border/50 and border-border/40 for minimal visual weight
  - Generous white space: Increased padding (px-8, py-10) and gaps (gap-6, gap-8, mb-10)
- **Typography & Hierarchy**: Enhanced readability with clear visual hierarchy
  - Header: "COVID-19 Test Supply Operations" with uppercase "STATUS" label
  - Stat cards: Uppercase labels with tracking-wider for professional feel
  - Card titles: Reduced to text-base for more balanced proportions
- **Left Sidebar Navigation**: Moved navigation from horizontal tabs to vertical left sidebar
  - Clean, minimal sidebar with 256px width (w-64)
  - 4 navigation items with icons: Global Map, By Service, By Machine Type, Operational Actions
  - Active state: Light blue background (bg-primary/10) with primary color text
  - Inactive state: Muted text with subtle hover elevation
  - Full accessibility support: aria-pressed, aria-current, type="button"
  - Sticky positioning below header using CSS variable (--header-height)
- **Design Philosophy**: Professional, calm, reassuring aesthetic suitable for emergency response operations
  - Puts users at ease during high-stress COVID crisis management
  - Clean, spacious layout reduces cognitive load
  - Muted colors avoid sensory overload while maintaining clarity

### November 1, 2025 - Operational Actions Improvements
- **Enhanced Recommendation System**: Added intelligent level-load suggestions that identify nearby healthy locations with excess supply
  - Uses Haversine formula to calculate distances between facilities
  - Suggests sources within 500-mile radius with >10 days supply buffer
  - Each suggestion shows: location name, city, available kits, and distance
  - Maintains 10-day safety buffer for donor locations (excess beyond 10-day reserve is available for transfer)
- **Compact Table Design**: Redesigned RecommendationsList from card-based layout to compact table format
  - Shows top 10 operational actions in single viewport
  - Columns: #, Priority, Action Required, Level-Load Suggestions
  - Priority badges with color coding (urgent=red, high, medium, low)
  - Inline display of level-load sources with location details
- **Service Summary Sorting**: Changed default sort to avgDaysRemaining (ascending) to prioritize most critical services
- **Typography Update**: Changed global font from IBM Plex Sans/Mono to Inter for cleaner, more modern appearance

## System Architecture

### Frontend Architecture

**Component Structure:**
- **Page Components**: Single-page application with a Dashboard view as the primary interface
- **UI Components**: Modular shadcn/ui component library with custom wrapper components for domain-specific features
- **Key Custom Components**:
  - `LocationMap`: Interactive Leaflet map with regional filtering (CONUS/OCONUS) and search capabilities
  - `ServiceSummaryTable`: Sortable table displaying metrics aggregated by military service
  - `MachineTypeSummary`: Analytics view grouped by testing machine types
  - `RecommendationsList`: Top 10 operational actions with level-loading suggestions
  - `StatsCard`: Reusable metric display with trend indicators

**State Management:**
- TanStack Query (React Query) for server state management
- React hooks for local component state
- Currently using mock data generation (to be replaced with API calls)

**Routing:**
- Wouter for lightweight client-side routing
- Single route structure (dashboard at root)

**Design System:**
- Palantir Foundry-inspired with clean, professional aesthetic
- Typography: Inter font family from Google Fonts
- Light mode with muted, calming color palette
- Border radius: 6px for clean, minimal appearance
- Spacing system: Generous white space with px-8, py-10, gap-6/8
- Custom color tokens: Soft blues, muted tones, professional palette

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Vite middleware integration for development
- Request logging middleware with response capture

**API Structure:**
- RESTful API endpoints prefixed with `/api`
- Currently minimal route implementation (starter template)
- Designed to support CRUD operations via storage interface

**Storage Layer:**
- Abstract `IStorage` interface for flexibility
- In-memory implementation (`MemStorage`) as default
- Ready to be swapped with PostgreSQL implementation via Drizzle ORM

**Session Management:**
- Connect-pg-simple for PostgreSQL-backed sessions (configured but not yet implemented)

### Data Models

**Core Entities** (defined in `shared/schema.ts`):
- `Location`: Facility data including geographic coordinates, inventory levels, burn rates, health status
- `ServiceSummary`: Aggregated metrics by military service
- `MachineTypeSummary`: Aggregated metrics by testing equipment type
- `Recommendation`: Operational action items with priority levels and level-loading suggestions
- `User`: Authentication entity (minimal implementation)

**Database Schema:**
- PostgreSQL tables defined using Drizzle ORM
- Users table with UUID primary keys
- Schema migrations managed via `drizzle-kit`

**Type Safety:**
- Zod schemas for runtime validation
- Shared types between client and server
- Drizzle's type inference for database operations

### Build and Development

**Build Process:**
- Vite for frontend bundling
- esbuild for server bundling
- Separate build outputs: `dist/public` (frontend) and `dist` (server)

**Development Mode:**
- Vite dev server with HMR
- Replit-specific plugins (cartographer, dev banner, runtime error overlay)
- TypeScript compilation checking without emit

**Environment Configuration:**
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection (required for production)
- Path aliases: `@/` for client, `@shared/` for shared code, `@assets/` for static assets

## External Dependencies

### Third-Party Services

**Neon Database:**
- Serverless PostgreSQL hosting
- Connection via `@neondatabase/serverless` package
- Configured through `DATABASE_URL` environment variable

**Google Fonts:**
- Inter font family (weights: 400, 500, 600, 700)
- Loaded via CDN in HTML head

**Leaflet Maps:**
- Open-source mapping library
- CSS loaded from unpkg CDN
- Used for geographical visualization of facility locations

### Key npm Packages

**UI Framework:**
- `@radix-ui/*`: Headless UI primitives (20+ components)
- `class-variance-authority`: Component variant management
- `tailwindcss`: Utility-first CSS framework
- `lucide-react`: Icon library

**Data & Forms:**
- `@tanstack/react-query`: Server state management
- `react-hook-form`: Form handling
- `@hookform/resolvers`: Form validation integration
- `zod`: Schema validation
- `drizzle-zod`: Drizzle-to-Zod schema conversion

**Database & ORM:**
- `drizzle-orm`: TypeScript ORM
- `drizzle-kit`: Migration and schema management tools

**Utilities:**
- `date-fns`: Date manipulation
- `clsx` + `tailwind-merge`: Conditional className utilities
- `cmdk`: Command menu interface
- `nanoid`: Unique ID generation

**Development Tools:**
- `@replit/vite-plugin-*`: Replit-specific development enhancements
- `tsx`: TypeScript execution for Node.js
- `vite`: Build tool and dev server