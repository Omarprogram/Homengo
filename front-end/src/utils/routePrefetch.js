const routeImporters = {
  signup: () => import("../pages/public/Signup"),
  home: () => import("../pages/public/HomeScreen"),
  services: () => import("../pages/public/Services"),
  booking: () => import("../pages/public/Booking"),
  contact: () => import("../pages/public/ContactUs"),
  user: () => import("../pages/user/UserPage.jsx"),
  adminDashboard: () => import("../pages/admin/Dashboard"),
  adminBookings: () => import("../pages/admin/Bookings"),
  adminHistory: () => import("../pages/admin/History"),
  adminCalendar: () => import("../pages/admin/Calendar"),
  adminUsers: () => import("../pages/admin/Users"),
  adminServices: () => import("../pages/admin/ServicesAdmin"),
  adminSettings: () => import("../pages/admin/Settings"),
};

const prefetchedKeys = new Set();

function runPrefetch(key) {
  if (!key || prefetchedKeys.has(key)) return;
  const importer = routeImporters[key];
  if (!importer) return;

  prefetchedKeys.add(key);
  importer().catch(() => {
    prefetchedKeys.delete(key);
  });
}

function mapPathToKey(path) {
  if (!path) return null;

  if (path === "/" || path === "/signup") return "signup";
  if (path.startsWith("/HomeScreen")) return "home";
  if (path.startsWith("/Services/")) return "services";
  if (path === "/booking" || path.startsWith("/booking/")) return "booking";
  if (path === "/contact") return "contact";
  if (path === "/user") return "user";
  if (path === "/admin/dashboard") return "adminDashboard";
  if (path === "/admin/bookings") return "adminBookings";
  if (path === "/admin/history") return "adminHistory";
  if (path === "/admin/calendar") return "adminCalendar";
  if (path === "/admin/users") return "adminUsers";
  if (path === "/admin/services") return "adminServices";
  if (path === "/admin/settings") return "adminSettings";

  return null;
}

export function prefetchRoute(path) {
  runPrefetch(mapPathToKey(path));
}

export function createPrefetchHandlers(path) {
  const prefetch = () => prefetchRoute(path);
  return {
    onMouseEnter: prefetch,
    onFocus: prefetch,
    onTouchStart: prefetch,
  };
}
