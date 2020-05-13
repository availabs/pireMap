// -- Landing Routes
import PAMap from "./pages/PAMap";
import Logout from "./pages/Logout";
import NoMatch from "./pages/404.js";
import Public from "./pages/Public/Home";

import Test from "./pages/Test";
import Globe from "./pages/Globe";

const routes = [
    ...PAMap,
    Globe,
    Test,

    //Globe,
    Logout,
    NoMatch
];
export default {
    routes: routes
};

//AssetsTable,
