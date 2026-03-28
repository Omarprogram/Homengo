import { History, Settings as SettingsIcon, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../assets/styles/User.css";

export default function UserSideBar({ setHistoryOrSettings, user }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("history");
  const [isOpen, setIsOpen] = useState(false);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signup");
  };

  return (
    <>
      {/* Hamburger button - visible only on mobile/tablet */}
      <button
        className="user-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`user-sidebar ${isOpen ? "open" : ""}`}>
        <div className="usersidebarContainer">
          <div className="userSidebar-top">
            <h2 className="user-welcome">
              Welcome Back
              {user?.fullName ? `, ${user.fullName.split(" ")[0]}!` : "!"}
            </h2>

            <img
              src={
                user?.profilePicture ||
                `https://ui-avatars.com/api/?name=${user?.fullName || "User"}`
              }
              alt="User Profile Picture"
              className="profile-pic"
            />

            <h3 className="user-name">{user?.fullName || "User Name"}</h3>
            <p className="user-role">
              {user?.role === "A"
                ? "Admin"
                : user?.role === "W"
                ? "Worker"
                : "Client"}
            </p>
          </div>

          <nav className="userSidebar-nav">
            <button
              onClick={() => {
                setHistoryOrSettings("history");
                setActive("history");
                setIsOpen(false);
              }}
              className={`sidebar-btn-user ${
                active === "history" ? "active" : ""
              }`}
            >
              <History /> History
            </button>

            <button
              onClick={() => {
                setHistoryOrSettings("settings");
                setActive("settings");
                setIsOpen(false);
              }}
              className={`sidebar-btn-user ${
                active === "settings" ? "active" : ""
              }`}
            >
              <SettingsIcon /> Settings
            </button>

            <button
              onClick={logOut}
              className="sidebar-btn-user logout"
            >
              <X /> Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile view */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
