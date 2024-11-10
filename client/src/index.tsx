import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Si tu utilises des styles
import App from './App';  // Si ton composant principal est App.tsx

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
