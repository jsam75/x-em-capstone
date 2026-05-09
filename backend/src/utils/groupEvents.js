export const groupEvents = (rows) => {
  const eventsMap = new Map();

  console.log(rows.map(r => r.event_id));

  rows.forEach((row) => {
    if (!eventsMap.has(row.event_id)) {

      const startTime = row.starts_at
             ? new Date(row.starts_at).toLocaleTimeString(
             "en-US",
          {
             hour: "numeric",
             minute: "2-digit"
          }
        )
          : null;

      const endTime = row.ends_at
          ? new Date(row.ends_at).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
           minute: "2-digit"
          }
        )
      : null;

      eventsMap.set(row.event_id, {
        id:    row.event_id,
        title: row.name,
        date:  row.starts_at
              ? new Date(row.starts_at).toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
              year: "numeric"
          })
            :null,
        timeRange:  startTime && endTime
                    ? `${startTime} - ${endTime}`
                    : null,
        location: row.city && row.state
                  ? `${row.city}, ${row.state}`
                  : null,
        city:   row.city || null,
        state:  row.state || null,
        price:  row.price_cents ? row.price_cents / 100 : null,
        capacity: row.capacity || null,
        organizerName: row.organizer_name || null,
        description: row.description || null,
        published: Boolean(row.is_published),
        subjectTags: []
      });
    }

    if (row.subject_name) {
      eventsMap.get(row.event_id).subjectTags.push(row.subject_name);
    }
  });

  return Array.from(eventsMap.values());
};