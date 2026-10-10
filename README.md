# INDXO AI / XMACH - Industrial Purchase Portal

Amazon-Style B2B Commerce, Cart, GST Billing, Payment, Fulfilment & Supplier Integration for Industrial Consumables, Spares, Cutting Tools, and Machines.

## Overview
This repository contains the bounded Industrial Purchase Portal module developed for **INDXO Playbook / XMACH SaaS**. It provides a familiar, Amazon-style high-velocity purchasing journey tailored for manufacturing units, machine shops, procurement teams, and MSMEs.

## Visual Design Themes
- **Sign In / Registration Screen**: Faithful replica of **Image 1** (Dark carbon theme, `[ Internal Staff | Customer ]` toggle, `• DB connected` pill, dynamic registration without hardcoded credentials).
- **Home Page**:
  - **Dark Mode**: Faithful replica of **Image 2** (Dark carbon grid paper, hierarchy tree, vertical heads list, cyan/emerald punch buttons, live bottom footer).
  - **Light Mode**: Faithful replica of **Image 3** (Light grid paper, dark header, emerald sub-banner, clean white cards).

## Quick Start
To launch the application locally using the bundled Node.js runtime:

```bash
# Run standalone server
node server.js
```
Then open your browser at `http://localhost:3000`.

## Architecture Structure
```
indxo-purchase-portal/
├── apps/
│   ├── purchase-web/          # Amazon-style B2B Commerce SPA (Staff & Customer views)
│   └── purchase-api/          # NestJS/Node.js modular domain service
├── packages/
│   ├── purchase-contracts/    # TypeScript DTOs, interfaces, and NATS event schemas
│   └── parent-platform-mocks/ # Core platform mocks (Identity, Asset, Payment, Invoice)
├── migrations/                # PostgreSQL schema migrations (DDL)
├── docs/                      # OpenAPI 3.0, NATS JetStream events, integration architecture
├── docker/compose.dev.yaml    # Docker environment for Postgres, Redis, NATS
├── server.js                  # Standalone local HTTP & REST server
└── README.md
```
