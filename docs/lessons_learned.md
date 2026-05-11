# lessons_learned.md

# X_EM – Lessons Learned & Major Engineering Decisions

## Project Context

X_EM began as a large-scale concept for an educator-focused event discovery and registration platform. Early ideas included:

* user authentication,
* organizer/admin roles,
* ticket purchasing,
* dashboards,
* analytics,
* and broader marketplace-style functionality.

As development progressed, an important architectural and product realization emerged:

 Attempting to build the entire vision during a boot camp capstone would create excessive project sprawl and weaken the backend foundation.

The project intentionally evolved into:

* a backend-first Phase 1 platform,
* with a thin operational frontend layer,
* focused on demonstrating relational CRUD workflows and backend architecture fundamentals.

This document captures the major engineering lessons, architectural decisions, tradeoffs, and stabilization choices made throughout development.

---

# 1. Backend-First Architecture 

## Original Assumption

Initially, the frontend was expected to play a larger role early in development.

However, as relational complexity increased, it became clear that:

* backend architecture,
* data modeling,
* and API orchestration

were the true foundation of the platform.

---

## Final Decision

The project intentionally shifted toward:

* backend-first development,
* with frontend serving primarily as:

  * workflow visualization,
  * operational CRUD interface,
  * and API consumer.

---

## Why This Was Important

This allowed the project to focus on:

* relational data modeling,
* service/controller separation,
* filtering,
* sorting,
* pagination,
* validation pipelines,
* many-to-many relationships,
* and workflow orchestration.

The frontend became:

 > a lightweight operational shell layered over backend capabilities.

This decision ultimately made the architecture:

* more coherent,
* more maintainable,
* and more realistic for future business adaptation.

---

# 2. The Project Needed Scope Restraint

## Major Realization

Early project ideas expanded rapidly into:

* permissions systems,
* advanced authentication,
* marketplace functionality,
* notifications,
* dashboards,
* analytics,
* and large-scale platform behavior.

This created a critical realization:

> A smaller, stable architecture is stronger than a large unstable architecture.

---

## Final Phase 1 Scope

Phase 1 intentionally focused on:

* event discovery,
* relational CRUD operations,
* filtering/sorting,
* pagination,
* many-to-many relationships,
* and operational workflow UX.

This decision prevented:

* uncontrolled feature creep,
* architectural instability,
* and incomplete systems.

---

# 3. Service / Controller Separation Became Essential

## Initial Pattern

Controllers originally handled:

* data retrieval,
* transformation logic,
* and response shaping.

As complexity increased, controllers became:

* bloated,
* difficult to reason about,
* and harder to debug.

---

## Final Decision

Responsibilities were separated into:

* routes
* controllers
* services
* utilities

### Final Roles

* Routes:
  * request mapping

* Controllers:
  * orchestration / response handling

* Services:
  * SQL + relational data retrieval

* Utilities:
  * transformation + helper logic

---

## Major Lesson

> Backend readability improves dramatically when orchestration and transformation logic are separated.

---

# 4. groupEvents() Revealed Presentation Model Architecture

## Initial Problem

JOIN-heavy relational queries produced:

* duplicate rows,
* repeated event records,
* and frontend complexity.

---

## Final Decision

Transformation logic was extracted into:

```txt
groupEvents()
```

This utility:

* normalized many-to-many relationships,
* aggregated subject tags,
* and produced frontend-facing presentation models.

---

## Major Lesson

The backend should not expose raw database rows.

Instead:

* backend APIs should shape data into:

  * frontend-friendly operational models.

---

# 5. Pagination + Filtering Introduced Real Relational Complexity

## Initial Assumption

Pagination originally appeared straightforward.

However, many-to-many relationships created:

* duplicated rows,
* inflated counts,
* and incorrect pagination behavior.

---

## Final Decision

Pagination evolved into:

* multi-query orchestration:

  * count query
  * ID query
  * retrieval query

This prevented:

* duplicate pagination records,
* broken sorting,
* and many-to-many expansion issues.

---

## Major Lesson

> Relational pagination becomes more complex when many-to-many JOINs are introduced.

---

# 6. Edit Workflows Are Different From Display Workflows

## Initial Assumption

Originally, event detail views and edit views were expected to share similar behavior.

This proved incorrect.

---

## Final Realization

Display pages required:

* formatted dates,
* formatted locations,
* presentation-ready fields,
* and normalized labels.

Edit pages required:

* raw IDs,
* editable datetime values,
* lookup hydration,
* and relational synchronization.

