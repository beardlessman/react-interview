import React, { useState, useEffect, useRef } from 'react';

function throttle(fn: () => void, wait: number) {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = () => {
    const now = Date.now();
    const remaining = wait - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn();
      return;
    }

    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn();
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled;
}

export const WindowTracker: React.FC = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const resizeCountRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);

      resizeCountRef.current += 1;
      // Хотим логировать каждые 10 ресайзов
      if (resizeCountRef.current % 10 === 0) {
        console.log('Width updated:', window.innerWidth);
      }
    };

    const onResize = throttle(handleResize, 100);
    window.addEventListener('resize', onResize);

    return () => {
      onResize.cancel();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div>Window width: {width}</div>;
};
