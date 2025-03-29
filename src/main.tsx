
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { VendorAuthProvider } from './hooks/useVendorAuth';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VendorAuthProvider>
      <App />
    </VendorAuthProvider>
  </React.StrictMode>
);
