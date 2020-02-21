// -- Landing Routes
import PAMap from "./pages/PAMap";
import Logout from "./pages/Logout";
import NoMatch from "./pages/404.js";
import Landing from "./pages/Landing";
import Public from "./pages/Public/Home";
import Login from "./pages/Landing/Login";
import Signup from "./pages/Landing/SignUp";
import Test from "./pages/Test";
import EventsFormsIndex from "./pages/auth/Events";
import EventsFormsNew from "./pages/auth/Events/new";
import EventsFormsView from "./pages/auth/Events/view";
import EventsUpload from "./pages/auth/Events/upload";

const routes = [
    //Landing,
    //...Public,
    Login,
    Signup,
    PAMap,
    Test,
    ...Public,
    ...EventsFormsIndex,
    ...EventsFormsNew,
    ...EventsFormsView,
    ...EventsUpload,
    Logout,
    NoMatch
];
export default {
    routes: routes
};

//AssetsTable,
