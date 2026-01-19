import React, { useState } from 'react';
import { createBooking } from '../services/api';

const BookingModal = ({ event, onClose, onBookingSuccess }) => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        numberOfTickets: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'numberOfTickets' ? parseInt(value) || 1 : value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.userName.trim()) {
            setError('Please enter your name');
            setLoading(false);
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setError('Please enter a valid email');
            setLoading(false);
            return;
        }
        if (formData.numberOfTickets < 1) {
            setError('Please select at least 1 ticket');
            setLoading(false);
            return;
        }
        if (formData.numberOfTickets > event.availableSeats) {
            setError(`Only ${event.availableSeats} seats available`);
            setLoading(false);
            return;
        }

        try {
            const response = await createBooking({
                eventId: event._id,
                userName: formData.userName,
                email: formData.email,
                numberOfTickets: formData.numberOfTickets,
            });

            onBookingSuccess(response, event);
        } catch (err) {
            setError(err.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = event.price * formData.numberOfTickets;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white">Book Tickets</h2>
                            <p className="text-indigo-100 text-sm mt-1">{event.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Event Info Summary */}
                <div className="p-5 bg-gray-50 border-b">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Price per ticket</span>
                        <span className="font-semibold text-gray-800">${event.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-600">Available seats</span>
                        <span className="font-semibold text-green-600">{event.availableSeats}</span>
                    </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Number of Tickets */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Tickets
                        </label>
                        <input
                            type="number"
                            name="numberOfTickets"
                            value={formData.numberOfTickets}
                            onChange={handleChange}
                            min="1"
                            max={event.availableSeats}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Total Price */}
                    <div className="bg-indigo-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Total Amount</span>
                            <span className="text-2xl font-bold text-indigo-600">${totalPrice}</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg cursor-pointer'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Confirm Booking'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
