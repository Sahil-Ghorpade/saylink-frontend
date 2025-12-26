import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles/theme.css";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from "./context/AuthContext.jsx";
import ToastProvider from "./context/ToastContext.jsx";
import SocketProvider from "./context/SocketContext";
import NotificationProvider from './context/NotificationContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <SocketProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
        </SocketProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);