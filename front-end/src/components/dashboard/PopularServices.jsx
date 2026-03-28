import '../../assets/styles/AdminDashboard.css';
import React from 'react';

const PopularServices = () => {
  const services = [
    { rank: 1, name: 'Plumber', colorClass: 'service-rank' },
    { rank: 2, name: 'House Cleaning', colorClass: 'service-rank' },
    { rank: 3, name: 'Car Wash', colorClass: 'service-rank' },
    { rank: 4, name: 'Electrician', colorClass: 'service-rank' }
  ];

  return (
    <div className="popular-services">
      <h3 className="popular-services-title">Popular Services</h3>
      
      <div className="popular-services-list">
        {services.map((service, index) => (
          <div key={index} className="service-row">
            <div className={service.colorClass}>
              {service.rank}
            </div>
            <span className="service-name">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;