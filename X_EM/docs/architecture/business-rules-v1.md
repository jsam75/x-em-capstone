## Status: Draft/v1

## Business Rules - v1 (Conceptual)  

This document captures the initial business rules that guide the platform's behavior and will inform backend service design as the system evolves.

These rules define the core platform behaviors and will be enforced by backend services.  The frontend may mirror certain rules for user experience, but the backend remains the source of truth.

---

## Event Rules:
- Only authenticated organizers can create events
- Organizers may only edit or delete events they own
- Events must have a defined capacity

---

## Registration Rules:
- A user may only register once per event
- Registrations cannot exceed event capacity
- Registration closes automatically when capacity is reached
- Successful registration generates a confirmation (email / QR - phase 4)

---

## Authorization Rules:
- Organizer actions require authentication
- Attendees must authenticate at the point of registration 