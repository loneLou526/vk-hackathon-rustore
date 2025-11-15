import {Outlet, useLocation} from 'react-router-dom';
import {AnimatePresence, LayoutGroup} from 'framer-motion';


export const RootLayout = () => {
    const location = useLocation();
    return (
        // AnimatePresence следит за появлением/исчезновением дочерних элементов
        <LayoutGroup>
            <AnimatePresence mode="wait">
                <div key={location.pathname}>
                    <Outlet/>
                </div>
            </AnimatePresence>
        </LayoutGroup>
    );
};