import React, { useState, useEffect } from 'react';

export const WindowTracker: React.FC = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [logCount, setLogCount] = useState(0);

  const handleResize = () => {
    setWidth(window.innerWidth);
    // Хотим логировать каждые 10 ресайзов
    if (logCount % 10 === 0) {
      console.log('Width updated:', window.innerWidth);
    }
    setLogCount(logCount + 1);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []); // Пустой массив зависимостей

  return <div>Window width: {width} (Events logged: {logCount})</div>;
};
