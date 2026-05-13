import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


//=====================
// DATETIME FORMATTING
//======================

const formatForDateTimeLocal = (dateString) => {
  const date = new Date(dateString);

  const offset = date.getTimezoneOffset();

  const local = new Date(
    date.getTime() - offset * 60000
  );

  return local.toISOString().slice(0, 16);
};

export default function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();

//==============
// STATE
//==============

// STATE - Hydrated async state because an existing event is being edited
  const [form, setForm] = useState(null);

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [venueOptions, setVenueOptions] = useState([]);

//=============
// EFFECTS
//=============

  // EFFECT #1 - fetch dropdown options
  useEffect(() => {
    async function fetchSubjects() {
      const [subjectsRes, orgsRes, venuesRes] = await Promise.all([
        fetch("/api/events/subjects"),
        fetch("/api/events/organizations"),
        fetch("/api/events/venues")
      ]);
     const subjects = await subjectsRes.json();
     const orgs = await orgsRes.json();
     const venues = await venuesRes.json();

      setSubjectOptions(subjects.data);
      setOrganizationOptions(orgs.data);
      setVenueOptions(venues.data);
    }

    fetchSubjects();
  }, []);


  //EFFECT #2 - fetch event being edited
  useEffect(() => {
  async function loadEvent() {
    const res = await fetch(`/api/events/${id}/edit`);
    const result = await res.json();

    setForm({
        ...result.data,
    starts_at: formatForDateTimeLocal(result.data.starts_at),
    ends_at: formatForDateTimeLocal(result.data.ends_at)
});
  
    setSelectedSubjects(
        result.data.subjectTags || []
    );
  }

  loadEvent();
}, [id]);

//===========
// HANDLERS
//===========

    const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (name) => {
    setSelectedSubjects((prev) =>
      prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          subjectTags: selectedSubjects 
        })
      });

      navigate(`/events/${id}`, {
        state: {updated: true}
      });
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

//======================
// RENDER STATES
//======================

  if (!form) {
  return <p>Loading...</p>;
}

//======================
// MAIN RENDER
//======================

   return (
    <main className="min-h-screen bg-[#0b213a] text-[#fff5e6] p-6">

        {/* Back */}
      <button
        onClick={() => navigate("/events")}
        className="mb-4 text-[#9fb7c9] hover:text-white"
      >
        ← Back to Events
      </button>

      <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">Update Event Details</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] cursor-pointer"
            required
          />

{/* Subjects Scroll Box */}
<div className="bg-[#132b45] p-4 rounded">
  <p className="font-semibold mb-2">Subjects</p>

  <div className="max-h-40 overflow-y-auto space-y-2 border border-[#9fb7c9] rounded p-2
  hover:border-[#006d77] hover:bg-[#132b45]
  focus-within:border-[#006d77] focus-within:bg-[#132b45]"
  >
    {subjectOptions?.map((subject) => (
      <label 
        key={subject.subject_id} 
        className="flex items-center gap-2 cursor-pointer"
        >
        <input
          type="checkbox"
          checked={selectedSubjects.includes(subject.name)}
          onChange={() => handleSubjectChange(subject.name)}
        />
        {subject.name}
      </label>
    ))}
  </div>

   {selectedSubjects.length > 0 && (
    <p className="mt-2 text-sm text-[#9fb7c9]">
      Selected: {selectedSubjects.join(", ")}
    </p>
  )}
</div>

<select
  name="organization_id"
  value={form.organization_id}
  onChange={handleChange}
  className="w-full p-2 rounded bg-[#132b45] text-white cursor-pointer"
>
  <option value="">Select Organizer</option>

  {organizationOptions?.map((org) => (
    <option key={org.organization_id} value={org.organization_id}>
      {org.name}
    </option>
  ))}
</select>


          <textarea          
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] 
            border border-[#9fb7c9]
            focus:outline-none
            focus:ring-2
            focus:ring-[#006d77]
            cursor-pointer"
          />
        
     <select
            name="venue_id"
            value={form.venue_id}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] cursor-pointer"
        >
            {venueOptions.map((venue) => (
        <option
             key={venue.venue_id}
            value={venue.venue_id}
        >
            {venue.city}, {venue.state}
        </option>
  ))}
    </select>


          <input
            type="datetime-local"
            name="starts_at"
            value={form.starts_at}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] text-white border border-[#9fb7c9] [color-scheme:dark]
            hover:border-[#006d77] hover:bg-[#132b45] cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#006d77] cursor-pointer"
            required
          />


          <input
            type="datetime-local"
            name="ends_at"
            value={form.ends_at}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] text-white border border-[#9fb7c9] [color-scheme:dark]
            hover:border-[#006d77] hover:bg-[#132b45] cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#006d77] cursor-pointer"
            required
          />


         <button
            type="submit"
            className="bg-[#006d77] px-4 py-2 rounded hover:bg-[#005f66]"
          >
            Save Changes
        </button>

        </form>

       </div>
    </main>
  );
}