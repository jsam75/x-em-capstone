## Data Model - Conceptual (v1)
- Refines v1 for relational (MySQL) implementation
- Scope reduced to single-day paid events for MVP
- Roles remain attributes on users (no roles table)
- Payment workflow added (no sensitive card storage)

---

### Core Tables (MVP)
- users: stores all identifiable people in the system
- organizations: stores host organizations that create and manage events
- venues: stores physical or virtual location details where events occur
- events: stores each event listing and its primary information
- ticket_types: stores purchasable ticket options for an event (General, VIP)
- registrations: stores a user's enrollment in an event
- payments: stores payment attempts and results for a registration (no card data stored)
- tickets: stores issued admission credentials generated after successful registration/payment
- check_ins: stores attendance records when a ticket is validated at the event

---

### Users
Represent every identifiable person interacting with the system

A user may act as:
- attendee
- organizer
- admin

---

### Roles
Roles are stored as an attribute on the users table to keep authorization simple and flexible for MVP

---

### Relationships
- An organization can create many events
  An event belongs to one organization

- A venue can host many events
  An event occurs at one venue

- An event has many ticket types
  A ticket type belongs to one event

- A user has many registrations
  A registration belongs to one user

- An event has many registrations
  A registration belongs to one event

- A registration can have one payment
  A payment belongs to one registration

- A registration produces one or more tickets
  A ticket belongs to one registration

- A ticket has zero or one check-in
  A check-in belongs to one ticket

---

### Critical Constraints (Business Rules Enforcement)
A ticket cannot exist without a registration
A registration cannot exist without a user and event
A payment cannot exist without a registration

Check-in requires a valid issued ticket

Ticket types must belong to a valid event

Events must belong to an organization and a venue.

---

### Notes
Events are modeled as single-day experiences in MVP scope

Session scheduling intentionally deferred to future version

Payment records store only status and provider reference
No card numbers or financial credentials are stored

Design supports later addition of muli-day and session-level attendance without restructuring registrations

---

### Design Principles
- Keep MVP relational model simple and normalized
- Avoid premature abstraction (no roles table, no session modeling yet)
- Model real world workflow: event --> registration --> payment --> ticket --> check-in
- Keep schema extensible for future growth