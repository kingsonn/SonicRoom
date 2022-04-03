// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";

import Profile from "views/Dashboard/Profile";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/explore",
    name: "Explore",
    
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/home",
  },
 
  {
    path: "/subscriptions",
    name: "Subscriptions",
  
    // icon: <SupportIcon color="inherit" />,
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/home",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
   
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
       
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/home",
      },
      {
        path: "/build",
    name: "Build",
  
    icon: <RocketIcon color="inherit" />,
    component: Tables,
    layout: "/home",
      },
     
    ],
  },
];
export default dashRoutes;
