-- X-EM SCHEMA v. 1
-- =====================================================================================================

-- Turn Off FK dependency rules, set = 0,  while building schema; set = 1 after build to turn back on.
-- Allows you to incrementally check the build one table DROP/CREATE statement at a time.

SET FOREIGN_KEY_CHECKS = 1;

-- DROP 
DROP TABLE IF EXISTS check_ins;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS ticket_types;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS users;

/* ==================================================================================================== */

-- CREATE

/* ==================================================================================================== */
-- Core Entities - first set of tables are Lookup Tables
/* ===================================================================================================== */

CREATE TABLE users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'attendee',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email)
) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Last line is MySQL specific, tells MySQL what storage engine to use (historically they've had several)
-- and what character set and collation to use for the table.  Basically, this table behaves like a 
-- relational database table, and supports Unicode characters.



CREATE TABLE organizations (
    organization_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_organizations_name (name)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SHOW TABLES LIKE 'organizations';
DESCRIBE organizations;



CREATE TABLE venues (
    venue_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    venue_type VARCHAR(50) NOT NULL DEFAULT 'physical',

/* Keep flexible with location details, as some venues may be virtual and not have a physical address. */
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(50) NULL,
    postal_code VARCHAR(20) NULL,
    virtual_url VARCHAR(500) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_venues_name (name)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ==================================================================================== */
-- Events - Core Entity, but uses FKs to organizations and venues
/* ===================================================================================== */

CREATE TABLE events (
    event_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    /* FKs */
    organization_id BIGINT UNSIGNED NOT NULL,
    venue_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT NULL,

    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_organization
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT fk_events_venue
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT chk_events_time_order 
        CHECK (starts_at < ends_at), /* ensure event start is before end */

    UNIQUE KEY uq_events_org_name_starts (organization_id, name, starts_at) /* prevent duplicate event names for the same organization */
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ==================================================================================== */
-- Ticket Types - Core Entity, but uses FK to events
/* ===================================================================================== */

CREATE TABLE ticket_types (
    ticket_type_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    /* FK */
    event_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(100) NOT NULL, /* e.g. "General Admission", "VIP" */
    price_cents INT UNSIGNED NOT NULL, 
    capacity INT UNSIGNED NULL, /* NULL means unlimited capacity (virtual conference) */
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_types_event
    FOREIGN KEY (event_id) REFERENCES events(event_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    UNIQUE KEY uq_ticket_types_event_name (event_id, name) /* prevent duplicate ticket type names for the same event */
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ==================================================================================== */
-- Registrations - Transactional Entity; user and event participation
/* ===================================================================================== */

CREATE TABLE registrations (
    registration_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    /* FKs */
    user_id BIGINT UNSIGNED NOT NULL,
    event_id BIGINT UNSIGNED NOT NULL,
    ticket_type_id BIGINT UNSIGNED NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'pending', /* e.g. pending, confirmed, cancelled */
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registrations_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_registrations_event
    FOREIGN KEY (event_id) REFERENCES events(event_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT fk_registrations_ticket_type
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(ticket_type_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    UNIQUE KEY uq_registrations_user_ticket (user_id, event_id) /* prevent duplicate registrations for the same event */
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ==================================================================================== */
-- Payments - Lifecycle Entity, registration payment; uses FK to registrations
/* ===================================================================================== */

CREATE TABLE payments (
    payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    /* FK */
    registration_id BIGINT UNSIGNED NOT NULL,

    amount_cents INT UNSIGNED NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',

    status VARCHAR(50) NOT NULL DEFAULT 'pending', /* e.g. pending, completed, failed */
    provider VARCHAR(30) NOT NULL DEFAULT 'mock',  /* keep it fake for now */
    provider_reference VARCHAR(255) NULL, /* e.g. transaction ID from payment provider */

created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_registration
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT

    /* Note: Do not make registration_id UNIQUE to allow for multiple payment attempts. */
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ==================================================================================== */
-- Tickets - Transactional Entity, issued admission credential; uses FK to registrations
/* ===================================================================================== */

CREATE TABLE tickets (
    ticket_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    /* FK */
    registration_id BIGINT UNSIGNED NOT NULL,

    ticket_number VARCHAR(100) NOT NULL UNIQUE, /* e.g. "TICKET-123456789" */
    qr_code TEXT NOT NULL, /* QR code data for scanning */
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMP NULL, /* when the ticket was used */

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tickets_registration
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


/* ==================================================================================================== */
-- Check Ins - Lifecycle Entity, tracks ticket validation & attendance; uses FK to tickets
/* ===================================================================================================== */

CREATE TABLE check_ins (
    check_in_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    /* FK */
    ticket_id BIGINT UNSIGNED NOT NULL,

    checked_in_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_check_ins_ticket
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    UNIQUE KEY uq_check_ins_ticket (ticket_id) /* prevent multiple check-ins for the same ticket */
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 /* After creating all the tables, turn FK checks back on. */

