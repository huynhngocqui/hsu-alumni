import { useRoutes } from 'react-router-dom';
import { publicRoutes } from './routes/publicRoutes';
import { authRoutes } from './routes/authRoutes';
import { protectedRoutes } from './routes/protectedRoutes';
import { adminRoutes } from './routes/adminRoutes';

function App() {
  const routes = [...publicRoutes, ...authRoutes, ...protectedRoutes, ...adminRoutes];

  return useRoutes(routes);
}

export default App;
