## Engineering Guardrails v1

### Guardrail 1: System Boundaries

#### React owns (UI logic)
- Rendering + layout
- Routing + navigation
- Form state + client-side validation (format/required)
- Loading/error states
- "Mirror" checks for UX (ex: disable register button if sold out)

#### Express owns (business truth)
- Auth + authorization (role checks, ownership)
- Capacity enforcement
- Duplicate registration prevention
- Price/amount truth (Phase 4)
- Confirmation issuance (Phase 4)

Rule test: If it impacts security, money, capacity, permissions, or data correctness, backend is the source of truth

---

### Guardrail 2: Folder Strategy (React)
  (Feature-first structure)

src/
  app/
    App.jsx
    routes.jsx
  features/
    events/
      pages/
      components/
      hooks/
      api.js
    registrations/
      pages/
      components/
      api.js
    organizer/
      pages/
      components/
      api.js
    auth/
      pages/
      components/
      api.js
    shared/
      components/
      utils/
    services/
      http.js

Rule: Feature folders contain feature UI + feature API calls (api.js)
      shared/ is only for truly reusable components/utilities

---

### Guardrail 3: Service pattern (Frontend + Backend)

#### Frontend (API Client)
- One http.js wrapper (fetch/axios later)
- Each feature has an api.js that calls backend
- Components never call fetch directly

Rule: Components --> Feature api.js --> http.js

#### Backend (Express)
- Routes: endpoint mapping only
- Controllers: HTTP in/out only
- Services: all business rules live here
- Data access: DB queries only

Rule: Routes --> Controllers --> Services --> Data Access --> DB

---

### Guardrail 4: State ownership (React)

#### Local component state
- Use for:
  - form inputs
  - dropdowns/toggles
  - UI-only state

#### Page state (route-level)
- Use for:
  - fetched lists
  - event detail
  - registration submission status

#### "Global-ish" state (lightweight)
- Use for:
  - current user/auth info
  - maybe search filters (if needed across pages)

Rule: Start with page state + props. Only promote to global when it hurts.

---

### Guardrail 5: MVP scope locks (anti-drowning rules)

#### MVP must-have
- Browse events + filter
- Event detail
- Register for event (no real payment yet)
- Organizer create/edit events
- Organizer dashboard basics (counts/capacity)

#### Explicit NOT in MVP (for sanity)
- Multi-organizer teams/orgs
- Advanced analytics
- Recommendations
- Social features
- Complex permissions beyond role + ownership

Rule: "If it isn't in business-rules-v1 or api-surface-v1, it doesn't get built."

---

### Guardrail 6: Naming + versioning 
- Use kebab-case for docs and images
- Keep architecture docs versioned: 
  - system-architecture-conceptual-v1.md
  - business-rules-v1.md
  - api-surface-v1.md
  - data-model-v1.md

Rule: Never overwrite v1 - create v2 later

---

### Guardrail 7: What to build first (fastest path, least risk)
- When starting to code, follow this order:
  1. Static pages first (Landing, EventsList, EventDetail, OrganizerDashboard)
  2. Add fake data to render UI
  3. Add API client layer (services/http.js, feature api.js)
  4. Wire pages to API calls
  5. Add forms (create event, register)

Rule: UI skeleton --> data wiring --> forms --> polish