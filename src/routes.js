// -- Landing Routes
import PAMap from "./pages/PAMap";
import Logout from "./pages/Logout";
import NoMatch from "./pages/404.js";
import Public from "./pages/Public/Home";
import ForestStress from './pages/ForestStress'

import Test from "./pages/Test";
import Globe from "./pages/Globe";

const routes = [
    ...PAMap,
    ForestStress,
    Globe,
   // Test,
    ...Public,
    Logout,
    NoMatch
];
export default {
    routes: routes
};

//AssetsTable,
