import { useState, useEffect } from "react";
import "./LoadingOverlay.css";

const LoadingOverlay = ({ message = "Estamos preparando o forno..." }) => {
  const [showWakeupMessage, setShowWakeupMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWakeupMessage(true);
    }, 8000); // Show wakeup message after 8 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-overlay" aria-live="polite">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="inner-egg"></div>
        </div>
        <h3>{message}</h3>
        {showWakeupMessage && (
          <p className="wakeup-text">
            Nosso servidor está acordando para garantir que tudo esteja fresquinho, só mais um momento de doçura!
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
