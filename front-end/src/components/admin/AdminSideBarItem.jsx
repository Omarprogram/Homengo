// AdminSideBarItem.jsx
// Individual sidebar item component with icon and label.

import { NavLink } from "react-router-dom";
import "../../assets/styles/Admin.css";
import { createPrefetchHandlers } from "../../utils/routePrefetch";

export default function SidebarItem({ to, icon: Icon, label }) {
  const prefetchHandlers = createPrefetchHandlers(to);

  return (
    <NavLink
      to={to}
      onMouseEnter={prefetchHandlers.onMouseEnter}
      onFocus={prefetchHandlers.onFocus}
      onTouchStart={prefetchHandlers.onTouchStart}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </NavLink>
  );
}
