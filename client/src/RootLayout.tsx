import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding'; // <-- Импортируем

export const RootLayout = () => {
  const location = useLocation();
  // Состояние, которое отвечает за показ онбординга
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedRuStore');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    // Прячем онбординг и ставим метку в localStorage
    setShowOnboarding(false);
    localStorage.setItem('hasVisitedRuStore', 'true');
  };

  return (
    // Добавляем новый контейнер для Sidebar
    <div className="flex bg-[#1c1c1d]">
        {/* Здесь будет Sidebar */}

        {/* Основной контент */}
        <div className="flex-grow">
            <LayoutGroup>
              <AnimatePresence mode="wait">
                  {/* Показываем онбординг, если нужно */}
                  {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

                  <div key={location.pathname}>
                    <Outlet />
                  </div>
              </AnimatePresence>
            </LayoutGroup>
        </div>
    </div>
  );
};