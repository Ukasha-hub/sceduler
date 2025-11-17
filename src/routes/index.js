import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
// ✅ Lazy load components for better performance

const Landing = lazy(() => import('../pages/Landing'));
const Home = lazy(() => import('../pages/Home'));
const DAM = lazy(() => import('../pages/dam/DAM'));
const DashboardV2 = lazy(() => import('../pages/DashboardV2'));
const Rundown = lazy(() => import('../pages/Rundown'));
const Settings = lazy(() => import('../pages/Settings'));

const VideoMetadata = lazy(() => import('../pages/dam/VideoMetadata')); 
const FolderItems = lazy(() => import('../pages/dam/FolderItems')); 

const AssetVideos = lazy(() => import('../pages/dam/AssetVideos')); 


const Login = lazy(() => import('../pages/Login')); 
const SchedulerTable = lazy(() => import('../pages/scheduler/SchedulerTable')); 
const SettingsScheduler = lazy(() => import('../pages/scheduler/SettingsScheduler')); 




// ✅ Route configuration
export const routes = [
  {
    path: '/',
    element: Landing,
    name: 'Landing',
  },
  {
    path: '/login', // Add a new route for the login page
    element: Login,
    name: 'Login',
    exact: true,
  },
  {
    path: '/Home',
    element:Home, //() => <ProtectedRoute element={Home} />, 
    name: 'Home',
    exact: true,
  },
  {
    path: '/DAM',
    element: () => <ProtectedRoute element={DAM} />, 
    name: 'DAM',
    exact: true,
  },
  {
    path: '/dashboardv2',
    element:  () => <ProtectedRoute element={DashboardV2} />,
    name: 'DashboardV2',
    exact: true,
  },
  {
    path: '/rundown',
    element:Rundown, //() => <ProtectedRoute element={Rundown} />,
    name: 'Rundown',
    exact: true,
  },
  {
    path: '/settings',
    element:Settings, // () => <ProtectedRoute element={Settings} />,
    name: 'Settings',
    exact: true,
  },

  {
    path: '/metadata/:id',
    element: () => <ProtectedRoute element={VideoMetadata} />,
    name: 'VideoMetadata',
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
  {
    path: '/folderitem/:id',
    element: FolderItems,
    name: 'FolderItems',
    exact: true,
  },
  {
    path: 'api/v1/assets/single',
    element: AssetVideos,
    name: 'AssetVideos',
    exact: true,
  },
  // Add more routes here as your app grows
];

// ✅ Route paths as constants to avoid typos
export const ROUTES = {
  LANDING: '/',
  HOME: '/Home',
  DASHBOARDV2: '/dashboardv2',
  RUNDOWN: '/rundown',
  SETTINGS: '/settings',
  METADATA: '/metadata/:id',
  FOLDERITEMS: '/folderitem/:id',
  LOGIN: '/login',  
  SCHEDULERTABLE: '/schedulertable',  
  SETTINGSSCHEDULER: '/settingsscheduler',
  
};

export default routes;
