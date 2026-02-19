# Model Verification

This document demonstrates that the relational schema supports the UI data requirements.

---

## Event Discovery Page

The event browse page displays:

- Event name
- Date/time
- Organizer
- Venue + location
- Subject tags
- Starting ticket price
- Registration availability

### Tables Involved

events  
JOIN organizations ON events.organization_id = organizations.organization_id  
JOIN venues ON events.venue_id = venues.venue_id  
JOIN ticket_types ON ticket_types.event_id = events.event_id  
LEFT JOIN event_subjects ON event_subjects.event_id = events.event_id  
LEFT JOIN subjects ON subjects.subject_id = event_subjects.subject_id  

### Derived Values

- Starting price = `MIN(ticket_types.price_cents)`
- Remaining seats = `ticket_types.capacity - COUNT(registrations WHERE status = 'confirmed')`

### Filtering

Filtering operations operate on:

- Date range → `events.starts_at`
- Location → `venues.city`, `venues.state`
- Subject → `subjects.name`
- Format → `events.format`
- Visibility → `events.is_published`

---

## Event Detail Page

Displays full event info plus ticket options.

Additional tables:

registrations → used to calculate remaining seats

---

## Conclusion

The schema supports:
- multi-subject events
- venue-local scheduling
- multiple ticket tiers
- derived availability
- search filtering

The relational model successfully represents the UI data requirements.
