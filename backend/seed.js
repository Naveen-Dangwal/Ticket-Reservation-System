const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Event = require('./models/event');

const sampleEvents = [
    {
        name: 'Rock Concert 2026',
        description: 'An amazing rock concert featuring top bands from around the world. Get ready for an unforgettable night of music!',
        date: new Date('2026-02-15T19:00:00'),
        venue: 'Madison Square Garden, New York',
        totalSeats: 500,
        availableSeats: 500,
        price: 75,
    },
    {
        name: 'Tech Conference 2026',
        description: 'Annual technology conference with keynotes from industry leaders, workshops, and networking opportunities.',
        date: new Date('2026-03-20T09:00:00'),
        venue: 'Convention Center, San Francisco',
        totalSeats: 300,
        availableSeats: 300,
        price: 150,
    },
    {
        name: 'Comedy Night Special',
        description: 'A hilarious evening of stand-up comedy featuring top comedians. Laugh until your sides hurt!',
        date: new Date('2026-02-28T20:00:00'),
        venue: 'Laugh Factory, Los Angeles',
        totalSeats: 200,
        availableSeats: 200,
        price: 45,
    },
    {
        name: 'Classical Music Evening',
        description: 'An elegant evening of classical music performed by the Symphony Orchestra. Perfect for music enthusiasts.',
        date: new Date('2026-04-10T18:30:00'),
        venue: 'Carnegie Hall, New York',
        totalSeats: 400,
        availableSeats: 400,
        price: 100,
    },
    {
        name: 'Sports Championship Finals',
        description: 'The ultimate championship finals! Watch the best teams compete for the title.',
        date: new Date('2026-05-05T15:00:00'),
        venue: 'National Stadium, Chicago',
        totalSeats: 1000,
        availableSeats: 1000,
        price: 120,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        // Clear existing events
        await Event.deleteMany({});
        console.log('Cleared existing events');

        // Insert sample events
        const createdEvents = await Event.insertMany(sampleEvents);
        console.log(`Seeded ${createdEvents.length} events successfully!`);

        console.log('\nCreated Events:');
        createdEvents.forEach((event, index) => {
            console.log(`${index + 1}. ${event.name} - ${event.availableSeats} seats - $${event.price}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
