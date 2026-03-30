// src/pages/admin/Calendar.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import Select from "react-select"; // for searchable dropdown
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../assets/styles/Calendar.css";
import CustomToolbar from "../../components/CustomToolbar";
import { API_BASE_URL } from "../../api"; // adjust path

const localizer = momentLocalizer(moment);

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [manualBooking, setManualBooking] = useState(null);
  const [services, setServices] = useState([]);

  const token = localStorage.getItem("token"); // Admin token

  // Fetch services for dropdown
  // Fetch services for dropdown
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const mapped = res.data.map(s => ({
          value: s._id,   // use ID to identify service
          label: s.name,  // what shows in dropdown
        }));
        setServices(mapped);
        console.log("Fetched services:", mapped);
      })
      .catch(err => console.error("Error fetching services:", err));
  }, [token]);

  // Fetch calendar bookings
  useEffect(() => {
    const from = moment(date)
      .startOf(view === Views.MONTH ? "month" : "week")
      .startOf("day")
      .toISOString();
    const to = moment(date)
      .endOf(view === Views.MONTH ? "month" : "week")
      .endOf("day")
      .toISOString();

    axios
      .get(`${API_BASE_URL}/api/bookings?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const bookings = Array.isArray(res.data) ? res.data : res.data.bookings || [];
        const transformed = bookings.map((booking) => {
          const start = new Date(booking.serviceDate);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
          return {
            id: booking._id,
            start,
            end,
            status: booking.status,
            clientName: booking.clientName || booking.clientId?.fullName || "Unknown",
            facilityType: booking.facilityType,
            phoneNumber: booking.phoneNumber,
            location: booking.location,
            note: booking.note,
            time: moment(start).format("HH:mm"),
          };
        });
        setEvents(transformed);
      })
      .catch(err => console.error("Error fetching bookings:", err));
  }, [date, view, token]);

  // Handle empty slot click for manual booking
  const handleSelectSlot = (slotInfo) => {
    setManualBooking({
      serviceDate: slotInfo.start,
      clientName: "",
      phoneNumber: "",
      location: "",
      serviceId: null,
      note: "",
      workerName: "",
    });
  };

  const handleManualChange = (field, value) => {
    setManualBooking(prev => ({ ...prev, [field]: value }));
  };

  const submitManualBooking = () => {
  if (!manualBooking.clientName || !manualBooking.phoneNumber || !manualBooking.location || !manualBooking.serviceId) {
    alert("Please fill all required fields");
    return;
  }

  const token = localStorage.getItem("token"); // admin JWT

  axios.post(
    `${API_BASE_URL}/api/bookings/manual`,
    {
      clientName: manualBooking.clientName,
      phoneNumber: manualBooking.phoneNumber,
      location: manualBooking.location,
      serviceId: manualBooking.serviceId.value, // selected service
      serviceDate: manualBooking.serviceDate, // already Date object
      note: manualBooking.note || "",
      workerName: manualBooking.workerName || "",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  .then(res => {
    alert(res.data.message || "Booking created successfully!");
    setManualBooking(null);
    setDate(new Date(date)); // refresh calendar
  })
  .catch(err => {
    console.error("Error creating manual booking:", err);
    alert(err.response?.data?.message || "Failed to create booking");
  });
};



  const EventComponent = ({ event }) => (
    <div className="calendar-event" onClick={() => setSelectedBooking(event)}>
      <div className="event-time">{event.time}</div>
      <div className="event-facility">{event.facilityType}</div>
      <div className="event-client">{event.clientName}</div>
    </div>
  );

  const closeModal = () => setSelectedBooking(null);

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-2xl font-bold mb-4">Booking Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onNavigate={setDate}
        onView={setView}
        selectable
        onSelectSlot={handleSelectSlot}
        views={{ month: true, week: true }}
        components={{
          toolbar: (props) => <CustomToolbar {...props} date={date} view={view} />,
          event: EventComponent,
        }}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        eventPropGetter={(event) => {
          let bgColor;
          switch (event.status) {
            case "approved":
              bgColor = "#d4edda"; break;
            case "rejected":
              bgColor = "#f8d7da"; break;
            case "pending":
              bgColor = "#fff3cd"; break;
            default:
              bgColor = "#e2e3e5";
          }
          return {
            style: {
              backgroundColor: bgColor,
              border: `2px solid ${bgColor}`,
              padding: "2px",
              fontSize: "12px",
              whiteSpace: "normal",
              cursor: "pointer",
            },
          };
        }}
        dayPropGetter={(day) =>
          view === Views.MONTH && day.getMonth() !== date.getMonth()
            ? { className: "rbc-day-outside-month" }
            : {}
        }
      />

      {/* Existing booking modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="note-title">{selectedBooking.facilityType}</h3>
            <p><strong>Client:</strong> {selectedBooking.clientName}</p>
            <p><strong>Phone:</strong> {selectedBooking.phoneNumber}</p>
            <p><strong>Location:</strong> {selectedBooking.location}</p>
            {selectedBooking.note && <p><strong>Note:</strong> {selectedBooking.note}</p>}
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Time:</strong> {selectedBooking.time}</p>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {/* Manual booking modal */}
      {manualBooking && (
        <div className="modal-overlay" onClick={() => setManualBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="note-title">Add Booking</h3>

            {/* Service dropdown */}
            <div className="modal-row">
              <strong>Service:</strong>
              <Select
              options={services}
              value={manualBooking.serviceId}
              onChange={(val) => handleManualChange("serviceId", val)}
              isSearchable
              placeholder="Select service"
            />
            </div>

            <div className="modal-row">
              <strong>Client Name:</strong>
              <input
                type="text"
                value={manualBooking.clientName}
                onChange={(e) => handleManualChange("clientName", e.target.value)}
              />
            </div>

            <div className="modal-row">
              <strong>Phone:</strong>
              <input
                type="text"
                value={manualBooking.phoneNumber}
                onChange={(e) => handleManualChange("phoneNumber", e.target.value)}
              />
            </div>

            <div className="modal-row">
              <strong>Location:</strong>
              <input
                type="text"
                value={manualBooking.location}
                onChange={(e) => handleManualChange("location", e.target.value)}
              />
            </div>

            <div className="modal-row">
              <strong>Worker Name (optional):</strong>
              <input
                type="text"
                value={manualBooking.workerName}
                onChange={(e) => handleManualChange("workerName", e.target.value)}
              />
            </div>

            <div className="modal-row">
              <strong>Note (optional):</strong>
              <textarea
                value={manualBooking.note}
                onChange={(e) => handleManualChange("note", e.target.value)}
              />
            </div>

            <div className="modal-row">
              <strong>Time:</strong>
              <input
                type="time"
                value={moment(manualBooking.serviceDate).format("HH:mm")}
                onChange={(e) =>
                  handleManualChange(
                    "serviceDate",
                    moment(e.target.value, "HH:mm").toDate()
                  )
                }
              />
            </div>

            <button
              className="close-btn"
              onClick={() => setManualBooking(null)}
            >
              Cancel
            </button>

            <button
              className="close-btn"
              onClick={submitManualBooking}
              style={{ marginLeft: "10px" }}
            >
              Save
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
