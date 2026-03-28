//layouts/UserLayout.jsx
import Sidebar from "../components/AdminSideBar";
import NavBar from "../components/NavBar.jsx";
import "../assets/styles/admin.css";


export default function UserLayout({ children }) {
  return (
     <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main section */}
      <div className="admin-main">
        {/* Header/NavBar */}
        <NavBar />

        {/* Page content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
