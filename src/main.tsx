import { createRoot } from 'react-dom/client';
import { UsersDashboard } from '../example';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root was not found');
}

createRoot(root).render(<UsersDashboard />);
