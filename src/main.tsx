import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import App from './App';
import { appTransition } from './lib/motion';
import './styles/theme.css';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user" transition={appTransition}>
      <App />
    </MotionConfig>
  </StrictMode>,
);
