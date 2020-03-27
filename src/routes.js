// -- Landing Routes
import PAMap from "./pages/PAMap";
import Logout from "./pages/Logout";
import NoMatch from "./pages/404.js";
import Public from "./pages/Public/Home";

import Test from "./pages/Test";

const routes = [
    PAMap,
    Test,
    //Globe,
    ...Public,
    Logout,
    NoMatch
];
export default {
    routes: routes
};

//AssetsTable,
