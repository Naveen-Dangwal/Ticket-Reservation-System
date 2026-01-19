import { API_BASE_URL } from '../config';

// Fetch all events
export const getAllEvents = async () => {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
    }
    return data;
};

// Fetch single event by ID
export const getEventById = async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event');
    }
    return data;
};

// Create a booking
export const createBooking = async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
    }
    return data;
};

// Get bookings by email
export const getBookingsByEmail = async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/email/${email}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
    }
    return data;
};

// Create a new event
export const createEvent = async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
    }
    return data;
};
