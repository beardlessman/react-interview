import React, { useRef, useState } from 'react';

export const InteractiveForm: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = () => {
    // Проверяем валидность формы на лету
    if (inputRef.current && inputRef.current.value.length >= 5) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // Прямая мутация DOM
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" onChange={handleInputChange} />
      <button onClick={handleClear}>Clear</button>
      <button disabled={!isFormValid}>Submit</button>
    </div>
  );
};
