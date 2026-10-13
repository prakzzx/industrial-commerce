XMACH — Industrial Commerce Platform
Industrial procurement, simplified.

A B2B commerce platform designed for manufacturing units, machine shops, procurement teams, and industrial suppliers. XMACH brings industrial product discovery, multi-vendor offers, purchasing workflows, GST-aware billing, and vendor fulfilment into a unified interface.

Built with React, TypeScript, Vite, and Tailwind CSS, the platform combines a responsive frontend with a modular backend architecture designed around REST APIs, relational data, caching, and event-driven integrations.

Platform Highlights
Industrial Catalogue — Browse cutting tools, CNC spares, consumables, automation components, machine accessories, and other industrial supplies.
Multi-Vendor Commerce — Support multiple offers per product, with vendor-specific pricing, stock, lead times, and minimum order quantities.
Smart Spare-Parts Discovery — Explore machine-related spare parts through contextual machine and alarm information.
Cart & Checkout — Manage multi-vendor carts and validate quantities, stock, freight, and applicable taxes.
GST-Aware Billing — Support intra-state CGST/SGST and inter-state IGST calculations.
Order Management — Provide order history, fulfilment status, shipment-related views, and return-request workflows.
Vendor Portal — Offer vendor-facing fulfilment screens for order acceptance, packing, dispatch, and tracking.
Administrative Workspaces — Separate commerce administration from platform administration.
Adaptive UI — Light and dark themes with grid-inspired backgrounds and cyan and emerald accents.
User Experiences
User Group	Capabilities
Customers	Catalogue, machine spares, cart, addresses, billing, checkout, orders
Vendors	Vendor portal and fulfilment workflows
Commerce Administrators	Catalogue management and commerce administration
Platform Administrators	Platform-level administration
The interface includes role-specific navigation and registration flows. Production-grade authentication and authorization require server-side enforcement.

Technology Stack
Layer	Technologies
Frontend	React 18, TypeScript 5
Build Tooling	Vite 5
Styling	Tailwind CSS 3
UI State	React Context
Server Prototype	Node.js
Intended API	NestJS / Node.js
Database	PostgreSQL 16
Caching	Redis 7
Event Messaging	NATS JetStream
Infrastructure	Docker Compose
Architecture
┌───────────────────────────────────────────┐
│             User Interfaces               │
│         Customer · Vendor · Admin         │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│          React + TypeScript SPA           │
│       Components · Context · API Client   │
└─────────────────────┬─────────────────────┘
                      │ REST
                      ▼
┌───────────────────────────────────────────┐
│          Node.js Mock API Server          │
│        Catalogue · Checkout · Health      │
└───────────────────────────────────────────┘

          Intended Backend Architecture

┌───────────────────────────────────────────┐
│             Purchase API                  │
│            NestJS / Node.js               │
└───────────────┬───────────────┬───────────┘
                │               │
                ▼               ▼
         ┌────────────┐  ┌───────────────┐
         │ PostgreSQL │  │     Redis     │
         │ Persistent │  │    Caching    │
         │   Data     │  │               │
         └────────────┘  └───────────────┘
                │
                ▼
         ┌────────────────┐
         │ NATS JetStream │
         │ Domain Events  │
         └────────────────┘
The diagram distinguishes the current mock server from the intended backend architecture. The complete purchase API and its infrastructure integrations are not yet implemented.

Project Structure
industrial-commerce/
├── apps/
│   ├── purchase-web/           # React frontend
│   │   └── src/
│   │       ├── components/     # Application views and UI
│   │       ├── context/        # Shared application state
│   │       ├── services/       # API client and seed data
│   │       └── types/          # TypeScript types
│   └── purchase-api/           # Planned backend service
├── packages/
│   ├── purchase-contracts/     # DTOs and event types
│   └── parent-platform-mocks/  # Mock integration services
├── migrations/                 # PostgreSQL schema
├── docs/                       # API and integration specifications
├── docker/
│   └── compose.dev.yaml        # Development infrastructure
└── server.js                   # Static server and mock API
Data & Integration Design
Relational Data Model
The PostgreSQL schema defines entities for:

Product categories, products, variants, and media
Vendor offers, inventory balances, and pricing tiers
Shopping carts, orders, and order lines
Delivery address snapshots and shipments
Invoice references and return requests
Event-Driven Workflows
NATS JetStream contracts define events for key business transitions, including:

cart.checked_out
order.created
payment.captured
vendor_order.accepted
shipment.created
invoice.issued
These contracts describe the intended integration model. Full event publishing and consumption remain future implementation work.

Caching Strategy
The design defines Redis keys for cart state, catalogue lookups, inventory balances, checkout idempotency, order status, and vendor dashboard summaries. The complete caching implementation is not active in the current mock server.

GST Calculation Model
Transaction Type	CGST	SGST	IGST
Intra-state	Half the applicable tax rate	Half the applicable tax rate	0%
Inter-state	0%	0%	Full applicable tax rate
The prototype also defines a mock freight policy, STANDARD_150_PER_VENDOR. Tax and freight rules require validation against actual business and regulatory requirements before production use.

Implementation Status
The repository currently provides a frontend prototype and a limited in-memory Node.js mock server.

Implemented in the mock server:

Health endpoint
Product category retrieval
Product catalogue retrieval and search
Checkout validation
Still requiring implementation or verification:

Complete NestJS purchase API and Dockerfile
Persistent database-backed API operations
Secure authentication and server-side authorization
Complete checkout, order creation, and vendor order splitting
Production payment and invoicing integrations
Redis caching and NATS JetStream event processing
Automated tests, monitoring, and production security controls
The mock server contains three seed products, stores data in memory, and resets it on restart. The current authentication prototype stores passwords in plain text in browser storage and is not suitable for production.

XMACH — Industrial Commerce Platform

One unified experience for industrial product discovery, procurement, and vendor operations.