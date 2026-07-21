import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProtectedRoute fallback={<LoginPage />}>
        <DashboardPage />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default App;
