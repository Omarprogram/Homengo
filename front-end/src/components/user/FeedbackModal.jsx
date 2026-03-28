// FeedbackModal.jsx
import "../../assets/styles/FeedbackModal.css";
import StarRating from "./StarRating";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const FeedbackModal = ({ isOpen, booking, onClose }) => {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Reset state every time a new booking is opened
  useEffect(() => {
    if (!booking || !isOpen) return;

    setReview("");
    setStars(1);
    setSubmitted(false);

    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(response.data)
          ? response.data
          : response.data.feedbacks || [];

        const existing = list.find(
          (f) => f.service === (booking.serviceId?.name || booking.facilityType)
        );

        if (existing) {
          setReview(existing.comment || "");
          setStars(existing.rating || 1);
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };

    fetchFeedback();
  }, [booking, isOpen, token]); // ✅ also re-run when isOpen/token changes

  const handleSubmit = async () => {
    if (!stars || stars < 1 || stars > 5) {
      return alert("Please select a star rating between 1 and 5.");
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/feedback`,
        {
          service: booking.serviceId?.name || booking.facilityType,
          rating: stars,
          comment: review,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert(err.response?.data?.message || "Failed to submit feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h1>Rate Your Experience</h1>
          <h5>Please Rate Your Experience Below</h5>
          {/* ✅ StarRating now receives and uses props correctly (was broken before) */}
          <StarRating stars={stars} setStars={setStars} readOnly={submitted} />
        </div>

        <h6>Additional Feedback</h6>
        <textarea
          placeholder="Write your feedback here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          readOnly={submitted}
        />

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            {submitted ? "Close" : "Cancel"}
          </button>
          {!submitted && (
            <button className="btn submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;