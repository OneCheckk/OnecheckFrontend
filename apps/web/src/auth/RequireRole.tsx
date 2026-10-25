import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@contracts';

interface RequireRoleProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ roles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" data-testid="auth-loading">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying regulatory credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = roles.includes(user.role);

  if (!hasAccess) {
    return (
      <div
        data-testid="forbidden-screen"
        className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
      >
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-lg p-8 shadow-sm text-center">
          <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-700">
            <ShieldAlert className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">403 — Access Forbidden</h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your authenticated role (<strong className="text-slate-800">{user.role}</strong>) does not hold
            statutory authorization to access this operational partition.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to={user.role === 'INSTITUTION' ? '/portal' : '/review'}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-md text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Permitted Partition</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
