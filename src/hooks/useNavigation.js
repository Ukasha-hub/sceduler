import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const getCurrentPath = () => {
    return location.pathname;
  };

  // Navigation helpers for common routes
  const navigateToHome = () => navigate(ROUTES.HOME);
  const navigateToDashboard = () => navigate(ROUTES.DASHBOARD);

  return {
    goTo,
    goBack,
    goForward,
    isCurrentPath,
    getCurrentPath,
    navigateToHome,
    navigateToDashboard,
    // Add more navigation helpers as needed
  };
};
