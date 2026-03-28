import '../../assets/styles/AdminDashboard.css';
import React from 'react';
import { Calendar, Users, UserCheck, Wrench } from 'lucide-react';

const stats = [
  {
    title: 'Bookings',
    value: '5000',
    icon: Calendar,
    colorClass: 'icon-orange',
    bgClass: 'icon-bg-orange-light',
  },
  {
    title: 'Technicians',
    value: '350',
    icon: UserCheck,
    colorClass: 'icon-orange',
    bgClass: 'icon-bg-orange-light',
  },
  {
    title: 'Users',
    value: '1500',
    icon: Users,
    colorClass: 'icon-orange',
    bgClass: 'icon-bg-orange-light',
  },
  {
    title: 'Total Services',
    value: '50',
    icon: Wrench,
    colorClass: 'icon-orange',
    bgClass: 'icon-bg-orange-light',
  },
];

export default function StatsCards() {
  return (
    <div className="stats-cards">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stats-card">
            <div className="stats-card-content">
              <div className={`stats-card-icon ${stat.bgClass}`}>
                <Icon className={`stats-card-icon-inner ${stat.colorClass}`} />
              </div>
              <div>
                <p className="stats-card-title">{stat.title}</p>
                <p className="stats-card-value">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}