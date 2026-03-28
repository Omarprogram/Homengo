import React from 'react';
import { Star, RefreshCw } from 'lucide-react';
import '../../assets/styles/AdminDashboard.css';

const CustomerReviews = () => {
  const reviews = [
    { label: 'Excellent', percentage: 90, color: 'review-bar-green-dark' },
    { label: 'Good', percentage: 75, color: 'review-bar-green-light' },
    { label: 'Average', percentage: 50, color: 'review-bar-orange-light' },
    { label: 'Avg-below', percentage: 30, color: 'review-bar-orange-dark' },
    { label: 'Poor', percentage: 15, color: 'review-bar-red' }
  ];

  return (
    <div className="customer-reviews">
      <div className="customer-reviews-header">
        <h3 className="customer-reviews-title">Customer Review</h3>
        <RefreshCw className="refresh-icon" />
      </div>
      
      <div className="customer-reviews-rating">
        <div className="stars">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="star filled" />
          ))}
          <Star className="star empty" />
        </div>
        <span className="rating-score">4.0</span>
        <span className="rating-text">out of 5 star</span>
      </div>

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-row">
            <span className="review-label">{review.label}</span>
            <div className="review-bar">
              <div
                className={`review-bar-fill ${review.color}`}
                style={{ width: `${review.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;