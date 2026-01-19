import React from 'react';

const EventCard = ({ event, onBookClick }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isAvailable = event.availableSeats > 0;
    const availabilityPercentage = (event.availableSeats / event.totalSeats) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            {/* Event Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h3 className="text-xl font-bold text-white truncate">{event.name}</h3>
                <p className="text-indigo-100 text-sm mt-1">{event.venue}</p>
            </div>

            {/* Event Body */}
            <div className="p-5">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{formatDate(event.date)}</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-800">${event.price}</span>
                    <span className="text-sm text-gray-500">per ticket</span>
                </div>

                {/* Seat Availability */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Seat Availability</span>
                        <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {event.availableSeats} / {event.totalSeats} seats
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                                availabilityPercentage > 50
                                    ? 'bg-green-500'
                                    : availabilityPercentage > 20
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                            }`}
                            style={{ width: `${availabilityPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Book Button */}
                <button
                    onClick={() => onBookClick(event)}
                    disabled={!isAvailable}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                        isAvailable
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer shadow-md hover:shadow-lg'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isAvailable ? 'Book Tickets' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};

export default EventCard;
