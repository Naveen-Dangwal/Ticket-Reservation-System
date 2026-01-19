const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const ticketRouter = require('./routers/ticketrouter');

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: 'https://ticket-reservation-system-b6w7.onrender.com' || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Ticket Reservation System API is running',
        endpoints: {
            events: '/api/events',
            bookings: '/api/bookings',
        }
    });
});

// API Routes
app.use('/api', ticketRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message,
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
