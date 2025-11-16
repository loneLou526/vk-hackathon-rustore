import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { AppDetailPage } from './pages/AppDetailPage';
import { RootLayout } from './RootLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { WheelPage } from './pages/WheelPage';
import { StorePage } from './pages/StorePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: '/apps/:appId', element: <AppDetailPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/wheel', element: <WheelPage /> },
      { path: '/store', element: <StorePage /> },   // 🔥 Магазин наград
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
