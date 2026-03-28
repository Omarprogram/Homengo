// Booking.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../../components/booking/Background_2.jsx";
import "../../assets/styles/Booking.css";
import checkIcon from "../../assets/images/check.png";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { API_BASE_URL } from "../../api";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Map click handler — lets user pick a location
function MapPicker({ onPick }) {
  const [markerPos, setMarkerPos] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      onPick(lat, lng);
    },
  });

  return markerPos ? <Marker position={markerPos} /> : null;
}

function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const geoFetched = useRef(false); // ✅ prevents geolocation from firing on every render

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    latitude: null,
    longitude: null,
    facility: "",
    note: "",
    serviceDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [service, setService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auth guard — redirect if not logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to book a service.");
      navigate("/signup");
    }
  }, [navigate]);

  // ✅ Geolocation — only once, using a ref to prevent calling on every re-render
  useEffect(() => {
    if (geoFetched.current) return;
    geoFetched.current = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (err) => console.warn("Geolocation denied:", err.message)
      );
    }
  }, []);

  // Fetch service details
  useEffect(() => {
    if (!serviceId) return;
    axios
      .get(`${API_BASE_URL}/api/services/${serviceId}`)
      .then((res) => setService(res.data))
      .catch((err) => console.error("Failed to fetch service:", err));
  }, [serviceId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, phone, location, latitude, longitude, facility, serviceDate } = formData;

    if (!name || !phone || !location || !facility || !serviceDate) {
      setError("Please fill in all required fields.");
      return;
    }

    // ✅ Warn but don't block if map wasn't clicked — geolocation may have already set coords
    if (!latitude || !longitude) {
      setError("Please pick your location on the map.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(
        `${API_BASE_URL}/api/bookings`,
        {
          clientName: name,
          phoneNumber: phone,
          location,
          latitude,
          longitude,
          facilityType: facility,
          note: formData.note,
          serviceDate: new Date(serviceDate),
          clientId: user?._id || null,
          serviceId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(true);
      document.body.style.overflow = "hidden";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
    navigate("/HomeScreen");
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <>
      <div className="booking-card">
        <div className="booking-container">
          <Background />
          <div className="form-wrapper">
            <h1 className="booking-title">BOOK A SERVICE</h1>
            <p className="booking-desc">Reserve your service in a few simple steps.</p>

            {service && (
              <div
                className="inner-card"
                style={{
                  backgroundImage: service.image
                    ? `url(${API_BASE_URL}/uploads/${service.image})`
                    : "url('/default.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "20px",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              >
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            )}

            {/* ✅ Show error inline instead of alert */}
            {error && <p className="booking-error">{error}</p>}

            <form className="booking-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" value={formData.name} onChange={handleChange} required />

              <label htmlFor="phone">Phone Number:</label>
              <input id="phone" type="text" value={formData.phone} onChange={handleChange} required />

              <label htmlFor="location">Address:</label>
              <input id="location" type="text" value={formData.location} onChange={handleChange} required />

              <label>Pick Location on Map:</label>
              <div className="map-placeholder" style={{ height: "300px" }}>
                <MapContainer
                  center={[31.9454, 35.9284]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {/* ✅ MapPicker now uses a stable callback pattern */}
                  <MapPicker
                    onPick={(lat, lng) =>
                      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                    }
                  />
                </MapContainer>
              </div>

              <label htmlFor="serviceDate">Service Date:</label>
              <input
                id="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={handleChange}
                required
                min={minDate}
              />

              <label htmlFor="facility">Facility Type:</label>
              <input id="facility" type="text" value={formData.facility} onChange={handleChange} required />

              <label htmlFor="note">Note:</label>
              <textarea id="note" rows="4" value={formData.note} onChange={handleChange} style={{ height: "150px" }} />

              <p className="booking-notice">Your information is safe and will be used to fulfill your request.</p>

              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "CONFIRM BOOKING"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <img src={checkIcon} alt="Success" className="modal-check" />
            <h2 className="modal-title">Your service has been successfully booked!</h2>
            <p className="modal-subtitle">Our team will contact you shortly to schedule the initial visit.</p>
            <p className="modal-footer">Thank you for choosing Fanni.</p>
            <button onClick={closeModal} className="modal-close">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Booking;