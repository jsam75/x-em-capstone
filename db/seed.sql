/* =========================================================
   ORGANIZATIONS
   ========================================================= */

INSERT INTO organizations (name) VALUES
('Texas Educators Guild'),
('Japanese Teachers Guild of America'),
('Algebra Addicts'),
('Poly-sci Philanthropists Society'),
('Calculating Calculites'),
('Food Nerds');


/* =========================================================
   VENUES
   ========================================================= */

INSERT INTO venues (name, city, state) VALUES
('San Antonio Convention Center', 'San Antonio', 'TX'),
('Honolulu Convention Center', 'Honolulu', 'HI'),
('Salt Palace Convention Center', 'Salt Lake City', 'UT'),
('San Diego Conference Hall', 'San Diego', 'CA'),
('Tampa Education Center', 'Tampa', 'FL'),
('Virtual Event', 'Miami', 'FL');


/* =========================================================
   EVENTS
   Note: starts_at uses local venue time (9 AM)
   ========================================================= */

INSERT INTO events (organization_id, venue_id, name, description, starts_at, ends_at, is_published, format)
VALUES
(1,1,'STEM Instructional Design Conference',
 'A one-day conference focused on hands-on STEM pedagogy.',
 '2026-06-20 09:00:00','2026-06-20 17:00:00', TRUE,'in-person'),

(2,2,'Japanese Language Pedagogy',
 'A one-day conference focused on techniques for teaching western students Japanese.',
 '2026-07-18 09:00:00','2026-07-18 17:00:00', TRUE,'in-person'),

(3,3,'Algebra for All',
 'A one-day conference focused on methods for teaching kids non-traditional approaches to algebra.',
 '2026-08-15 09:00:00','2026-08-15 17:00:00', TRUE,'in-person'),

(4,4,'International Wealth and Power',
 'A one-day conference devoted to updating educators on world events and how to incorporate new information in the classroom.',
 '2026-09-19 09:00:00','2026-09-19 17:00:00', FALSE,'in-person'),

(5,5,'Catching Calculus',
 'A one-day conference focusing on making calculus achievable for students of all levels.',
 '2026-10-17 09:00:00','2026-10-17 17:00:00', TRUE,'in-person'),

(6,6,'Diet and Nutrition Updates',
 'A one-day conference for the administrators of school lunches.',
 '2026-11-14 09:00:00','2026-11-14 17:00:00', TRUE,'online');


/* =========================================================
   TICKET TYPES (single tier for demo)
   ========================================================= */

INSERT INTO ticket_types (event_id, name, price_cents, capacity)
VALUES
(1,'General Admission',12500,250),
(2,'General Admission',10000,275),
(3,'General Admission',22500,300),
(4,'General Admission',25000,350),
(5,'General Admission',20000,225),
(6,'General Admission',22500,400);


/* =========================================================
   SUBJECTS
   ========================================================= */

INSERT INTO subjects (name) VALUES
('STEM'),('Curriculum'),('Instruction'),
('Japanese'),('Asian Studies'),
('Math'),('Algebra'),('Calculus'),
('Economics'),('Social Studies'),('Updates'),
('Food'),('Diet'),('Nutrition');


/* =========================================================
   EVENT SUBJECT LINKS
   ========================================================= */

INSERT INTO event_subjects (event_id, subject_id) VALUES
-- evt-001
(1,1),(1,2),(1,3),
-- evt-002
(2,4),(2,5),
-- evt-003
(3,6),(3,7),
-- evt-004
(4,9),(4,10),(4,11),
-- evt-005
(5,6),(5,8),(5,3),
-- evt-006
(6,12),(6,13),(6,14);
