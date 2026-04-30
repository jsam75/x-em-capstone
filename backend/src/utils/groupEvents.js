export const groupEvents = (rows) => {
  const eventsMap = {};

  console.log(rows.map(r => r.event_id));

  // Transform database rows into frontend-friendly format
  rows.forEach((row) => {
    if (!eventsMap[row.event_id]) {
      eventsMap[row.event_id] = {
        id: row.event_id,
        title: row.name,
        date: row.starts_at
          ? new Date(row.starts_at).toISOString().split("T")[0]
          : null,
        location: row.city && row.state
          ? `${row.city}, ${row.state}`
          : null,
        city: row.city || null,
        state: row.state || null,
        price: row.price_cents ? row.price_cents / 100 : null,
        capacity: row.capacity || null,
        organizerName: row.organizer_name || null,
        description: row.description || null,
        published: Boolean(row.is_published),
        subjectTags: []
      };
    }

    if (row.subject_name) {
      eventsMap[row.event_id].subjectTags.push(row.subject_name);
    }
  });

  return Object.values(eventsMap);
};