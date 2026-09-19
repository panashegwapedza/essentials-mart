import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AuthOverlay from './AuthOverlay';
import NotificationCenter from './NotificationCenter';
import OpsDashboard from './OpsDashboard';

const isOps = window.location.pathname.startsWith('/ops');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isOps ? <OpsDashboard /> : <><App /><AuthOverlay /><NotificationCenter /></>}
  </StrictMode>,
);
