import React, { useState, useEffect } from 'react';

export const SearchDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(null); // Сброс стейта перед новым запросом

    fetch(`https://example.com/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
      });
  }, [userId]);

  if (!user) return <div>Loading...</div>;
  return <div>User profile: {user.name}</div>;
};

export default function Task2Demo() {
  const [userId, setUserId] = useState('1');

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => setUserId('1')}>
          userId=1
        </button>
        <button type="button" onClick={() => setUserId('2')}>
          userId=2
        </button>
        <span>current: {userId}</span>
      </div>
      <SearchDetails userId={userId} />
    </div>
  );
}