---

## Major Lesson

> Editable resource models and presentation models diverge significantly.

This realization strongly influenced:

* API design,
* frontend hydration logic,
* and backend response shaping.

---

# 7. Date & Time Handling 

## Initial Oversight

The original mock data did not meaningfully use:

* event times,
* timezone normalization,
* or realistic datetime behavior.

This oversight created confusion around:

* starts_at
* ends_at
* and datetime-local inputs.

---

## Final Realization

Using the SQL DATETIME fields was actually:

* the better schema design.

The real issue was:

* unrealistic seed data,
  not:
* poor schema structure.

---

## Major Lesson

> Realistic data modeling matters as much as schema structure.

This became apparent during:

* datetime-local normalization,
* frontend hydration,
* and timezone formatting work.

---

# 8. Keeping Create and Edit Forms Separate 

## Initial Question

Contemplated extracting:

```txt
EventForm
```

into a shared component.

---

## Final Decision

The project intentionally kept:

* CreateEventPage
* and EditEventPage

separate during Phase 1.

---

## Why

The workflows diverged significantly:

* Edit required hydration + normalization
* Create did not
* Relationship synchronization differed
* Async orchestration differed

Extracting too early would have:

* reduced readability,
* increased abstraction complexity,
* and been more difficult to debug, slowing the project down.

---

## Major Lesson

> Premature abstraction can reduce clarity during early architecture growth.

Keeping workflows explicit improved:

* coming back to later,
* debugging,
* and stabilization.

---

# 9. Lookup Tables Introduced Product Architecture Questions

## Current Phase 1 Behavior

Subjects, organizations, venues, and cities currently behave as:

* controlled lookup data.

Users select:

* pre-existing relational values
  through:
* dropdowns and hydrated lookup lists.

---

## Important Realization

A real-world product problem emerged:

> What happens when a user needs a venue or organizer that does not yet exist in the database?

---

## Current Decision

Phase 1 intentionally keeps:

* subjects,
* organizers,
* venues,
* and cities

as controlled relational selections.

This preserved:

* relational integrity,
* simpler validation,
* cleaner CRUD workflows,
* and reduced orchestration complexity.

---

## Future Phase 2 Direction

Future phases may:

* extract form workflows into reusable components,
* allow free-text relational creation,
* support dynamic venue creation,
* support free text workflows,
* and evolve lookup tables into user-managed resources.

---

## Major Lesson

> Real systems must balance relational integrity with user flexibility.

Phase 1 intentionally prioritized:

* controlled structure
  over:
* unrestricted extensibility.

This kept the architecture stable while foundational CRUD concepts were developed.

---

# 10. Frontend Architecture Improved By Staying Thin

## Initial Risk

There was early risk of:

* overbuilding frontend architecture,
* adding unnecessary state systems,
* and introducing React complexity too early.

---

## Final Decision

The frontend remained intentionally lightweight:

* page orchestration
* thin presentation components
* backend-driven workflows
* explicit fetch behavior

No:

* Redux
* React Query
* extra libraries
* or heavy frontend abstraction layers

were introduced during Phase 1.

---

## Major Lesson

> Frontend complexity should remain proportional to actual workflow needs.

This helped the frontend remain:

* understandable,
* operational,
* and coherent.

---

# 11. Stabilization Is A Separate Engineering Phase

## Important Realization

As the project matured, debugging residue accumulated:

* temporary routes
* console logs
* duplicate conditions
* startup debugging
* dead logic
* abandoned experiments

---

## Final Stabilization Work

The project entered a dedicated stabilization phase involving:

* code review
* cleanup
* architectural clarification
* styling consistency
* workflow validation
* and debugging residue removal

---

## Major Lesson

> Building software and stabilizing software are different engineering activities.

The stabilization phase dramatically improved:

* readability,
* professionalism,
* and architectural coherence.

---

# 12. X_EM Became More Coherent By Remaining Smaller

## Final Reflection

One of the most important lessons from the project:

> Reducing scope improved architectural quality.

By intentionally resisting:

* uncontrolled feature growth,
* premature abstraction,
* and frontend overengineering,

the project evolved into:

* a stable backend-first platform,
* with coherent relational workflows,
* and realistic operational architecture.

The final Phase 1 system now demonstrates:

* relational CRUD workflows
* filtering/sorting/pagination
* service/controller separation
* many-to-many synchronization
* backend presentation shaping
* operational frontend orchestration
* and intentional architectural restraint

without collapsing under unnecessary complexity.
