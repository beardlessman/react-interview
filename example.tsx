import React, { useState, useEffect, useMemo } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
}

export const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');
  const [clickCount, setClickCount] = useState(0);

  // Имитируем получение данных при монтировании
  useEffect(() => {
    const fetchData = () => {
      // Представим, что здесь тяжелый запрос, возвращающий 1000 пользователей
      const mockUsers = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        role: i % 3 === 0 ? 'Admin' : 'Developer'
      }));
      setUsers(mockUsers);
    };

    setInterval(fetchData, 5000); // Обновляем данные каждые 5 секунд
  }, []);

  // Тяжелая фильтрация и форматирование данных
  const processedUsers = useMemo(() => {
    console.log('Processing users...');
    return users.filter(user => {
      // Намеренно тяжелое вычисление для симуляции лагов
      const startTime = performance.now();
      while (performance.now() - startTime < 0.5) {} 
      
      return user.name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [users]); // <-- Обратите внимание на зависимости

  // Логирование кликов во внешний сервис
  useEffect(() => {
    if (clickCount > 0) {
      navigator.sendBeacon('/log-click', JSON.stringify({ count: clickCount }));
      console.log(`Logs sent for ${clickCount} clicks`);
    }
  }, [clickCount]);

  const handleUserClick = () => {
    setClickCount(clickCount + 1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Users Management</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p>Total clicks tracked: {clickCount}</p>
      
      <div style={{ marginTop: '20px' }}>
        {processedUsers.map((user) => (
          <div 
            key={Math.random()} 
            onClick={handleUserClick}
            style={{ padding: '10px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            {user.name} - <strong>{user.role}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};