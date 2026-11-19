import React, { useState, useContext, createContext } from 'react';

const AppContext = createContext<{ user: any; theme: string; toggleTheme: () => void } | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({ name: 'Guest', role: 'User' });
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ user, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const UserProfileButton: React.FC = () => {
  // Компонент отображает ТОЛЬКО имя пользователя и не зависит от темы
  const context = useContext(AppContext);
  console.log('Rendering UserProfileButton');
  return <button>{context?.user.name}</button>;
};

export default function Task5Demo() {
  return (
    <AppProvider>
      <div style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <ThemeToggle />
        <UserProfileButton />
      </div>
    </AppProvider>
  );
}

function ThemeToggle() {
  const context = useContext(AppContext);

  return (
    <button type="button" onClick={context?.toggleTheme}>
      Theme: {context?.theme}
    </button>
  );
}
