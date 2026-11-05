import React, { useState } from 'react';

const LargeItem = React.memo(({ name, onDelete }: { name: string; onDelete: () => void }) => {
  console.log(`Rendering Item: ${name}`);
  return <div onClick={onDelete}>{name} (click to delete)</div>;
});
LargeItem.displayName = 'LargeItem';

export const FilterableList: React.FC = () => {
  const [items, setItems] = useState(['Apple', 'Banana', 'Orange', 'Cherry']);
  const [count, setCount] = useState(0);

  const handleDelete = (nameToRemove: string) => {
    setItems(items.filter(item => item !== nameToRemove));
  };

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment Outer Counter: {count}</button>
      <div>
        {items.map(item => (
          <LargeItem
            key={item}
            name={item}
            onDelete={() => handleDelete(item)} // inline стрелочная функция
          />
        ))}
      </div>
    </div>
  );
};
