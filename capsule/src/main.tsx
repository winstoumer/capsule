import './polyfills';

import { StrictMode } from 'react';
import App from './App';
import './index.css';

import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './components/Providers/NotificationContext';
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

//import eruda from 'eruda';
//eruda.init();

root.render(
  <StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>
);