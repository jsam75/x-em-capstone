import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EventDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  // EARLY RETURNS 
  if (loading) return <p className="p-6">Loading event...</p>;
  if (error) return <p className="p-6">Something went wrong.</p>;
  if (!event) return <p className="p-6">Event not found.</p>;

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

  return (
    <main className="min-h-screen bg-[#0b213a] text-[#fff5e6] p-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#9fb7c9] hover:text-white"
      >
        ← Back to Events
      </button>

      {/* Container */}
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <section className="bg-[#132b45] p-4 rounded">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-sm text-[#9fb7c9]">{event.date}</p>
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

        {/* Delete Button */}
    <div className="flex justify-center mt-4">
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
>
        Delete Event
    </button>
  </div>

    </main>
  );
}