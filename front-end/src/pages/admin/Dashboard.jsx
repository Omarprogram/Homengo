import React from 'react';
import StatsCards from '../../components/dashboard/StatsCards';
import UpcomingBookings from '../../components/dashboard/UpcomingBook';
import BookingChart from '../../components/dashboard/BookingChart';
import PopularServices from '../../components/dashboard/PopularServices';
import OrderStatus from '../../components/dashboard/OrderStatus';
import CustomerReviews from '../../components/dashboard/CustomerReviews';
import '../../assets/styles/AdminDashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-underline"></div>
        <p>
          Welcome to the admin dashboard. Here you can manage bookings, users, services, and settings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <StatsCards />
      </div>

      {/* Bookings & Chart */}
      <div className="dashboard-grid dashboard-grid-2">
        <UpcomingBookings />
        <BookingChart />
      </div>

      {/* Services, Orders & Reviews */}
      <div className="dashboard-grid dashboard-grid-3">
        <PopularServices />
        <OrderStatus />
        <CustomerReviews />
      </div>
    </div>
  );
};

export default Dashboard;