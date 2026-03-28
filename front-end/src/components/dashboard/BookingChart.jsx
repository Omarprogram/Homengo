import React from 'react';
import '../../assets/styles/AdminDashboard.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BookingChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Bookings',
        data: [120, 140, 110, 160, 130, 170, 150, 180, 160, 140, 150, 130],
        borderColor: '#f97316',
        backgroundColor: '#f97316',
        fill: false,
        tension: 0.3,
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="booking-chart">
      <h3 className="booking-chart-title">Monthly Booking Statistics</h3>
      <div className="booking-chart-container">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default BookingChart;