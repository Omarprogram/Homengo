// AdminSideBar.jsx
import { useState, useEffect } from "react";
import { Home, Calendar, BookOpen, History, Users, Settings, Wrench } from "lucide-react";
import SidebarItem from "./AdminSideBarItem";
import "../../assets/styles/Admin.css";
import { API_BASE_URL } from "../../api"; // adjust path

export default function Sidebar() {
  const [admin, setAdmin] = useState({
    fullName: "Admin Name",
    role: "Admin",
    profilePicture: null,
  });

  const token = localStorage.getItem("token"); // same token used for admin auth

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return; // could handle errors more gracefully

        const data = await res.json();
        if (data.success && data.admin) {
          setAdmin({
            fullName: data.admin.fullName || "Admin Name",
            role: "Admin",
            profilePicture: data.admin.profilePicture || null,
          });
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    fetchAdminProfile();
  }, [token]);

  return (
    <aside className="sidebar">
      {/* Top Section */}
      <div className="sidebar-top">
        <h2 className="welcome">Welcome Back!</h2>
        <img
          src={
            admin.profilePicture
              ? `${API_BASE_URL}/uploads/${admin.profilePicture}`
              : " https://via.placeholder.com/150" // default image
          }
          alt="Admin Profile"
          className="profile-pic"
        />

        <h3 className="admin-name">{admin.fullName}</h3>
        <p className="admin-role">{admin.role}</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <SidebarItem to="/admin/dashboard" icon={Home} label="Dashboard" />
        <SidebarItem to="/admin/bookings" icon={BookOpen} label="Bookings" />
        <SidebarItem to="/admin/history" icon={History} label="History" />
        <SidebarItem to="/admin/calendar" icon={Calendar} label="Calendar" />
        <SidebarItem to="/admin/users" icon={Users} label="Users" />
        <SidebarItem to="/admin/services" icon={Wrench} label="Services" />
        <SidebarItem to="/admin/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
}
