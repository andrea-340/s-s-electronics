import React, { useEffect, useState } from "react";

// Sostituisci questi percorsi con quelli reali dove hai spostato le foto
import img1 from "./assets/2025-01-2722.jpg";
import img2 from "./assets/2025-01-272.jpg";
import img3 from "./assets/2025-01-27.jpg";
import img4 from "./assets/2025-01-272243.jpg";
import img5 from "./assets/unnamed.jpg";
import img6 from "./assets/unnamed2.jpg";

const slides = [img1, img2, img3, img4, img5, img6];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: "100%", height: "500px", position: "relative", border: "5px solid red" }}>
      {slides.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Slide ${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: current === i ? "block" : "none", // Mostra solo quella attiva
          }}
        />
      ))}
    </div>
  );
}
