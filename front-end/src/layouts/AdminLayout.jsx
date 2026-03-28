//AdminLayout.jsx
import Sidebar from "../components/admin/AdminSideBar";
import NavBar from "../components/NavBar.jsx";
import "../assets/styles/Admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <NavBar />

      {/* Centered container for sidebar + main */}
      <div className="admin-container">
        {/* Sidebar card */}
        <div className="sidebar-card">
          <Sidebar />
        </div>

        {/* Main content card */}
        <div className="main-card">
          {children}
        </div>
      </div>
    </div>
  );
}
