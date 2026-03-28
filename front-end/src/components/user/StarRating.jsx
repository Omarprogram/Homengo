// StarRating.jsx
import { Star } from "lucide-react";
import "../../assets/styles/StarRating.css";

// ✅ Fixed: was ignoring all props (stars, setStars, readOnly) and using internal state only.
// FeedbackModal passes these props to control the rating — now they actually work.
const StarRating = ({ stars = 0, setStars, readOnly = false }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={40}
            onClick={() => !readOnly && setStars && setStars(starValue)}
            color={starValue <= stars ? "#F57F25" : "#ccc"}
            fill={starValue <= stars ? "#F57F25" : "none"}
            style={{ cursor: readOnly ? "default" : "pointer" }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;