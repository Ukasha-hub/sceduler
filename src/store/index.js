// Store configuration for state management
// This is a placeholder for Redux or Zustand store setup

// Example Redux store configuration (commented out until Redux is installed)
/*
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // Add more slices here as the app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
*/

// Simple state management solution using Context (until Redux is needed)
import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: null,
  theme: 'light',
  sidebarCollapsed: false,
  notifications: [],
};

// Action types
export const actionTypes = {
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.CLEAR_USER:
      return { ...state, user: null };
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case actionTypes.ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case actionTypes.REMOVE_NOTIFICATION:
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    clearUser: () => dispatch({ type: actionTypes.CLEAR_USER }),
    toggleSidebar: () => dispatch({ type: actionTypes.TOGGLE_SIDEBAR }),
    setTheme: (theme) => dispatch({ type: actionTypes.SET_THEME, payload: theme }),
    addNotification: (notification) => dispatch({ 
      type: actionTypes.ADD_NOTIFICATION, 
      payload: { ...notification, id: Date.now() } 
    }),
    removeNotification: (id) => dispatch({ 
      type: actionTypes.REMOVE_NOTIFICATION, 
      payload: id 
    }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export for future Redux migration
export default initialState;
