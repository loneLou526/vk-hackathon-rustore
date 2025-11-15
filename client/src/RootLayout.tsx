import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';

export const RootLayout = () => {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedRuStore');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasVisitedRuStore', 'true');
  };

  return (
    <div className="flex bg-[#1c1c1d] text-white min-h-screen">
      <Sidebar />
      <main className="flex-grow w-full overflow-hidden">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
              <div key={location.pathname + location.search}>
                <Outlet />
              </div>
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </div>
  );
};