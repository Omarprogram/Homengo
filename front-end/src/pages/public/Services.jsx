// public/Services.jsx
import { useParams, Link } from "react-router-dom";
import "../../assets/styles/Services.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api"; // adjust path
import { createPrefetchHandlers } from "../../utils/routePrefetch";

const Services = () => {
  const { serviceType } = useParams();
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories/with-services`);
        const data = res.data || [];

        // 🔥 Filter only active categories and services
        const activeCategories = data
          .filter((cat) => cat.status === "active")
          .map((cat) => ({
            ...cat,
            services: (cat.services || []).filter((srv) => srv.status === "active"),
          }));

        setCategories(activeCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = categories.find(
    (cat) => cat.name.toLowerCase() === serviceType.toLowerCase()
  );

  const filteredServices =
    selectedCategory?.services.filter((srv) =>
      srv.name.toLowerCase().includes(searchInput.toLowerCase())
    ) || [];

  const bookingPrefetchHandlers = createPrefetchHandlers("/booking");

  return (
    <div>
      <div className="searchBarDiv">
        <input
          placeholder="search by title"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="serviceHeader">
        <h1 className="headerText">{serviceType} Services</h1>
      </div>

      <div>
        {filteredServices.length > 0 ? (
          filteredServices.map((srv) => (
            <Link
              key={srv._id}
              to={`/booking/${srv._id}`}
              onMouseEnter={bookingPrefetchHandlers.onMouseEnter}
              onFocus={bookingPrefetchHandlers.onFocus}
              onTouchStart={bookingPrefetchHandlers.onTouchStart}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="imageAndTextBlock"
                style={{
                  backgroundImage: srv.image
                    ? `url(${API_BASE_URL}/uploads/${srv.image})`
                    : "url('/default.jpg')",
                }}
              >
                <h3 className="serviceTitle">{srv.name}</h3>
                <span className="serviceDesc">{srv.description}</span>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No matching services found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
