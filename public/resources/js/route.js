import MainPage from "./views/MainPage.js"
import LoginPage from "./views/LoginPage.js"
import RegistrationPage from "./views/RegistrationPage.js"
import ChatPage from "./views/ChatPage.js";

export const routes = [
    {
        path: '/',
        page: MainPage,
    },
    {
        path: '/registration',
        page: RegistrationPage,
    },
    {
        path: '/login',
        page: LoginPage,
    },
    {
        path: '/chat',
        page: ChatPage,
    },
];

export default routes;