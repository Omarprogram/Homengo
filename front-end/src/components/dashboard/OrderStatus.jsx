import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import '../../assets/styles/AdminDashboard.css';
import { API_BASE_URL } from '../../api';

ChartJS.register(ArcElement, Tooltip, Legend);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ✅ Transform the flat { pending: 3, approved: 5 } response the backend returns
// into the structured shape this component needs
const transformStats = (raw) => {
  const approved = raw.approved || 0;
  const pending  = raw.pending  || 0;
  const rejected = raw.rejected || 0;
  const total    = approved + pending + rejected;

  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    total,
    approved,
    pending,
    rejected,
    percentages: {
      approved: pct(approved),
      pending:  pct(pending),
      rejected: pct(rejected),
    },
  };
};

const OrderStatus = () => {
  const [statistics, setStatistics] = useState({
    total: 0, approved: 0, pending: 0, rejected: 0,
    percentages: { approved: 0, pending: 0, rejected: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/api/bookings/statistics/status?month=${selectedMonth}&year=${selectedYear}`,
          { headers: { Authorization: `Bearer ${token}` } } // ✅ route requires auth
        );
        // ✅ Transform raw response before storing in state
        setStatistics(transformStats(response.data));
      } catch (err) {
        console.error('Error fetching status statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth, selectedYear]);

  const chartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [statistics.approved, statistics.pending, statistics.rejected],
        backgroundColor: ['#22c55e', '#f97316', '#ef4444'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed || 0;
            const pct = statistics.total > 0
              ? Math.round((value / statistics.total) * 100)
              : 0;
            return `${context.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  const MonthYearSelector = (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '13px', cursor: 'pointer' }}
      >
        {months.map((month, i) => (
          <option key={i} value={i + 1}>{month}</option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '13px', cursor: 'pointer' }}
      >
        {[...Array(5)].map((_, i) => {
          const year = new Date().getFullYear() - i;
          return <option key={year} value={year}>{year}</option>;
        })}
      </select>
    </div>
  );

  if (loading) {
    return (
      <div className="order-status">
        <div className="order-status-header">
          <h3 className="order-status-title">Order Status</h3>
        </div>
        {MonthYearSelector}
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-status">
        <div className="order-status-header">
          <h3 className="order-status-title">Order Status</h3>
        </div>
        {MonthYearSelector}
        <div style={{ textAlign: 'center', padding: '50px', color: '#ef4444' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="order-status">
      <div className="order-status-header">
        <h3 className="order-status-title">Order Status</h3>
      </div>

      <div className="order-status-subtitle">
        Total Bookings of {months[selectedMonth - 1]} {selectedYear}
      </div>

      {MonthYearSelector}

      <div className="order-status-chart-container">
        {statistics.total > 0 ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="order-status-center">
              <div className="order-status-center-text">
                <div className="ratio-label">Total</div>
                <div className="ratio-value">{statistics.total}</div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No bookings for this period
          </div>
        )}
      </div>

      <div className="order-status-legend">
        <div className="legend-item">
          <div className="legend-dot green"></div>
          <span className="legend-text">
            Approved ({statistics.approved}) — {statistics.percentages.approved}%
          </span>
        </div>
        <div className="legend-item">
          <div className="legend-dot orange"></div>
          <span className="legend-text">
            Pending ({statistics.pending}) — {statistics.percentages.pending}%
          </span>
        </div>
        <div className="legend-item">
          <div className="legend-dot red"></div>
          <span className="legend-text">
            Rejected ({statistics.rejected}) — {statistics.percentages.rejected}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;