import React, { useState } from 'react';
import { createEvent } from '../services/api';

const AddEventModal = ({ onClose, onEventCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        venue: '',
        totalSeats: '',
        price: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Please enter event name');
            setLoading(false);
            return;
        }
        if (!formData.description.trim()) {
            setError('Please enter event description');
            setLoading(false);
            return;
        }
        if (!formData.date) {
            setError('Please select event date');
            setLoading(false);
            return;
        }
        if (!formData.venue.trim()) {
            setError('Please enter venue');
            setLoading(false);
            return;
        }
        if (!formData.totalSeats || parseInt(formData.totalSeats) < 1) {
            setError('Please enter valid number of seats');
            setLoading(false);
            return;
        }
        if (!formData.price || parseFloat(formData.price) < 0) {
            setError('Please enter valid price');
            setLoading(false);
            return;
        }

        try {
            const response = await createEvent({
                name: formData.name,
                description: formData.description,
                date: new Date(formData.date).toISOString(),
                venue: formData.venue,
                totalSeats: parseInt(formData.totalSeats),
                price: parseFloat(formData.price),
            });

            onEventCreated(response.data);
        } catch (err) {
            setError(err.message || 'Failed to create event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white">Add New Event</h2>
                            <p className="text-emerald-100 text-sm mt-1">Create an event for ticket booking</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Event Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            rows="3"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Venue */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Venue
                        </label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="Enter venue location"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Total Seats & Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Seats
                            </label>
                            <input
                                type="number"
                                name="totalSeats"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                placeholder="e.g. 100"
                                min="1"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. 50"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                required
                            />
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
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg cursor-pointer'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating Event...
                            </span>
                        ) : (
                            'Create Event'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
