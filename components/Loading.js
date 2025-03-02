import { useEffect, useState } from "react";
import "../styles/Loading.css"; // Stilių importas

export default function Loading({ 
  size = "medium", 
  fullscreen = false, 
  style = "liquid-gold", 
  background = "transparent"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 30);
    const timeoutTimer = setTimeout(() => setTimeoutReached(true), 10000); // Po 10s rodo fallback

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutTimer);
    };
  }, []);

  return (
    <div
      className={`loading-container ${fullscreen ? "fullscreen" : ""} ${isVisible ? "fade-in" : ""}`}
      style={{ background }}
      aria-label="Loading..."
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`loading-animation ${size} ${style}`} />

      {timeoutReached && (
        <p className="loading-fallback">
          ⚠️ This is taking longer than expected...
        </p>
      )}
    </div>
  );
}
