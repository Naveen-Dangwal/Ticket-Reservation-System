import React from 'react';

const SuccessModal = ({ booking, event, onClose }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
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

    // Get event details from either the populated booking.event or the passed event prop
    const eventData = booking?.booking?.event || event || {};
    const bookingData = booking?.booking || {};

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
                    <p className="text-green-100 mt-1">Your tickets have been reserved</p>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Event</span>
                            <span className="font-semibold text-gray-800">{eventData.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="font-medium text-gray-800">{formatDate(eventData.date)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Venue</span>
                            <span className="font-medium text-gray-800">{eventData.venue || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tickets</span>
                            <span className="font-semibold text-gray-800">{bookingData.numberOfTickets || 0}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                            <span className="text-gray-700 font-medium">Total Paid</span>
                            <span className="text-xl font-bold text-green-600">${bookingData.totalPrice || 0}</span>
                        </div>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-4">
                        <p className="text-sm text-indigo-700">
                            <span className="font-semibold">Booking ID:</span> {bookingData._id || 'N/A'}
                        </p>
                        <p className="text-sm text-indigo-600 mt-1">
                            A confirmation email will be sent to {bookingData.email || 'your email'}
                        </p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-amber-700">
                            Remaining seats for this event: <span className="font-bold">{booking?.updatedAvailableSeats ?? 'N/A'}</span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
