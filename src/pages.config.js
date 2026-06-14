import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';
import Login from './pages/Login';


export const PAGES = {
    "Dashboard": Dashboard,
    "Tasks": Tasks,
    "Calendar": Calendar,
    "Analytics": Analytics,
    "Profile": Profile,
    "Login": Login,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};