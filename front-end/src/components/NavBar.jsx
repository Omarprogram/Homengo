//NavBar.jsx
import logo from "../assets/images/logo.png";
import "../assets/styles/NavBar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api"; // adjust path
import { createPrefetchHandlers } from "../utils/routePrefetch";


const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ✅ check if user exists
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch categories dynamically
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);

      // 🔥 only keep active categories
      const activeCategories = (res.data || []).filter(
        (cat) => cat.status === "active"
      );

      setCategories(activeCategories);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };
  fetchCategories();
}, []);

  // ✅ handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signup"); // redirect after logout
  };

  // ✅ dynamic profile link
  const getProfileLink = () => {
    if (!user) return "/signup"; // fallback
    if (user.role === "A") return "/admin/dashboard"; // Admin
    return "/user"; // Normal user
  };

  const prefetchFor = (path) => createPrefetchHandlers(path);

  return (
    <nav className="navBar">
      <div className="logo">
        <img src={logo} width="140" alt="Logo" />
      </div>
        <button
    className="menu-toggle"
    onClick={() => document.querySelector('.nav-links').classList.toggle('show')}
  >
    ☰
  </button>

  {/* ✅ Wrap all links in a container for toggling */}
  <div className="nav-links">
    <li><a href="/HomeScreen" {...prefetchFor("/HomeScreen")}>Home</a></li>

    {/* Services dropdown */}
    <li
  className={`dropdown ${window.innerWidth <= 1024 ? "mobile-dropdown" : ""}`}
  >
      <a
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.currentTarget.parentElement.classList.toggle("open");
          }
        }}  
      >Services ▾</a>
      <ul className="dropdown-menu">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li
              key={cat._id}
              onClick={() => navigate(`/Services/${cat.name}`)}
              onMouseEnter={() => prefetchFor(`/Services/${cat.name}`).onMouseEnter()}
              onFocus={() => prefetchFor(`/Services/${cat.name}`).onFocus()}
              onTouchStart={() => prefetchFor(`/Services/${cat.name}`).onTouchStart()}
              style={{ cursor: "pointer" }}
            >
              {cat.name}
            </li>
          ))
        ) : (
          <li style={{ padding: "10px 16px" }}>Loading...</li>
        )}
      </ul>
    </li>

    <li><a href="/HomeScreen#aboutUs" {...prefetchFor("/HomeScreen")}>About Us</a></li>
    <li><a href="/contact" {...prefetchFor("/contact")}>Contact Us</a></li>



        {/* ✅ Show Profile + Logout if logged in */}
        {user ? (
          <>
            <li>
              <a href={getProfileLink()} {...prefetchFor(getProfileLink())}>Profile</a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // ✅ Otherwise show Signup/Login
          <li>
            <a href="/signup" {...prefetchFor("/signup")}>Login / Signup</a>
          </li>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
