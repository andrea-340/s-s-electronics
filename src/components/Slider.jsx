import React, { useEffect, useState } from "react";

// Importa le immagini singolarmente (assicurati che il percorso sia corretto)
import img1 from "./assets/2025-01-2722.jpg";
import img2 from "./assets/2025-01-272.jpg";
import img3 from "./assets/2025-01-27.jpg";
import img4 from "./assets/2025-01-272243.jpg";
import img5 from "./assets/unnamed.jpg";
import img6 from "./assets/unnamed2.jpg";

// Ora l'array contiene i riferimenti importati, non più stringhe fisse
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
