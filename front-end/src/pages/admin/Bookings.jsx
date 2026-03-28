// admin/Bookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminBookings.css";
import tickIcon from "../../assets/images/tick.png";
import crossIcon from "../../assets/images/cross.png";
import noteIcon from "../../assets/images/note.png";
import { API_BASE_URL } from "../../api"; // adjust path

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "approved"
    const [loading, setLoading] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showNote, setShowNote] = useState(false);
    
    const fetchBookings = async (tab) => {
        try {
            setLoading(true);
      let url = `${API_BASE_URL}/api/bookings`;
      if (tab === "pending") url += "?status=pending";
      else if (tab === "approved") url += "?status=approved";

      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setBookings(res.data);
    } catch (err) {
        console.error("Error fetching bookings:", err);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings(activeTab);
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };
  return (
    <div className="bookings-container">
      <h2>Bookings</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`tab ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
      </div>

      {/* Booking Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Client</th>
              <th>Date</th>
              <th>Booking Request</th>
              {activeTab === "all" && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.serviceId?.name || b.facilityType}</td>
                  <td className="client-cell">
                    <div className="client-avatar">👤</div>
                    <div className="client-text">
                      <div className="client-name">
                        {b.clientId?.fullName || b.clientName}
                      </div>
                      <div className="client-number">{b.phoneNumber}</div>
                    </div>
                  </td>
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
                    {b.note ? (
                      <img
                        src={noteIcon}
                        alt="booking request"
                        className="booking-request-icon"
                        onClick={() => {
                          setSelectedNote(b.note);
                          setShowNote(true);
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  {activeTab === "all" && (
                    <td>
                      {b.status === "pending" ? (
                        <div className="actions">
                          <img
                            src={tickIcon}
                            alt="approve"
                            className="status-btn"
                            onClick={() => handleStatusUpdate(b._id, "approved")}
                          />
                          <img
                            src={crossIcon}
                            alt="reject"
                            className="status-btn"
                            onClick={() => handleStatusUpdate(b._id, "rejected")}
                          />
                        </div>
                      ) : (
                        <img
                          src={b.status === "approved" ? tickIcon : crossIcon}
                          alt={b.status}
                          className="status-icon"
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === "all" ? "5" : "4"}>
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Booking Note Modal */}
      {showNote && (
        <div className="note-modal" onClick={() => setShowNote(false)}>
          <div className="note-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="note-title">Customer's Notice</h3>
            <p className="customer-note">{selectedNote}</p>
            <button className="close-btn" onClick={() => setShowNote(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
