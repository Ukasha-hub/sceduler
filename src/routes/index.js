import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// ✅ Lazy load components for better performance
const Home = lazy(() => import('../pages/Home'));
const DashboardV2 = lazy(() => import('../pages/DashboardV2'));
const Rundown = lazy(() => import('../pages/Rundown'));
const Settings = lazy(() => import('../pages/Settings'));


const Login = lazy(() => import('../pages/Login')); 
const SchedulerTable = lazy(() => import('../pages/SchedulerTable')); 
const SettingsScheduler = lazy(() => import('../pages/SettingsScheduler')); 




// ✅ Route configuration
export const routes = [
  {
    path: '/',
    element: Home, //() => <Navigate to="/schedulertable" replace />,
    name: 'Home',
    exact: true,
  },
  {
    path: '/dashboardv2',
    element: DashboardV2,
    name: 'DashboardV2',
    exact: true,
  },
  {
    path: '/rundown',
    element: Rundown,
    name: 'Rundown',
    exact: true,
  },
  {
    path: '/settings',
    element: Settings,
    name: 'Settings',
    exact: true,
  },
 
 
  {
    path: '/login', // Add a new route for the login page
    element: Login,
    name: 'Login',
    exact: true,
  },
  
  {
    path: '/schedulertable', // Add a new route for the login page
    element: SchedulerTable,
    name: 'SchedulerTable',
    exact: true,
  },
  {
    path: '/settingsscheduler', // Add a new route for the login page
    element: SettingsScheduler,
    name: 'SettingsScheduler',
    exact: true,
  },
  // Add more routes here as your app grows
];

// ✅ Route paths as constants to avoid typos
export const ROUTES = {
  HOME: '/',
  DASHBOARDV2: '/dashboardv2',
  RUNDOWN: '/rundown',
  SETTINGS: '/settings',
  METADATA: '/metadata/:id',
 
  LOGIN: '/login',  
  SCHEDULERTABLE: '/schedulertable',  
  SETTINGSSCHEDULER: '/settingsscheduler',
  
};

export default routes;
