import '../../assets/styles/AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const transformBookings = (data) => {
    // ✅ Handle both array response and { bookings: [...] } object response
    const list = Array.isArray(data) ? data : data.bookings || data.data || [];
    return list.map(booking => ({
      id: booking._id,
      clientName: booking.clientId?.fullName || booking.clientName || 'Unknown',
      service: booking.facilityType || booking.service || 'N/A',
      serviceDate: new Date(booking.serviceDate).toLocaleDateString('en-GB'),
      time: new Date(booking.serviceDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      technician: booking.workerId?.fullName || booking.workerName || 'Not Assigned',
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      statusClass: `status-${booking.status.toLowerCase()}`,
    }));
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // ✅ Fixed: was using single quotes instead of backticks — variable was never interpolated
        const response = await axios.get(`${API_BASE_URL}/api/bookings/upcoming`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(transformBookings(response.data));
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="upcoming-bookings">
        <h3 className="upcoming-bookings-title">Upcoming Bookings</h3>
        <div className="loading-message">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upcoming-bookings">
        <h3 className="upcoming-bookings-title">Upcoming Bookings</h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="upcoming-bookings">
      <h3 className="upcoming-bookings-title">Upcoming Bookings</h3>
      <div className="upcoming-bookings-table-wrapper">
        <table className="upcoming-bookings-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Service Date</th>
              <th>Technician</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No upcoming bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="client-info">
                      <div className="client-name">{booking.clientName}</div>
                      <div className="client-service">{booking.service}</div>
                    </div>
                  </td>
                  <td>
                    <div className="service-date">{booking.serviceDate}</div>
                    <div className="service-time">{booking.time}</div>
                  </td>
                  <td className="technician">{booking.technician}</td>
                  <td>
                    <span className={`status-badge ${booking.statusClass}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingBookings;