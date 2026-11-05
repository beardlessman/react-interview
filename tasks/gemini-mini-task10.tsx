import React, { useState, useEffect, useRef } from 'react';

export const LazyImageComponent: React.FC = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
  }, []); // Эффект без очистки

  return (
    <div ref={containerRef} style={{ height: '200px', border: '1px dashed #ccc' }}>
      {isIntersecting ? <img src="https://example.com" alt="Loaded" /> : 'Scroll down to load...'}
    </div>
  );
};
