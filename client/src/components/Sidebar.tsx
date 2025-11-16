import { Link, useLocation } from 'react-router-dom';

// Иконки (простые SVG, как в других частях проекта)
const AppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z"
    />
  </svg>
);

const GameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FinanceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 11V7a4 4 0 118 0v4M5 11v6a4 4 0 108 0v-6M7 11h6M15 11h2"
    />
  </svg>
);

const WheelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" strokeWidth={2} />
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <path strokeWidth={2} d="M12 3v3M21 12h-3M12 21v-3M6 12H3" />
  </svg>
);

const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7h18M5 7l1 12h12l1-12M8 7V5a4 4 0 018 0v2"
    />
  </svg>
);

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Программы', path: '/', icon: <AppIcon /> },
    { name: 'Игры', path: '/', icon: <GameIcon /> }, // заглушка
    { name: 'Финансы', path: '/', icon: <FinanceIcon /> }, // заглушка
    { name: 'Колесо удачи', path: '/wheel', icon: <WheelIcon /> },
    { name: 'Магазин наград', path: '/store', icon: <StoreIcon /> },
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-gray-800 text-gray-300 flex flex-col">
      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          M
        </div>
        <div>
          <div className="text-lg font-semibold">RuStore</div>
          <div className="text-xs text-gray-400">Экспедиция</div>
        </div>
      </div>

      <nav className="px-4 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
