import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { AppDetailPage } from './pages/AppDetailPage';
import { RootLayout } from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/apps/:appId',
        element: <AppDetailPage />,
      },
      {
        path: '/category/:categoryName',
        element: <MainPage />,
      },
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;