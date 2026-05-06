import { useEffect, useState } from "react";

import EventList from "../components/EventList";
import EventFilters from "../components/EventFilters";
import PaginationControls from "../components/PaginationControls";
import ActiveFilters from "../components/ActiveFilters";

function EventsPage() {
  
  // STATE
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  const [meta, setMeta] = useState({});
  const [offset, setOffset] = useState(0);
  
  // FETCH EVENTS
    async function fetchEvents() {

      console.log("startDate:", startDate);
      console.log("endDate:", endDate);
     
    try {
      const params = new URLSearchParams();

      if (city) params.append("city", city);
      
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (subjects.length > 0) {
      params.append("subject", subjects.join(","));
    }

      params.append("offset", offset);

      const queryString = params.toString();

      const url = `http://localhost:3000/api/events${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching:", url);

      const res = await fetch(url);
      const result = await res.json();

      setEvents(result.data);
      setMeta(result.meta);

    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }

 // EFFECT: RUN ON FILTER CHANGE
  useEffect(() => {
    fetchEvents();
  }, [city, startDate, endDate, subjects, offset]);

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
  setStartDate("");
  setEndDate("");
  setSubjects([]);

  setOffset(0); // Reset pagination when clearing filters
}

  // RENDER
  return (
     <main className="min-h-screen bg-[#0b213a] p-6">
        <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#fff5e6] mb-6 tracking-wide">
          X_EM Events
      </h1>

  <EventFilters
  city={city}
  setCity={setCity}
  startDate={startDate}
  setStartDate={setStartDate}
  endDate={endDate}
  setEndDate={setEndDate}
  subjects={subjects}
  setSubjects={setSubjects}
  subjectOptions={subjectOptions}
  clearFilters={clearFilters}
/> 

<ActiveFilters
  city={city}
  subjects={subjects}
  startDate={startDate}
  endDate={endDate}
  clearFilters={clearFilters}
/>


 <EventList events={events} />

 <PaginationControls meta={meta} setOffset={setOffset} />

      </div>
   </main>
  );
}

export default EventsPage;


