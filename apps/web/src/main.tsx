import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/tokens.css';
import { initMocks } from './mocks/browser';

async function prepareApp() {
  if (import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.DEV) {
    try {
      await initMocks();
    } catch (err) {
      console.warn('MSW worker could not start, continuing with native fetch fallback', err);
    }
  }
}

prepareApp().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
