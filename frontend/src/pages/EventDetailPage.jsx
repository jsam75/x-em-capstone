import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EventDetailPage() {

  //===========
  // STATE 
  //===========

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

//=================
// DATA FETCHING
//=================
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:3000/api/events/${id}`);
        const result = await res.json();

        setEvent(result.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

//================
// RENDER STATES
//================
  
  if (loading) return <p className="p-6">Loading event...</p>;
  if (error) return <p className="p-6">Something went wrong.</p>;
  if (!event) return <p className="p-6">Event not found.</p>;

//=====================
// DELETE WORKFLOW
//=====================
 const handleDelete = async () => {
  const confirmDelete = window.confirm("Delete this event?");

  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:3000/api/events/${id}`, {
      method: "DELETE"
    });

    navigate("/");
  } catch (err) {
    console.error("Error deleting event:", err);
  }
};

//================
// MAIN RENDER
//================

  return (
    <main className="min-h-screen bg-[#0b213a] text-[#fff5e6] p-6">


      {/* Back */}
      <button
        onClick={() => navigate("/events")}
        className="mb-4 text-[#9fb7c9] hover:text-white"
      >
        ← Back to Events
      </button>

      {/* Container */}
      <div className="max-w-3xl mx-auto space-y-6">

    {/* Update Successful Message */}
        {location.state?.updated && (
    <p className=" mb-4
        p-3
        rounded-lg
        border border-[#38a169]
        bg-[#1f4d36]
        text-[#e6fff2]
        font-semibold
        shadow-md">
          Event updated successfully.
    </p>
)}

        {/* Header */}
        <section className="bg-[#132b45] p-4 rounded">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-sm text-[#9fb7c9]">{event.date}</p>
           <p className="text-sm text-[#9fb7c9]">{event.timeRange}</p>
          <p className="text-sm text-[#9fb7c9]">{event.location}</p>
        </section>

        {/* Description */}
        <section className="bg-[#132b45] p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p>{event.description}</p>
        </section>

        {/* Metadata */}
        <section className="bg-[#132b45] p-4 rounded">
          <p className="mb-2">
            <span className="font-semibold">Organizer:</span>{" "}
            {event.organizerName}
          </p>

          <div>
            <span className="font-semibold">Subjects:</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {event.subjectTags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#006d77] px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

              
  <div className="flex justify-between items-center mt-6">
  {/* Edit Event Page Link */}
  <Link
    to={`/events/${event.id}/edit`}
    className="inline-block mb-4 bg-[#006d77] px-4 py-2 rounded hover:bg-[#005f66] transition-colors"
  >
     ✏️ Edit Event
  </Link>

   
  {/* Delete Button */}
  <button
    onClick={handleDelete}
    className="bg-red-600 text-[#fff5e6] px-4 py-2 rounded hover:bg-red-700 transition-colors"
  >
    Delete Event
  </button>
</div>
</main>
  );
}