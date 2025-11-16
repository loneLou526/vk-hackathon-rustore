import {Link, useLocation, useParams} from 'react-router-dom';
import {useUserStore} from '../store/userStore';
// Иконки SVG
const AppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
    </svg>
);
const GameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
);
const FinanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
);

const menuItems = [
    {name: 'Программы', path: '/', icon: <AppIcon/>},
    {name: 'Игры', path: '/category/Игры', icon: <GameIcon/>},
    {name: 'Финансы', path: '/category/Финансы', icon: <FinanceIcon/>},
];

export const Sidebar = () => {
    const location = useLocation();
    const params = useParams();
    const {user, logout} = useUserStore();
    const currentPath = params.categoryName ? `/category/${params.categoryName}` : location.pathname;

    const xpForNextLevel = user ? user.level * 100 : 100;
    const xpPercentage = user ? Math.min((user.xp / xpForNextLevel) * 100, 100) : 0;
    const userInitial = user?.username ? user.username[0].toUpperCase() : '?';
    return (
        <aside className="w-64 flex-shrink-0 bg-[#2a2a2b] p-6 hidden md:block border-r border-gray-700/50">
            <div>
                <div className="text-white text-2xl font-bold mb-12 flex items-center gap-2">
                    <svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                         y="0px"
                         viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<path fill="#0077FF" d="M70.2944031,929.7059937C140.5890045,1000,253.7260132,1000,480,1000h40
	c226.2739868,0,339.4099731,0,409.7059937-70.2940063C1000,859.4099731,1000,746.2719727,1000,519.9979858v-40
	c0-226.276001,0-339.4133911-70.2940063-409.7077942C859.4099731-0.00002,746.2739868,0,520,0h-40
	C253.7260132,0.00002,140.5890045,0.00002,70.2944031,70.2901993C-0.00002,140.5845947,0,253.7219849,0,479.9979858v40
	C0.00002,746.2719727,0.00002,859.4119873,70.2944031,929.7059937z"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M772.0560303,664.6779785l-67.56604-16.8779907
	c-8.1359863-2.3339844-13.882019-9.6560059-14.1719971-18.1640015l-8.4320068-248.6859741
	c-2.4379883-32.9160156-26.8720093-59.0940247-52.4060059-66.8040161c-1.4320068-0.4320068-2.9639893,0.1499939-3.8119507,1.3840027
	c-0.8640137,1.2520142-0.5300293,2.9880066,0.6739502,3.9200134C632.6459961,324.3299866,650,340.2579956,650,367.7319946
	l-0.0499878,325.1500244c0,31.3959961-29.6680298,54.4219971-60.2700195,46.7779541l-68.6099854-17.1399536
	c-7.6080322-2.6620483-12.8939819-9.7460327-13.1699829-17.9180298l-8.4320374-248.7039795
	c-2.4379883-32.9160156-26.8719788-59.0940247-52.4059753-66.8040161c-1.4320068-0.4320068-2.9640198,0.1499939-3.8120117,1.3840027
	c-0.8619995,1.2539978-0.5299988,2.9880066,0.6740112,3.9200134c6.3039856,4.8800049,23.6579895,20.8079834,23.6579895,48.2819824
	l-0.0499878,271.0300293l0.0379944,0.0059814v54.1459961c0,31.3959961-29.6679993,54.4219971-60.2700195,46.7780151
	l-193.79599-48.4119873c-26.9431915-6.7300415-45.8345947-30.8300171-45.8345947-58.4720459l0.0001984-325.6579895
	c0-31.3959961,29.668396-54.4239807,60.270401-46.7779846l122.1099854,30.5019836v-58.7039795
	c0-31.3960266,29.6679993-54.4240112,60.2700195-46.7799988l122.1060181,30.5039978v-58.7060089
	c0-31.397995,29.6679688-54.423996,60.2699585-46.7794037l193.7960205,48.4114075
	c26.9420166,6.7299957,45.8339844,30.8320007,45.8339844,58.473999v325.6560059
	C832.3259888,649.2960205,802.65802,672.3220215,772.0560303,664.6779785z"/>
</svg>
                    <span>RuStore</span>
                </div>
                <nav>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.name} className="mb-2">
                                <Link to={item.path}
                                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-base font-medium ${currentPath === item.path ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};