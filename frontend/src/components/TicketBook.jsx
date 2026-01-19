import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../services/api';
import EventList from './EventList';
import BookingModal from './BookingModal';
import SuccessModal from './SuccessModal';
import AddEventModal from './AddEventModal';

const TicketBook = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);
    const [bookedEvent, setBookedEvent] = useState(null);
    const [showAddEvent, setShowAddEvent] = useState(false);

    // Fetch events on component mount
    const fetchEvents = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllEvents();
            setEvents(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle book button click
    const handleBookClick = (event) => {
        setSelectedEvent(event);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    // Handle successful booking
    const handleBookingSuccess = async (result, eventData) => {
        setBookingResult(result);
        setBookedEvent(eventData); // Store the event data for SuccessModal
        setSelectedEvent(null);
        
        // Refresh events from server to get real-time seat availability
        try {
            const response = await getAllEvents();
            setEvents(response.data);
        } catch (err) {
            // If refresh fails, update locally as fallback
            const bookedEventId = result.booking?.event?._id || result.booking?.event || eventData?._id;
            if (bookedEventId && result.updatedAvailableSeats !== undefined) {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event._id === bookedEventId
                            ? { ...event, availableSeats: result.updatedAvailableSeats }
                            : event
                    )
                );
            }
        }
    };

    // Handle success modal close
    const handleCloseSuccessModal = () => {
        setBookingResult(null);
        setBookedEvent(null);
    };

    // Handle add event modal
    const handleOpenAddEvent = () => {
        setShowAddEvent(true);
    };

    const handleCloseAddEvent = () => {
        setShowAddEvent(false);
    };

    // Handle event created
    const handleEventCreated = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setShowAddEvent(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">TicketBook</h1>
                                <p className="text-sm text-gray-500">Book tickets for amazing events</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleOpenAddEvent}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Event
                            </button>
                            <button
                                onClick={fetchEvents}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Section Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
                    <p className="text-gray-600">Browse and book tickets for exciting events near you</p>
                </div>

                {/* Events List */}
                <EventList
                    events={events}
                    loading={loading}
                    error={error}
                    onBookClick={handleBookClick}
                />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-500 text-sm">
                        Ticket Reservation System - Built with MERN Stack
                    </p>
                </div>
            </footer>

            {/* Booking Modal */}
            {selectedEvent && (
                <BookingModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onBookingSuccess={handleBookingSuccess}
                />
            )}

            {/* Success Modal */}
            {bookingResult && (
                <SuccessModal
                    booking={bookingResult}
                    event={bookedEvent}
                    onClose={handleCloseSuccessModal}
                />
            )}

            {/* Add Event Modal */}
            {showAddEvent && (
                <AddEventModal
                    onClose={handleCloseAddEvent}
                    onEventCreated={handleEventCreated}
                />
            )}
        </div>
    );
};

export default TicketBook;