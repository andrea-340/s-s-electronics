import React, { useEffect, useState } from "react";

// NON usare import qui, usiamo i percorsi diretti dalla root
const slides = [
  "/2025-01-2722.jpg",
  "/2025-01-272.jpg",
  "/2025-01-27.jpg",
  "/2025-01-272243.jpg",
  "/unnamed.jpg",
  "/unnamed2.jpg",
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
    <div style={{ width: "100%", height: "500px", position: "relative", overflow: "hidden" }}>
      {slides.map((url, i) => (
        <img
          key={i}
          src={url}
          alt="slide"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: current === i ? 1 : 0,
            transition: "opacity 1s ease-in-out"
          }}
          // Se l'immagine fallisce il caricamento, lo vedrai in console
          onError={(e) => console.error(`Errore caricamento: ${url}`)} 
        />
      ))}
    </div>
  );
}
