import EventCard from "./EventCard";

function EventList({ events }) {
  if (events.length === 0) {
    return <p className="text-gray-200">No events found.</p>;
  }

  return (
    <div className="space-y-4">

    <div className="text-center mt-10">
  <p className="text-lg text-[#fff5e6]">No events found</p>
  <p className="text-sm text-[#9fb7c9] mt-2">
    Try adjusting your filters
  </p>
</div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>



  );
}

export default EventList;