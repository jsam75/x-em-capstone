# X_EM - Event Management Platform

## Overview
X_EM is a mobile-first event discovery and management platform designed for educators hosting
and attending professional development conferences and enrichment events.

The platform supports two primary user roles:
- Event Organizers who create, publish and manage events
- Attendees who search, register and purchase tickets for events

The design philosophy emphasizes a discreet, professional, and highly user-friendly experience
focused on clarity, efficiency, and trust.

---

## Problem Statement
Educators often rely on fragmented systems to discover conferences, manage registrations, and 
track attendance. 
X_EM provides a centralized platform that simplifies event creation, discovery, registration, and ticketing in one streamlined workflow.

---

## Target Users (Personas)

## Organizer
Goal: Quickly create and launch events, make them discoverable, and track ticket sales.

Core tasks:
- Create and publish events
- Manage registrations
- Track ticket sales and capacity

## Attendee
Goal: Easily discover relevant events, register, pay and receive confirmation.

Core tasks:
- Search and filter events by date, location, and subject
- View event details
- Register and pay securely
- Receive confirmation via email or QR code

---

## Core Features (MVP)

## Organizer
- Create and publish events
- Set date, location, subject tags, capacity, and pricing
- View registrations and ticket sales dashboard

## Attendee
- Browse and search events
- Filter by date, location, and subject
- Register for events
- Secure payment processing
- Confirmation via email / QR code

---

## UX & Product Design

- Mobile-first, single-column layout
- Section-based landing page design
- Discreet, professional visual style

Artifacts:
- User Flow Diagram
- Wireframes (planned for future)

## User Flow Diagram (v1)

X_EM begins at a shared Landing page and branches based on user intent.

- Attendees may browse and search events without authentication.
  Account creation is required only at the point of registration.

- Organizers authenticate early in order to create, publish, and manage events.

This MVP flow prioritizes clarity, Low friction, and trust for both user roles.

![User Flow Diagram] (docs/user-flow-diagram-v1.png)

Editable version:
[Figma- User Flow v1] https://www.figma.com/board/eYNI8tXfZihbQY2PXWYBiA/X_EM-User-Flow-v1?node-id=0-1&p=f&t=flkKe4dEtCjg6fSq-0

---

## Architecture Plan (Draft)

Frontend:
- React (Vite)
- React Router (planned)
- CSS Modules or Tailwind (TBD)

Backend (planned):
- Node / Express
- Database: MySQL

---

## Architecture Docs

Detailed architectural documentation is maintained in /docs/architecture to guide system design and support future scalability.

- [System Architecture - Conceptual v1] 
    (docs/architecture/system-architecture-conceptual-v1.md)

- [Business Rules -v1] 
    (docs/architecture/business-rules-v1.md)

- [API Surface - Conceptual v1] 
    (docs/architecture/api-surface-v1.md)

- [Data Model - Conceptual v1] 
    (docs/architecture/data-model-v1.md)

- [Engineering Guardrails]
    (docs/architecture/engineering-guardrails-v1.md)

---

## Development Phases

### Phase 1 - UX & Planning
- Define personas
- Create user flow diagram
- Design landing page layout

### Phase 2 - Frontend MVP
- Landing page
- Event browsing & filtering
- Registration flow

### Phase 3 - Backend & Auth
- Organizer accounts
- Event creation & publishing
- Registration persistence

## Phase 4 - Payments & Polish
- Payment integration
- Email / QR confirmation
- UI refinement

---

## Setup Instructions

```bash
npm install
npm run dev