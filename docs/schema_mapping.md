# X_EM Data Model Mapping

This document maps frontend concepts (UI/API) to database structure. (Meaning- this is meant for how humans think, not how MySQL builds it)

---

## Event Discovery (Search/Browse)

User Goal:
Browse upcoming events and decide whether to register.

Display Order (Typical UI Card):
1. Event name
2. Subject tags
3. Short Description
4. Organizer
5. Venue + Location (city/state)
6. Date/time
7. Ticket Prices
8. Registration availability

Data Mapping (Relational Mapping):

|      Display Field         |  Source Table  |                      Column                                  |        
| -------------------------- | -------------- | -----------------------------------------------------------  |
| Event name                 | events         | name                                                         |
| Date/time                  | events         | starts_at                                                    |
| Description                | events         | description (UI may truncate)                                |
| Organizer                  | organizations  | name                                                         |
| Venue name                 | venues         | name                                                         |
| City/State                 | venues         | city, state                                                  |
| Subject tags               | derived        | subjects.name via events_subjects                            |
| Ticket price               | derived        | MIN(ticket_types.price_cents) per event                      |
| Registration Availability  | derived        | capacity - COUNT(registrations where status is ('confirmed'))|
| Visibility                 | events         | is_published                                                 |

---

## Event Filtering

Users can filter events by:
- Subject tag
- Location (city/state and/or venue)
- Date range
- Format (virtual/in-person/hybrid)

Events Filtering operates on:
- events.starts_at
- venues.city
- venues.state
- subjects.name
- events.format
- events.is_published (default TRUE for public browse)

---

## Event

UI Concept: 
A conference, workshop, or meeting users can browse and register for.

Stored In:
events table

|  UI Field   |     DB Column        |                   Notes                                 |
| ----------- | -------------------- | ------------------------------------------------------- |
| id          | events.event_id      | surrogate numeric key replaces string ids               |
| title       | events.name          | named for consistency across tables                     |
| startsAt    | events.starts_at     | DATETIME (represents local time)                        |
| endsAt      | events.ends_at       | DATETIME (represents local time)                        |
| description | events.description   | optional                                                |
| published   | events.is_published  | controls visibility *(planned or implemented)*          |
| format      | events.format        | in-person / hybrid / virtual *(planned or implemented)* |


---

## Organizer

UI Concept:
Group hosting the event

Stored In:
organizations table

|  UI Field      |    DB Column         |
| -------------- | -------------------- |
| organizerName  |  organizations.name  |

---

## Venue / Location

UI Concept:
Where event occurs

Stored In:
venues table

|  UI Field  |   DB Column   |
| ---------- | ------------- |
| venueName  | venue.name    |
| city       | venue.city    |
| state      | venue.state   |

---

## Pricing & Capacity

UI Concept:
Cost and seat limits

Stored In:
ticket_types table

Reason:
Events may have multiple ticket tiers (General, VIP, Student)

|  UI Field    |      DB Column           |         Notes                |
| ----------   | ------------------------ | -----------------------------|
| Ticket price | ticket_types             | MIN (price_cents) per event  |
| capacity     | ticket_types.capacity    | NULL = unlimited (virtual)   |

---

## Subjects / Tags

UI Concept:
Categorization for search & filtering

Stored In:
subjects + event_subjects (junction)

Reason:
Many-to-Many relationship