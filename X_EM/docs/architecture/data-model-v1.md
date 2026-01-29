## Data Model - Conceptual (v1)

### Core Tables (MVP)
- Users
- Events
- Registrations

---

### Users
- Represents all platform users
- Roles: 
  - organizer
  - attendee
  - admin (reserved for future platform management)

---

### Roles
- Organizer and Attendee are roles on `users` (not separate tables)
  - Example: users.role = "organizer" | "attendee"

---

### Relationships
1. Organizer --> Events
 - One User (Organizer) can create many Events
 - Each Event belongs to exactly one Organizer
   - events.organizer_user_id -> users.id

2. Attendee --> Registrations
  - One User (Attendee) can have many Registrations
  - Each Registration belongs to exactly one User
    - registrations.user_id -> users.id

3. Event --> Registrations
  - One Event can have many Registrations
  - Each Registration belongs to exactly one Event
    - registrations.event_id -> events.id

Note: users.id is referenced in multiple places because the same user entity can act as an organizer (event owner) and an attendee (registrant)

---

### Critical Constraints (Business Rules Enforcement)
- Prevent duplicate registrations:
  - registrations has a UNIQUE constraint on (user_id, event_id)
- Prevent over-capacity registrations (enforced by backend logic)
  - registrations.count for an event must not exceed events.capacity

---

### Notes
- Dashboard is derived/aggregated data (not a table)
- Payments + confirmations are Phase 4 integrations and may introduce:
  - payments table (provider ids, status)
  - confirmations/tickets table (delivery, status, QR identifier)

---

### Design Principles
- Roles are modeled as attributes, not separate tables, to keep authorization flexible
- The schema favors simplicity for MVP while allowing future expansion
- Aggregated views (ex: dashboards) are derived from relational data rather than stored