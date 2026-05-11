## System Architecture - Conceptual (v1)

Components + Responsibilities = Architecture

This conceptual architecture reflects the intended production structure of X_EM and serves as a
roadmap for progressive implementation and new technologies are learned.


[User Browser / Mobile]
    ↓
[React Frontend (Vite)]

    Structure:
    - Pages (Routes)
    - Components
    - API Client (services/)

    Responsibilities:
    - Render UI
    - Handle routing
    - Collect form data
    - Call backend API

    ↓

[Express Backend / API]

    Structure:
    - Routes
    - Controllers
    - Services (business logic)
    - Data Access (queries)

    Key Endpoints:
    - GET/POST/PATCH /events
    - POST /registrations
    - GET /organizers/:id/dashboard

    Controllers Responsibilities:
    - Validate/normalize request data
    - Return consistent JSON responses

    Services Responsibilities:
    - Business logic (registration, capacity)
    - Authorization checks (organizer actions)
    - Orchestrate data access + integrations (later)

Note: Backend services are the source of truth for business rules (auth, capacity, registration constraints).  
Frontend mirrors rules only for UX.

    ↓

[MySQL Database]

    Core Tables (MVP):
    - users
    - events
    - registrations


(Phase 4 / Integrations)
[Express Services] ---> [Payments Provider]
[Express Services] ---> [Email Service]
[Express Services] ---> [QR Code Generator]
   

