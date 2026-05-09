import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import CreateEventPage from "../pages/CreateEventPage";
import EditEventPage from "../pages/EditEventPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
      </Routes>
    </BrowserRouter>
  );
}
