import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();

   return (
    
    <div
  onClick={() => navigate(`/events/${event.id}`)}
  className="cursor-pointer bg-[#132b45] text-[#fff5e6] border border-[#0b213a] rounded-lg p-5 shadow-sm 
  hover:bg-[#1a3a5c] hover:scale-[1.01] transition"
>
      <h3 className="text-xl font-semibold mb-2 text-[#fff5e6]">{event.title}</h3>

      <p className="text-sm text-[#9fb7c9]">
        <strong>Date:</strong> {event.date}
      </p>

      <p className="text-sm text-[#9fb7c9]">
        <strong>Location:</strong> {event.location}
      </p>

      <p className="text-sm text-[#9fb7c9]">
        <strong>Organizer:</strong> {event.organizerName}
      </p>

      <p className="text-sm text-[#9fb7c9]">
        <strong>Subjects:</strong> {event.subjectTags?.join(", ")}
      </p>

      <p className="text-sm text-[#9fb7c9]">
        <strong>Status:</strong>{" "}
        <span
          className={
            event.published
              ? "text-green-400 font-medium"
              : "text-red-400 font-medium"
          }
        >
          {event.published ? "Published" : "Unpublished"}
        </span>
      </p>
    </div>
  );
}

export default EventCard;