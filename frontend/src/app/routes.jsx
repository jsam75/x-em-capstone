import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
