import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--primary-color)'
      }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite', width: 40, height: 40 }} />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};
