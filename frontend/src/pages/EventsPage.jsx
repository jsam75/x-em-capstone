import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EventList from "../components/EventList";
import EventFilters from "../components/EventFilters";
import PaginationControls from "../components/PaginationControls";
import ActiveFilters from "../components/ActiveFilters";

function EventsPage() {
    const navigate = useNavigate();

  //=======================
  // STATE
  //=======================

  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [sortBy, setSortBy] = useState("starts_at");
  const [sortOrder, setSortOrder] = useState("ASC");

  const [meta, setMeta] = useState({});
  const [offset, setOffset] = useState(0);
  
  //===================
  // DATA FETCHING
  //===================
    async function fetchEvents() {

    try {
      const params = new URLSearchParams();

      if (city) params.append("city", city);
      
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (subjects.length > 0) {
      params.append("subject", subjects.join(","));
    }

      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      params.append("offset", offset);

      const queryString = params.toString();

      const url = `/api/events${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await fetch(url);
      const result = await res.json();

      setEvents(result.data);
      setMeta(result.meta);

    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }

//========================
// EFFECTS
//========================

  useEffect(() => {
    fetchEvents();
  }, [city, startDate, endDate, subjects, sortBy, sortOrder, offset]);

  useEffect(() => {
  async function loadSubjects() {

    const res = await fetch("/api/subjects");
    const result = await res.json();

    setSubjectOptions(result.data);
  }

  loadSubjects();
}, []);

//================
// FILTER
//================

function clearFilters() {
  setCity("");
  setStartDate("");
  setEndDate("");
  setSubjects([]);

  setOffset(0); // Reset pagination when clearing filters
}

//==============
// RENDER
//==============
  return (
     <main className="min-h-screen bg-[#0b213a] p-6">
        <div className="max-w-5xl mx-auto">
      <h1 className="text-5xl 
          tracking-[0.10em]
          text-[#fff5e6] 
          mb-8 
          drop-shadow-[0_0_8px_rgba(255,245,230,0.15)]"
       style={{ fontFamily: "Nexus" }}>
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
  sortBy={sortBy}
  setSortBy={setSortBy}
  sortOrder={sortOrder}
  setSortOrder={setSortOrder}
  clearFilters={clearFilters}
/> 

<ActiveFilters
  city={city}
  subjects={subjects}
  startDate={startDate}
  endDate={endDate}
  clearFilters={clearFilters}
/>

<button
  onClick={() => navigate("/events/new")}
  className="mb-4 bg-[#006d77] text-[#fff5e6] px-4 py-2 rounded hover:bg-[#005f66]"
>
  + Create Event
</button>

 <EventList events={events} />

 <PaginationControls meta={meta} setOffset={setOffset} />

      </div>
   </main>
  );
}

export default EventsPage;


