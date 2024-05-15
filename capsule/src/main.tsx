
import { StrictMode } from 'react';
import App from './App';
import './index.css';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

import eruda from 'eruda';
eruda.init();

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);