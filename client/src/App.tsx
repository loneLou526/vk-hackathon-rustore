import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { AppDetailPage } from './pages/AppDetailPage';
import { RootLayout } from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Теперь корневой элемент - это наш Layout
    children: [ // А страницы становятся его дочерними элементами
      {
        index: true, // Это значит, что MainPage будет рендериться по пути '/'
        element: <MainPage />,
      },
      {
        path: '/apps/:appId',
        element: <AppDetailPage />,
      },
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;