import { useState, useEffect } from "react";
import "./OptimizedImage.css";

/**
 * A wrapper for standard <img> tags that provides a smooth blur-up 
 * loading effect and enforces lazy loading for better performance.
 */
export default function OptimizedImage({ src, alt, className = "", ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`optimized-image-wrapper ${className}`}>
      {/* 
        Slightly blurred, lower opacity state before the image loads.
        Once onLoad fires, we swap the class to reveal the sharp image smoothly.
      */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`optimized-image ${isLoaded ? "loaded" : "loading"}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
