// BookingHistory.jsx
import React, { useEffect, useState } from "react";
import "../../assets/styles/UserBookingHistory.css";
import FeedbackModal from "./FeedbackModal";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        const bookingsData = Array.isArray(data) ? data : data.bookings || [];
        setBookings(bookingsData);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Status badge helper
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "status-badge approved";
      case "rejected": return "status-badge rejected";
      case "pending":  return "status-badge pending";
      default:         return "status-badge";
    }
  };

  if (loading) {
    return (
      <div className="booking-history">
        <h2>Booking History</h2>
        <p>Loading bookings...</p>
      </div>
    );
  }

  // ✅ Show heading even when empty — was hiding h2 entirely before
  if (!bookings.length) {
    return (
      <div className="booking-history">
        <h2>Booking History</h2>
        <p className="no-bookings">You have no bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="booking-history">
      <h2>Booking History</h2>
      <div className="table-wrapper"> {/* ✅ wrapper for horizontal scroll on mobile */}
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Expiration</th>
              <th>Provider</th>
              <th>Location</th>
              <th>Status</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="service-cell">
                  {b.serviceId?.image && (
                    <img
                      src={`${API_BASE_URL}/uploads/${b.serviceId.image}`}
                      alt={b.serviceId.name}
                      className="service-icon"
                    />
                  )}
                  <span>{b.serviceId?.name || b.facilityType || "—"}</span>
                </td>
                <td>{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : "—"}</td>
                <td>
                  {b.expirationDate
                    ? new Date(b.expirationDate).toLocaleDateString()
                    : "—"}
                </td>
                <td>{b.workerName || "—"}</td>
                <td>
                  <div className="location-cell">
                    <span className="location-icon">📍</span>
                    <span>{b.location || "—"}</span>
                  </div>
                </td>
                {/* ✅ Added status column — was missing entirely */}
                <td>
                  <span className={getStatusClass(b.status)}>
                    {b.status
                      ? b.status.charAt(0).toUpperCase() + b.status.slice(1)
                      : "—"}
                  </span>
                </td>
                <td>
                  <button
                    className="feedback-btn"
                    onClick={() => setSelectedBooking(b)}
                  >
                    Feedback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <FeedbackModal
          isOpen={!!selectedBooking}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingHistory;