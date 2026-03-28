// History.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/BookingHistory.css";
import noteIcon from "../../assets/images/note.png";
import { API_BASE_URL } from "../../api"; // adjust path

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "completed", "cancelled"
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNote, setShowNote] = useState(false); 

  const fetchBookings = async () => {
  try {
    setLoading(true);
    let url = `${API_BASE_URL}/api/bookings`; // admin bookings

    const token = localStorage.getItem("token"); // ✅ token

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ include token
    });

    setBookings(res.data);
  } catch (err) {
    console.error("Error fetching bookings", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "completed") return b.progress === "completed";
    if (activeTab === "cancelled") return b.progress === "cancelled";
    return true; // all tab
  });

  return (
    <div className="history-container">
  <h2>Booking History</h2>

  {/* Tabs */}
  <div className="tabs">
    <button
      className={`tab ${activeTab === "all" ? "active" : ""}`}
      onClick={() => setActiveTab("all")}
    >
      All Requests
    </button>
    <button
      className={`tab ${activeTab === "completed" ? "active" : ""}`}
      onClick={() => setActiveTab("completed")}
    >
      Completed Requests
    </button>
    <button
      className={`tab ${activeTab === "cancelled" ? "active" : ""}`}
      onClick={() => setActiveTab("cancelled")}
    >
      Cancelled Requests
    </button>
  </div>

  {loading ? (
    <p>Loading...</p>
  ) : (
    <table className="history-table">
      <thead>
        <tr>
          <th>Service Type</th>
          <th>Client</th>
          <th>Date</th>
          <th>Booking Requests</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <tr key={b._id}>
              {/* Service Type */}
              <td>{b.facilityType}</td>

              {/* Client column with avatar and phone number */}
              <td className="client-cell">
                <div className="  vatar">👤</div>
                <div className="client-text">
                  <div className="client-name">{b.clientId?.fullName || b.clientName}</div>
                  <div className="client-number">{b.phoneNumber}</div>
                </div>
              </td>

              {/* Date */}
              <td>
                {(() => {
                  const d = new Date(b.serviceDate);
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                })()}
              </td>

              <td>
                <img
                  src={noteIcon}
                  alt="booking request"
                  className="booking-request-icon"
                  onClick={() => {
                    setSelectedNote(b.note);
                    setShowNote(true);
                  }}
                />
              </td>

              {/* Booking feedback icon
              <td>
                <img
                  src={feedback}
                  alt="feedback"
                  className="feedback-icon"
                  onClick={() => {
                    setSelectedNote({
                      review: b.feedback?.review || "",   // default empty string
                      stars: b.feedback?.stars || 5       // default 5 stars
                    });
                    setShowNote(true);
                  }}
                  style={{ cursor: "pointer", width: "20px" }}
                />
              </td> */}

              {/* Status */}
              <td>{b.progress || "pending"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No bookings found</td>
          </tr>
        )}
      </tbody>
    </table>
  )}

  {/* Modal for feedback */}
  
      {showNote && selectedNote && (
      <div className="note-modal" onClick={() => setShowNote(false)}>
        <div className="note-content" onClick={(e) => e.stopPropagation()}>
          {/* Stars */}
          <div className="stars">
            {Array.from({ length: selectedNote.stars }, (_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          <h3 className="note-title">
            {selectedNote.stars === 5
              ? "Excellent !"
              : selectedNote.stars === 4
              ? "Very Good !"
              : selectedNote.stars === 3
              ? "Good"
              : "Feedback"}
          </h3>

          {/* Review box */}
          <div className="note-review">
            {selectedNote.review || "No review provided."}
          </div>

          {/* Cancel / Close button */}
          <button className="close-btn" onClick={() => setShowNote(false)}>
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Modal for booking request */}
      {showNote && (
        <div className="note-modal" onClick={() => setShowNote(false)}>
          <div className="note-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="note-title">Customer's Notice:</h3>
            <p class="customer-note">{selectedNote}</p>
            <button className="close-btn" onClick={() => setShowNote(false)}>Close</button>
          </div>
        </div>
      )}

</div>

  );
};

export default History;
