// Background_2.jsx
// Background image slider for the booking page

import React, { useState, useEffect } from "react";
import "../../assets/styles/Background.css";
import {
  slideshow1, slideshow2, slideshow3,
  slideshow4, slideshow5, slideshow6, slideshow7,
} from "../../assets/images/slideshow";

const backgrounds = [slideshow1, slideshow2, slideshow3, slideshow4, slideshow5, slideshow6, slideshow7];

const Background = ({ children }) => {
  const [currentBg, setCurrentBg] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Advance slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fixed: was calling requestAnimationFrame(() => setIsTransitioning(true)) inside
  // the same frame — the re-enable was immediate and the "no transition" frame never painted.
  // Now uses a double rAF to guarantee the browser paints one frame without transition
  // before re-enabling it, making the seamless loop actually work.
  useEffect(() => {
    if (currentBg !== backgrounds.length) return;

    const t = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentBg(0);

      // ✅ Double rAF ensures browser renders the instant-jump frame first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }, 1000);

    return () => clearTimeout(t);
  }, [currentBg]);

  return (
    <div className="background-wrapper">
      <div
        className="slider"
        style={{
          transform: `translateX(-${currentBg * 100}vw)`,
          transition: isTransitioning ? "transform 1s ease-in-out" : "none",
        }}
      >
        {/* Duplicate first image at end for seamless loop */}
        {[...backgrounds, backgrounds[0]].map((bg, i) => (
          <div
            key={i}
            className="slide"
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>
      {children}
    </div>
  );
};

export default Background;