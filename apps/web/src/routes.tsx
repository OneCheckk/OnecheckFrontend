import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { RequireRole } from './auth/RequireRole';

// Public Pages
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/login/Login';
import { SignupPage } from './pages/login/Signup';
import { ForgotPasswordPage } from './pages/login/ForgotPassword';

// Institution Pages
import { InstitutionApplicationsPage } from './pages/institution/Applications';
import { NewApplicationPage } from './pages/institution/NewApplication';
import { InstitutionWorkspacePage } from './pages/institution/Workspace';

// Officer Pages
import { OfficerQueuePage } from './pages/officer/Queue';
import { OfficerCasePacketPage } from './pages/officer/CasePacket';
import { DeficiencyLettersPage } from './pages/officer/Letters';

// Admin & Audit & Benchmark Pages
import { AdminRulepacksPage } from './pages/admin/Rulepacks';
import { AdminChecklistsPage, AdminUsersPage } from './pages/admin/AdminManage';
import { AuditPage } from './pages/audit/Audit';
import { BenchmarkPage } from './pages/benchmark/Benchmark';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with Image 2 as Background */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Portal Routes wrapped with AppLayout */}
      <Route element={<AppLayout />}>
        {/* Institution Routes */}
        <Route
          path="/portal"
          element={
            <RequireRole roles={['INSTITUTION']}>
              <InstitutionApplicationsPage />
            </RequireRole>
          }
        />
        <Route
          path="/portal/new"
          element={
            <RequireRole roles={['INSTITUTION']}>
              <NewApplicationPage />
            </RequireRole>
          }
        />
        <Route
          path="/portal/applications/:id"
          element={
            <RequireRole roles={['INSTITUTION']}>
              <InstitutionWorkspacePage />
            </RequireRole>
          }
        />

        {/* Officer Routes */}
        <Route
          path="/review"
          element={
            <RequireRole roles={['SCRUTINY_OFFICER', 'REGIONAL_DIRECTOR']}>
              <OfficerQueuePage />
            </RequireRole>
          }
        />
        <Route
          path="/review/:id"
          element={
            <RequireRole roles={['SCRUTINY_OFFICER', 'REGIONAL_DIRECTOR']}>
              <OfficerCasePacketPage />
            </RequireRole>
          }
        />
        <Route
          path="/review/:id/letters"
          element={
            <RequireRole roles={['SCRUTINY_OFFICER', 'REGIONAL_DIRECTOR']}>
              <DeficiencyLettersPage />
            </RequireRole>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/rulepacks"
          element={
            <RequireRole roles={['ADMIN']}>
              <AdminRulepacksPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/checklists"
          element={
            <RequireRole roles={['ADMIN']}>
              <AdminChecklistsPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireRole roles={['ADMIN']}>
              <AdminUsersPage />
            </RequireRole>
          }
        />

        {/* Audit Route */}
        <Route
          path="/audit"
          element={
            <RequireRole roles={['AUDITOR', 'ADMIN']}>
              <AuditPage />
            </RequireRole>
          }
        />

        {/* Benchmark Route */}
        <Route
          path="/benchmark"
          element={
            <RequireRole roles={['ADMIN', 'SCRUTINY_OFFICER', 'REGIONAL_DIRECTOR']}>
              <BenchmarkPage />
            </RequireRole>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white border border-slate-300 rounded-lg p-8 text-center shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">404 — Page Not Found</h2>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                The requested regulatory portal address does not exist.
              </p>
              <a
                href="/"
                className="px-4 py-2 bg-[#005ea2] text-white rounded text-xs font-bold hover:bg-blue-800"
              >
                Return to Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
