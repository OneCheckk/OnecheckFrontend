import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { GovtTopBar, TricolorBar, Button, AppFooter } from '../ui';
import { DemoControlsDrawer } from '../demo/DemoControlsDrawer';
import { useSSE } from '../../api/sse';
import {
  FileText,
  PlusCircle,
  Inbox,
  ShieldCheck,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Sliders,
  Wifi,
  WifiOff,
  Bell,
  CheckCircle,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout, isDevSession } = useAuth();
  const location = useLocation();
  const { connectionState } = useSSE();
  const [showDemoDrawer, setShowDemoDrawer] = useState<boolean>(false);

  const isCaseView = location.pathname.startsWith('/review/') && location.pathname !== '/review';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      {/* Top Bar */}
      <GovtTopBar />

      {/* Subtle Development/Mock Session Indicator (Clean Slate, Zero Yellow) */}
      {isDevSession && (
        <div
          data-testid="dev-session-banner"
          className="bg-slate-100 border-b border-slate-200 text-slate-700 px-4 py-1 text-xs"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded border border-slate-300">
                DEVELOPMENT / MOCK SESSION
              </span>
              <span className="text-[11px] font-medium hidden sm:inline text-slate-600">
                Active test user: <strong className="text-slate-900">{user?.name}</strong> ({user?.role})
              </span>
            </div>
            <button
              onClick={logout}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              title="Exit testing session"
            >
              Exit Testing Session
            </button>
          </div>
        </div>
      )}

      {/* Main Header / Navigation with subtle Tricolor top accent */}
      <header className="bg-white border-b border-slate-300 sticky top-0 z-30 shadow-2xs">
        {/* Subtle 2.5px Tricolor identity accent line */}
        <div className="h-[2.5px] w-full flex shrink-0" aria-hidden="true">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/assets/logo2.png" alt="OneCheck" className="h-9 w-auto" />
              <div>
                <span className="font-extrabold text-base tracking-tight text-[#0b2545]">ONECHECK</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">
                  Regulatory Verification
                </span>
              </div>
            </Link>

            {/* Role-Gated Navigation Links - Refined institutional tab style */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              {/* Institution Links */}
              {(user?.role === 'INSTITUTION' || user?.role === 'INSTITUTION_USER') && (
                <>
                  <NavLink
                    to="/portal"
                    end
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>My Applications</span>
                  </NavLink>

                  <NavLink
                    to="/portal/new"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Application</span>
                  </NavLink>
                </>
              )}

              {/* Officer / Director Links */}
              {(user?.role === 'SCRUTINY_OFFICER' ||
                user?.role === 'REGIONAL_DIRECTOR' ||
                user?.role === 'OFFICER') && (
                <>
                  <NavLink
                    to="/review"
                    end
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Review Queue</span>
                  </NavLink>

                  <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Alerts Queue</span>
                  </NavLink>

                  <NavLink
                    to="/benchmark"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Benchmark Runs</span>
                  </NavLink>
                </>
              )}

              {/* Auditor Links */}
              {(user?.role === 'AUDITOR' || user?.role === 'ADMIN') && (
                <NavLink
                  to="/audit"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audit Chain</span>
                </NavLink>
              )}

              {/* Admin Configuration Links */}
              {user?.role === 'ADMIN' && (
                <>
                  <NavLink
                    to="/admin/rulepacks"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Rulepacks</span>
                  </NavLink>

                  <NavLink
                    to="/admin/checklists"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <span>Checklists</span>
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Users</span>
                  </NavLink>

                  <NavLink
                    to="/benchmark"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-[#005ea2] font-bold border border-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Benchmark</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Real-time Connection Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                connectionState === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
              title={`Live event status: ${connectionState}`}
            >
              {connectionState === 'connected' ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>SSE Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-slate-500" />
                  <span>{connectionState === 'polling' ? 'Polling 5s' : 'Offline'}</span>
                </>
              )}
            </div>

            {/* Demo Controls Drawer Toggle */}
            <button
              onClick={() => setShowDemoDrawer(true)}
              className="p-1.5 text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded text-xs flex items-center gap-1.5 bg-white shadow-2xs"
              title="Open Demo Controls Drawer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline font-semibold">Demo Controls</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="font-bold text-xs text-slate-900 block max-w-[260px] truncate">
                  {user?.name || 'Authorized Official'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Mandatory Statutory Case View Footer */}
      {isCaseView && (
        <div
          data-testid="case-view-footer"
          className="bg-slate-100 border-t border-slate-300 py-2 px-4 text-center text-xs font-semibold text-slate-700"
        >
          Automated findings are advisory and are for review by authorized officials.
        </div>
      )}

      {/* App Global Footer */}
      <AppFooter />

      {/* Demo Controls Drawer Component */}
      <DemoControlsDrawer isOpen={showDemoDrawer} onClose={() => setShowDemoDrawer(false)} />
    </div>
  );
};
