const Booking = require('../models/booking');
const Event = require('../models/event');

// Create a new booking with atomic seat update to prevent overbooking
const createBooking = async (req, res) => {
    try {
        const { eventId, userName, email, numberOfTickets } = req.body;

        // Validate input
        if (!eventId || !userName || !email || !numberOfTickets) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: eventId, userName, email, numberOfTickets',
            });
        }

        if (numberOfTickets < 1) {
            return res.status(400).json({
                success: false,
                message: 'Number of tickets must be at least 1',
            });
        }

        // ATOMIC OPERATION: Find event and update available seats in one operation
        // This prevents race conditions and overbooking
        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                availableSeats: { $gte: numberOfTickets }, // Only match if enough seats
            },
            {
                $inc: { availableSeats: -numberOfTickets }, // Decrement available seats
            },
            {
                new: true, // Return updated document
            }
        );

        // If no event found or not enough seats
        if (!event) {
            // Check if event exists at all
            const eventExists = await Event.findById(eventId);
            
            if (!eventExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found',
                });
            }
            
            return res.status(400).json({
                success: false,
                message: `Not enough seats available. Only ${eventExists.availableSeats} seats left.`,
                availableSeats: eventExists.availableSeats,
            });
        }

        // Calculate total price
        const totalPrice = event.price * numberOfTickets;

        // Create the booking record
        const booking = await Booking.create({
            event: eventId,
            userName,
            email,
            numberOfTickets,
            totalPrice,
        });

        // Populate event details in response
        await booking.populate('event', 'name date venue price');

        res.status(201).json({
            success: true,
            message: 'Booking confirmed successfully',
            data: {
                booking,
                updatedAvailableSeats: event.availableSeats,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message,
        });
    }
};

// Get all bookings (optional: for admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('event', 'name date venue price')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message,
        });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('event', 'name date venue price');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        
        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message,
        });
    }
};

// Get bookings by email
const getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const bookings = await Booking.find({ email: email.toLowerCase() })
            .populate('event', 'name date venue price')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message,
        });
    }
};

// Cancel booking and restore seats
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled',
            });
        }

        // Restore seats to the event (atomic operation)
        await Event.findByIdAndUpdate(
            booking.event,
            { $inc: { availableSeats: booking.numberOfTickets } }
        );

        // Update booking status
        booking.bookingStatus = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully. Seats have been restored.',
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message,
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByEmail,
    cancelBooking,
};
