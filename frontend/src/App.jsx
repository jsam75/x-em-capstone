// Thin UI for React - needed a visual aide - totally not optimized and a mess 
// right now, but it works and is a good starting point for future frontend build. 
import { useEffect, useState } from "react";

function App() {
  
  // STATE
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [published, setPublished] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  
  // FETCH EVENTS
    async function fetchEvents() {
    try {
      const params = new URLSearchParams();

      if (city) params.append("city", city);
      if (published) params.append("published", published);

      if (subjects.length > 0) {
      params.append("subject", subjects.join(","));
    }

      const queryString = params.toString();

      const url = `http://localhost:3000/api/events${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching:", url);

      const res = await fetch(url);
      const result = await res.json();

      setEvents(result.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }

  // EFFECT: RUN ON FILTER CHANGE
  useEffect(() => {
    fetchEvents();
  }, [city, published, subjects]);

  useEffect(() => {
  async function loadSubjects() {

    const res = await fetch("http://localhost:3000/api/subjects");
    const result = await res.json();

    console.log("Subjects API result:", result);
    console.log("subjectOptions state:", subjectOptions);

    setSubjectOptions(result.data);
  }

  loadSubjects();
}, []);

function clearFilters() {
  setCity("");
  setPublished("");
  setSubjects([]);
}

  // RENDER
  return (
    <main style={{ padding: "20px" }}>
      <h1>X_EM Events</h1>

      {
          // ADD FILTERS
  }

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          City:
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">All</option>
             <option value="San Antonio">San Antonio, TX</option>
             <option value="Honolulu">Honolulu, HI</option>
             <option value="Salt Lake City">Salt Lake City, UT</option>
             <option value="San Diego">San Diego, CA</option>
             <option value="Tampa">Tampa, FL</option>
             <option value="Miami">Miami, FL</option>
          </select>
        </label>

        <label>
          Published:
          <select
            value={published}
            onChange={(e) => setPublished(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
            Subjects:
      <select
           multiple
          value={subjects}
          onChange={(e) => {
           const selected = Array.from(e.target.selectedOptions, option => option.value);
          setSubjects(selected);
        }}
        style={{ marginLeft: "10px", height: "80px" }}
      >
        {subjectOptions.map((s) => (
        <option key={s.name} value={s.name}>
        {s.name}
      </option>
    ))}

     
      </select>
</label>

        <button onClick={clearFilters} style={{ marginLeft: "20px" }}>
          Clear Filters
          </button>     

      </div>

      {
        // ADD EVENT LIST
      }

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Organizer:</strong> {event.organizerName}</p>
            <p><strong>Subjects:</strong> {event.subjectTags?.join(", ")}</p>
            <p><strong>Published:</strong> {event.published ? "Yes" : "No"}</p>

      
          </div>
        ))
      )}
    </main>
  );
}

export default App;

  
