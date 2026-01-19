const Event = require('../models/event');

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message,
        });
    }
};

// Get single event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        
        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message,
        });
    }
};

// Create new event (for admin/seeding)
const createEvent = async (req, res) => {
    try {
        const { name, description, date, venue, totalSeats, price } = req.body;
        
        const event = await Event.create({
            name,
            description,
            date,
            venue,
            totalSeats,
            availableSeats: totalSeats, // Initially all seats are available
            price,
        });
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message,
        });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message,
        });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message,
        });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};
