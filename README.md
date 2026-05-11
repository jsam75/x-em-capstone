# X_EM – Backend-First Event Management Platform

## Phase 1 Capstone Build

**Last Updated:** May 11, 2026

---

# Overview

X_EM is a backend-first event management platform designed to support:

* event discovery,
* organizer workflows,
* relational CRUD operations,
* and operational event management workflows.

The project began as a much larger concept involving:

* organizer/admin systems,
* ticket purchasing,
* dashboards,
* authentication,
* analytics,
* and marketplace-style platform behavior.

As development progressed, the project intentionally evolved into a:

> lightweight Phase 1 operational platform focused on backend architecture and relational workflow design.

This decision allowed the project to prioritize:

* backend engineering fundamentals,
* relational data modeling,
* service/controller separation,
* filtering/sorting/pagination,
* many-to-many relationships,
* and frontend/backend orchestration.

The frontend intentionally remains:

> a thin operational interface layered over backend functionality.

---

# Project Goals

The primary goals of Phase 1 were:

* Build a relational backend using Node.js, Express, and MySQL
* Demonstrate backend-first CRUD architecture
* Implement filtering, sorting, and pagination workflows
* Explore many-to-many relationship handling
* Practice frontend/backend orchestration
* Create a stable operational workflow UI
* Learn architectural tradeoffs and stabilization practices

This project intentionally prioritized:

* architectural clarity
  over:
* feature quantity.

---

# Tech Stack

## Frontend

* React
* Vite
* React Router
* Tailwind CSS

## Backend

* Node.js
* Express
* MySQL
* mysql2/promise

## Development Tools

* VS Code
* Git / GitHub
* Insomnia
* Nodemon
* dotenv

---

# Current Phase 1 Features

## Backend Features

* RESTful event API
* CRUD operations for events
* Filtering
* Sorting
* Pagination
* Relational JOIN queries
* Many-to-many subject relationships
* Validation middleware
* Centralized error handling
* Service/controller separation
* Utility-based transformation logic

---

## Frontend Features

* Event discovery page
* Event detail workflow
* Create event workflow
* Edit event workflow
* Delete event workflow
* Filtering UI
* Pagination UI
* Active filter visualization
* Route recovery (404 page)
* Operational CRUD interface

---

# Architectural Philosophy

## Backend-First Development

X_EM intentionally evolved into a backend-first platform.

The backend architecture became the primary focus of the project because:

* relational complexity,
* API orchestration,
* and data modeling

became the most important engineering challenges in the system.

The frontend exists primarily to:

* visualize workflows,
* consume backend APIs,
* and demonstrate operational CRUD behavior.

---

## Thin Frontend Philosophy

The frontend intentionally avoids:

* heavy state management libraries,
* large frontend abstractions,
* and unnecessary complexity.

The application currently uses:

* explicit fetch workflows,
* page-level orchestration,
* and lightweight presentation components.

This keeps the architecture:

* understandable,
* operational,
* and proportional to project scope.

---

## Intentional Phase 1 Scope

Many larger features were intentionally deferred, including:

* authentication systems
* advanced permissions
* ticket purchasing
* dashboards
* notifications
* analytics
* organizer management systems

This was done intentionally to:

* avoid uncontrolled project sprawl,
* stabilize backend architecture,
* and strengthen core relational CRUD workflows first.

---

# Major Engineering Concepts Explored

## Relational Data Modeling

The backend heavily explores:

* foreign keys
* lookup tables
* relational joins
* many-to-many relationships
* normalization
* and relational workflow orchestration.

---

## Presentation Models vs Editable Resource Models

One major architectural lesson involved separating:

* frontend presentation models
  from:
* editable backend resource models.

Display pages require:

* formatted data,
* normalized labels,
* and presentation-friendly responses.

Edit workflows require:

* raw IDs,
* editable datetime values,
* and relational synchronization.

---

## Backend Transformation Logic

The backend uses transformation utilities such as:

```txt
groupEvents()
```

to:

* normalize JOIN-heavy query results,
* aggregate subject relationships,
* and simplify frontend rendering behavior.

This significantly reduced frontend complexity.

---

## Pagination + Filtering Complexity

Pagination became significantly more complex once:

* many-to-many relationships,
* filtering,
* and relational JOINs

were introduced.

The backend evolved into:

* multi-query pagination orchestration
  using:
* count queries
* ID queries
* and retrieval queries

to prevent:

* duplicate rows
* and broken pagination behavior.

---

# Current Project Structure

```txt
X_EM/
├── backend/
├── frontend/
├── db/
├── docs/
└── README.md
```

---

# Future Phase 2 Direction

Potential future expansions include:

* authentication and authorization
* organizer/admin roles
* ticket purchasing workflows
* venue CRUD management
* dynamic lookup creation
* dashboard systems
* analytics
* notification systems
* improved form abstraction
* reusable frontend form components

---

## Lookup Workflow Expansion

Current Phase 1 workflows intentionally use:

* controlled dropdown selections
  for:
* subjects
* organizers
* venues
* and cities

to preserve:

* relational integrity
* and simplify CRUD orchestration.

Future phases may evolve toward:

* dynamic lookup creation
* hybrid dropdown + free-text workflows
* and user-managed relational entities.

Example future workflows:

* “Create New Venue”
* autocomplete + create behavior
* dynamic relational hydration

---

# Lessons Learned

One of the most important lessons from the project:

> Smaller, stabilized architecture is stronger than uncontrolled feature growth.

The project improved significantly once development focused on:

* architectural clarity,
* relational workflows,
* stabilization,
* and intentional scope management.

Additional architectural reflections can be found in:

```txt
docs/lessons_learned.md
```

---

# Development Status

Current Status:

> Phase 1 Stabilized CRUD Platform

The system now demonstrates:

* relational CRUD architecture
* filtering/sorting/pagination
* backend/frontend orchestration
* many-to-many synchronization
* operational workflow UX
* and backend-first application structure

while remaining intentionally scoped and maintainable.

---

# API Endpoint Summary

## Events

| Method | Endpoint               | Description                                            |
| ------ | ---------------------- | ------------------------------------------------------ |
| GET    | `/api/events`          | Get all events with filtering, sorting, and pagination |
| GET    | `/api/events/:id`      | Get single event details                               |
| GET    | `/api/events/:id/edit` | Get editable event resource data                       |
| POST   | `/api/events`          | Create a new event                                     |
| PUT    | `/api/events/:id`      | Update an existing event                               |
| DELETE | `/api/events/:id`      | Delete an event                                        |

---

## Lookup Data

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/subjects`      | Retrieve available subjects |
| GET    | `/api/organizations` | Retrieve organizations      |
| GET    | `/api/venues`        | Retrieve venues             |


---

# Author Notes

This project was developed as part of a software engineering boot camp capstone while intentionally emphasizing:

* backend engineering growth,
* architectural reasoning,
* and operational workflow design.

The project is not intended to represent a finished production SaaS platform.

Instead, it represents:

> a stabilized Phase 1 backend-first foundation designed for future expansion and architectural learning.

---


# Getting Started

## Clone Repository

```bash
git clone https://github.com/jsam75/x-em-capstone
cd X_EM
```

---

# Backend Setup

## Navigate To Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file inside:

```txt
backend/
```

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=x_em
```

## Start Backend Server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:3000
```

---

# Frontend Setup

## Navigate To Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Database Setup

Database scripts are located in:

```txt
db/
```

Core files include:

* `x_em_schema_v1.sql`
* `seed.sql`

Import the schema and seed data into MySQL before running the application.


