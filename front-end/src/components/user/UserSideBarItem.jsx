// front-end/src/components/user/UserSideBarItem.jsx

import { NavLink } from "react-router-dom";
import "../../assets/styles/User.css";

export default function SidebarItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </NavLink>
  );
}
