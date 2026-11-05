import React, { useState, useEffect } from 'react';

function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [delay]); // Зависит только от delay
}

export const AutoCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useInterval(() => {
    setCount(count + step); // Используем текущие count и step
  }, 1000);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setStep(s => s + 1)}>Increase step ({step})</button>
    </div>
  );
};
