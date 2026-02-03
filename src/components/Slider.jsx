import React, { useEffect, useState } from "react";

const slides = [
  "/public/2025-01-2722.jpg",
  "/public/2025-01-272.jpg",
  "/public/2025-01-27.jpg",
  "/public/2025-01-272243.jpg",
  "/public/unnamed.jpg",
  "/public/unnamed2.jpg",
];
export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider-container">
      {slides.map((url, i) => (
        <div
          key={i}
          className={`slide-img ${current === i ? "active" : ""}`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
    </div>
  );
}
