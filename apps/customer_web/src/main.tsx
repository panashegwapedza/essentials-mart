import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AuthOverlay from './AuthOverlay';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <AuthOverlay />
  </StrictMode>,
);
