## API Surface - Conceptual v1

This document outlines the initial backend capabilities required to support the X_EM platform.  It focuses on platform capabilities rather than implementation details.

The API surface establishes the contract between the frontend and backend systems and guides future service design.

---

**Phase tags:** 
- MVP = required for initial release
- Phase 4 = planned integration

---

### Authentication Capabilities

#### Authenticate User
**Phase:** MVP
- Login / session creation

#### Register User Account
**Phase:** MVP
- Required for organizers
- Required for attendees at registration

---

### Event Capabilities

#### Retrieve Events
**Phase:** MVP
- Return a list of published events
- Supports filtering (date, location, subject)

#### Retrieve Event Details
**Phase:** MVP
- Return full event data for a specific event

#### Create Event (Organizer)
**Phase:** MVP
- Requires authentication
- Creates a new event with defined capacity

#### Update Event (Organizer)
**Phase:** MVP
- Organizer may only update events they own

#### Delete Event (Organizer)
**Phase:** MVP
- Organizer may only delete events they own

---

### Registration Capabilities

#### Register for Event
**Phase:** MVP
- Prevent duplicate registrations
- Enforce capacity rules

#### Cancel Registration
**Phase:** MVP (Nice to have) / Later (TBD)
- Removes attendee from event (optional for MVP - decision TBD)

---

### Organizer Capabilities

#### Retrieve Organizer Dashboard
**Phase:** MVP
- Event metrics
- Registration counts
- Capacity status

---

### Phase 4 Integrations (Future)
**Phase:** Phase 4
- Payment processing (e.g., Stripe)
- Confirmation delivery (email / QR code)

---

#### Guiding Principles
- Backend services enforce business rules
- Frontend mirrors rules for user experience
- Authorization is required for organizer actions
- Platform design favors simplicity for MVP while preserving upgrade paths