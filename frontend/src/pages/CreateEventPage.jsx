import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEventPage() {
  const navigate = useNavigate();

  // STATE
  const [form, setForm] = useState({
    name: "",
    description: "",
    starts_at: "",
    ends_at: "",
    organization_id: "",
    venue_id: 1,
    is_published: 1
  });

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]);


  // EFFECT (runs once on load)
  useEffect(() => {
    async function fetchSubjects() {
      const [subjectsRes, orgsRes] = await Promise.all([
        fetch("http://localhost:3000/api/events/subjects"),
        fetch("http://localhost:3000/api/events/organizations")
      ]);
     const subjects = await subjectsRes.json();
     const orgs = await orgsRes.json();

      setSubjectOptions(subjects.data);
      setOrganizationOptions(orgs.data);
    }

    fetchSubjects();
  }, []);


  // HANDLERS
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
      const res = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          subjectTags: selectedSubjects 
        })
      });

      const result = await res.json();

      console.log("Created:", result);

      navigate("/");
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };


   return (
    <main className="min-h-screen bg-[#0b213a] text-[#fff5e6] p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45]"
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
            className="w-full p-2 rounded bg-[#132b45]"
          />
        
     <select
            name="venue_id"
            value={form.venue_id}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45]"
        >
        <option value={1}>Miami, FL</option>
        <option value={2}>San Antonio, TX</option>
        <option value={3}>Tampa, FL</option>
    </select>


          <input
            type="datetime-local"
            name="starts_at"
            value={form.starts_at}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] text-white border border-[#9fb7c9] [color-scheme:dark]
            hover:border-[#006d77] hover:bg-[#132b45]
            focus:outline-none focus:ring-2 focus:ring-[#006d77] cursor-pointer"
            required
          />


          <input
            type="datetime-local"
            name="ends_at"
            value={form.ends_at}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#132b45] text-white border border-[#9fb7c9] [color-scheme:dark]
            hover:border-[#006d77] hover:bg-[#132b45]
            focus:outline-none focus:ring-2 focus:ring-[#006d77] cursor pointer"
            required
          />


         <button
            type="submit"
            className="bg-[#006d77] px-4 py-2 rounded hover:bg-[#005f66]"
          >
            Create Event
        </button>

        </form>

    <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-[#9fb7c9] hover:text-white"
>
        ← Back
</button>

      </div>
    </main>
  );
}