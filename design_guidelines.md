# Design Guidelines: Supply Chain Operations Dashboard

## Design Approach

**Selected System:** Carbon Design System (IBM) with Linear-inspired refinements
**Rationale:** Purpose-built for data-heavy enterprise applications requiring clarity, scalability, and professional aesthetics. Linear's modern minimalism elevates the traditional enterprise feel.

**Key Principles:**
- Information hierarchy over decoration
- Scannable data presentation
- Purposeful whitespace for cognitive breathing room
- Consistent patterns for predictable interactions

---

## Typography System

**Font Stack:**
- Primary: IBM Plex Sans (Google Fonts)
- Monospace: IBM Plex Mono (for numerical data, codes)

**Hierarchy:**
- Page Titles: 28px/32px, Semi-bold (600)
- Section Headers: 20px/28px, Semi-bold (600)
- Card Titles: 16px/24px, Medium (500)
- Body Text: 14px/20px, Regular (400)
- Data Labels: 12px/16px, Medium (500)
- Table Content: 13px/18px, Regular (400)
- Numeric Data: 14px/20px, Mono, Medium (500)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Micro spacing (between related items): p-2, gap-2
- Standard spacing (component padding): p-4, gap-4
- Section spacing (card/module separation): p-6, gap-6
- Major spacing (between major sections): p-8, gap-8

**Grid Structure:**
- Main container: max-w-screen-2xl with px-6
- Dashboard uses 12-column grid for flexible layouts
- Sidebar: Fixed 240px width (hidden on mobile)
- Content area: Flexible, min-width maintained for table integrity

---

## Component Library

### Navigation & Structure

**Top Bar:**
- Height: 64px, fixed position
- Contains: Logo (left), breadcrumb navigation (center-left), user profile + notifications (right)
- Shadow: subtle bottom border (border-b)

**Sidebar (Desktop only):**
- Width: 240px, fixed position
- Contains: 4 main tabs as vertical navigation items
- Active state: Subtle left border accent (4px width)
- Each item: h-10, flex items with 16px icon + label

**Tab Content Area:**
- Full-width minus sidebar
- Each tab renders independently with consistent padding (p-6)

### Data Display Components

**Statistics Cards:**
- Grid: 4 columns on desktop (grid-cols-4), 2 on tablet, 1 on mobile
- Card structure: p-4, rounded-lg, border
- Content: Icon (top), Metric value (large, mono), Label (small), Change indicator (+/- with directional arrow)
- Height: min-h-[120px]

**Data Tables:**
- Striped rows for scannability
- Sticky header row
- Column structure: Fixed-width for status/actions (80-120px), flexible for text content
- Row height: 48px minimum for touch targets
- Pagination: Bottom-aligned, shows "X of Y entries"
- Sortable columns with arrow indicators

**Map Component (Tab 1):**
- Full-width card with h-[600px]
- Left panel (320px): Location list with search, filters
- Right panel: Interactive map with pin clusters
- Location cards in list: 72px height, shows name + key metrics + status badge

**Charts (Various Tabs):**
- Bar charts: Horizontal for location comparisons, vertical for time series
- Line charts: Multi-series with legend, time-based trends
- Donut charts: For categorical breakdowns (max 6 segments)
- All charts: Min height 300px, responsive scaling
- Use chart library via CDN (Chart.js or similar)

### Specialized Components

**Health Indicators:**
- Dot badges: 8px diameter circles
- Status labels: Pill-shaped with text, px-2.5 py-0.5, text-xs
- Color semantic mapping (not specified in guidelines, implemented later)

**Filter Panel:**
- Collapsible section at top of each tab
- Contains: Date range picker, location multi-select, status filters
- Height when expanded: auto, max 200px
- Apply/Reset buttons aligned right

**Recommendations Panel (Tab 4):**
- Card-based layout with priority indicators
- Each recommendation: p-4, includes title, description, affected locations count, action buttons
- Priority badge: Top-right corner of each card

### Interactive Elements

**Buttons:**
- Primary: h-9, px-4, rounded-md, text-sm font-medium
- Secondary: Same sizing with border variant
- Icon buttons: w-9 h-9, centered icon
- Small buttons (table actions): h-8, px-3, text-xs

**Search Inputs:**
- Height: h-10
- Icon: Left-aligned (16px)
- Clear button: Right-aligned when populated

**Dropdowns/Selects:**
- Height: h-10
- Chevron icon right-aligned
- Multi-select shows count badge when collapsed

---

## Page Structure

**Dashboard Layout:**
```
┌─────────────────────────────────────────────┐
│ Top Navigation Bar (64px height)            │
├──────┬──────────────────────────────────────┤
│      │ Tab Content Area                     │
│ Side │ ┌──────────────────────────────────┐ │
│ bar  │ │ Filters (collapsible)            │ │
│ (240 │ ├──────────────────────────────────┤ │
│  px) │ │ Stats Cards (4-column grid)      │ │
│      │ ├──────────────────────────────────┤ │
│      │ │ Primary Content (Maps/Tables/    │ │
│      │ │ Charts based on active tab)      │ │
│      │ └──────────────────────────────────┘ │
└──────┴──────────────────────────────────────┘
```

**Tab-Specific Layouts:**

Tab 1 (Map): Split layout (320px list + flexible map)
Tab 2 (Data Tables): Full-width sortable table with pagination
Tab 3 (Summaries): 2-column grid of summary cards with charts
Tab 4 (Recommendations): Single-column list of recommendation cards with priority sorting

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (sidebar collapses to hamburger menu, stats 1-column)
- Tablet: 768px-1024px (sidebar remains, stats 2-column)
- Desktop: > 1024px (full layout, stats 4-column)

**Mobile Adjustments:**
- Top bar includes hamburger menu trigger
- Sidebar becomes overlay drawer
- Tables switch to card view for critical columns
- Maps: List view takes precedence with map as expandable overlay

---

## Images

**No hero images required** - This is a data-focused enterprise dashboard, not a marketing interface. All visual content is functional: maps, charts, data visualizations.

---

## Icons

**Library:** Heroicons (outline style via CDN)
**Usage:**
- Navigation items: 20px
- Stat cards: 24px
- Table actions: 16px
- Status indicators: 16px
- Map pins: Custom 24px markers

---

## Data Visualization Standards

- Consistent axis labeling with units
- Legends positioned top-right or bottom-center
- Tooltips on hover showing precise values
- Grid lines subtle and non-intrusive
- Data points clearly distinguishable
- Responsive chart sizing maintaining readability