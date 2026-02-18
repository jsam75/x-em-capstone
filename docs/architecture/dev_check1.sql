-- add SHOW/DESCRIBE statements for each table so you can check it in terminal,
-- this is also MySQL specific because you have log out/in of MySQL for every
-- check you want to do.  These statements allow you to remain inside MySQL
-- and use the SOURCE command to run the whole file as you build it.

SHOW TABLES LIKE 'users';
DESCRIBE users;

SHOW TABLES LIKE 'organizations';
DESCRIBE organizations;

SHOW TABLES LIKE 'venues';
DESCRIBE venues;

SHOW TABLES LIKE 'events';
DESCRIBE events;

SHOW TABLES LIKE 'ticket_types';
DESCRIBE ticket_types;

SHOW TABLES LIKE 'registrations';
DESCRIBE registrations;

SHOW TABLES LIKE 'payments';
DESCRIBE payments;

SHOW TABLES LIKE 'tickets';
DESCRIBE tickets;

SHOW TABLES LIKE 'check_ins';
DESCRIBE check_ins;