import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AuthOverlay from './AuthOverlay';
import NotificationCenter from './NotificationCenter';
import CatalogueVariants from './CatalogueVariants';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CatalogueVariants />
    <AuthOverlay />
    <NotificationCenter />
  </StrictMode>,
);