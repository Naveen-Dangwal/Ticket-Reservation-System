const express = require('express');
const router = express.Router();

const { getAllEvents,getEventById, createEvent, updateEvent,deleteEvent,} = require('../controllers/eventController');

const {createBooking, getAllBookings, getBookingById,getBookingsByEmail,cancelBooking,} = require('../controllers/bookingController');

// ============ EVENT ROUTES ============
// GET /api/events - Get all events
router.get('/events', getAllEvents);

// GET /api/events/:id - Get single event
router.get('/events/:id', getEventById);

// POST /api/events - Create new event
router.post('/events', createEvent);

// PUT /api/events/:id - Update event
router.put('/events/:id', updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/events/:id', deleteEvent);

// ============ BOOKING ROUTES ============
// POST /api/bookings - Create new booking
router.post('/bookings', createBooking);

// GET /api/bookings - Get all bookings
router.get('/bookings', getAllBookings);

// GET /api/bookings/:id - Get booking by ID
router.get('/bookings/:id', getBookingById);

// GET /api/bookings/email/:email - Get bookings by email
router.get('/bookings/email/:email', getBookingsByEmail);

// PATCH /api/bookings/:id/cancel - Cancel booking
router.patch('/bookings/:id/cancel', cancelBooking);

module.exports = router;