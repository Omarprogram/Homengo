// App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
const NavBar = lazy(() => import("./components/NavBar"));
const Footer = lazy(() => import("./components/Footer"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

const HomeScreen = lazy(() => import("./pages/public/HomeScreen"));
const Services = lazy(() => import("./pages/public/Services"));
const Booking = lazy(() => import("./pages/public/Booking"));
const Signup = lazy(() => import("./pages/public/Signup"));
const ContactUs = lazy(() => import("./pages/public/ContactUs"));

const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Bookings = lazy(() => import("./pages/admin/Bookings"));
const History = lazy(() => import("./pages/admin/History"));
const Calendar = lazy(() => import("./pages/admin/Calendar"));
const Users = lazy(() => import("./pages/admin/Users"));
const ServicesAdmin = lazy(() => import("./pages/admin/ServicesAdmin"));
const Settings = lazy(() => import("./pages/admin/Settings"));

const UserPage = lazy(() => import("./pages/user/UserPage.jsx"));
const BookingHistory = lazy(() => import("./components/user/BookingHistory.jsx"));
const UserSettings = lazy(() => import("./components/user/UserSettings.jsx"));



function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // If user is logged in, redirect to home
  if (token && user) return <Navigate to="/HomeScreen" replace />;

  return children;
}

// ✅ Protect admin routes
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/signup" replace />;
  }

  if (user.role !== "A") {
    return <Navigate to="/HomeScreen" replace />;
  }

  return children;
}

// Layout with NavBar + Footer
function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

// Protect user routes
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>}>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<PublicRoute>
                                          <Signup />
                                         </PublicRoute>} />

          <Route
            path="/HomeScreen"
            element={
              <MainLayout>
                <HomeScreen />
              </MainLayout>
            }
          />
          <Route
            path="/Services/:serviceType"
            element={
              <MainLayout>
                <Services />
              </MainLayout>
            }
          />
          <Route
            path="/booking/:serviceId"
            element={
              <MainLayout>
                <Booking />
              </MainLayout>
            }
          />
          <Route
            path="/booking"
            element={
              <MainLayout>
                <Booking />
              </MainLayout>
            }
          />

          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactUs />
              </MainLayout>
            }
            />

          {/* Admin site (Protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Bookings />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/history"
            element={
              <AdminRoute>
                <AdminLayout>
                  <History />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Calendar />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ServicesAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* User site */}
            <Route path="/user" element={<RequireAuth>
                                          <UserPage />
                                        </RequireAuth>}>
              <Route path="history" element={<BookingHistory />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
