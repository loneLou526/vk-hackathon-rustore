import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useUserStore } from './store/userStore';
import apiClient from './services/api';

export const RootLayout = () => {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { token, user, setUser, loadToken } = useUserStore();

  useEffect(() => {
    loadToken();
    const hasVisited = localStorage.getItem('hasVisitedRuStore');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, [loadToken]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await apiClient.get('/users/me');
        setUser(data, token);
      } catch (error) {
        setUser(null, null);
      }
    };
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, setUser]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasVisitedRuStore', 'true');
  };

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <div className="flex bg-[#1c1c1d] text-white min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-hidden">
          <Header />
          <main className="flex-grow overflow-y-auto">
            <LayoutGroup>

              <AnimatePresence mode="wait" initial={false}>
                <Outlet key={location.pathname + location.search} />
              </AnimatePresence>
            </LayoutGroup>
          </main>
        </div>
      </div>
    </>
  );
};