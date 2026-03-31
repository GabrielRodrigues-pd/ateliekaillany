import { useState, useEffect, useRef } from "react";
import "./OptimizedImage.css";

/**
 * A wrapper for standard <img> tags that provides a smooth blur-up 
 * loading effect and enforces lazy loading for better performance.
 */
export default function OptimizedImage({ src, alt, className = "", priority = false, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Reset state if src changes
    setTimeout(() => setIsLoaded(false), 0);
    
    // Check if image is already loaded (from cache)
    if (imgRef.current && imgRef.current.complete) {
      setTimeout(() => setIsLoaded(true), 0);
    }
  }, [src]);

  return (
    <div className={`optimized-image-wrapper ${className}`}>
      {/* 
        Slightly blurred, lower opacity state before the image loads.
        Once onLoad fires, we swap the class to reveal the sharp image smoothly.
      */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`optimized-image ${isLoaded ? "loaded" : "loading"}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
