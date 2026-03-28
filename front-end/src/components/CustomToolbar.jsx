// src/components/CustomToolbar.jsx
import moment from "moment";
import "../assets/styles/CustomToolbar.css";

export default function CustomToolbar({ onNavigate, onView, view, date }) {
  // Format date differently for month vs week
  let displayDate;
  if (view === "month") {
    displayDate = moment(date).format("MMMM, YYYY"); // September, 2025
  } else if (view === "week") {
    const start = moment(date).startOf("week").format("MMM D");
    const end = moment(date).endOf("week").format("MMM D");
    const year = moment(date).format("YYYY");
    displayDate = `${start} - ${end}, ${year}`;
  }

  return (
    <div className="toolbar-container">
      <button className="toolbar-btn" onClick={() => onNavigate("PREV")}>
        &lt;
      </button>

      <span className="toolbar-label">{displayDate}</span>

      <button className="toolbar-btn" onClick={() => onNavigate("NEXT")}>
        &gt;
      </button>

      <div className="toolbar-views">
        <button
          className={`view-btn ${view === "month" ? "active" : ""}`}
          onClick={() => onView("month")}
        >
          Month
        </button>
        <button
          className={`view-btn ${view === "week" ? "active" : ""}`}
          onClick={() => onView("week")}
        >
          Week
        </button>
      </div>
    </div>
  );
}
