import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import OrganizerDashboardPage from '../pages/OrganizerDashboardPage';
import CreateEventPage from '../pages/CreateEventPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes () {
    return (
        <Routes>
            <Route path="/" element = {<LandingPage />} />

            <Route path="/events" element = {<EventsPage />} />
            <Route path="/events/:eventId" element = {<EventDetailPage />} />

            <Route path="organizer" element = {<OrganizerDashboardPage />} />
            <Route path="organizer/events/new" element = {<CreateEventPage />} />

            <Route path="/login" element = {<LoginPage />} />
            <Route path="/register" element = {<RegisterPage />} />

            <Route path="/404" element = {<NotFoundPage />} />
            <Route path="*" element = {<Navigate to="/404" replace />} />
        </Routes>
    );
}