import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { GovtTopBar, TricolorBar, Button } from '../../components/ui';
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  UserCheck,
  ShieldCheck,
  Users,
  ArrowRight,
  Sliders,
  Terminal,
} from 'lucide-react';
import type { UserRole } from '@contracts';

type PortalRoleCategory = 'INSTITUTION' | 'SCRUTINY_OFFICER' | 'ADMIN' | 'AUDITOR';

const ROLE_PRESETS: Record<
  PortalRoleCategory,
  { label: string; icon: React.FC<{ className?: string }>; email: string; desc: string }
> = {
  INSTITUTION: {
    label: 'Institute',
    icon: Building2,
    email: 'institution@apex-tech.edu.in',
    desc: 'Engineering colleges, polytechnics, and standalone institutes',
  },
  SCRUTINY_OFFICER: {
    label: 'Officer',
    icon: UserCheck,
    email: 'officer.rao@aicte.gov.in',
    desc: 'Scrutiny officers and regional directorate evaluators',
  },
  ADMIN: {
    label: 'Admin',
    icon: Users,
    email: 'admin@aicte.gov.in',
    desc: 'System administrators and rulepack curators',
  },
  AUDITOR: {
    label: 'Auditor',
    icon: ShieldCheck,
    email: 'auditor@cag.gov.in',
    desc: 'Independent compliance and CAG zero-trust auditors',
  },
};

export const LoginPage: React.FC = () => {
  const { login, devBypassLogin, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<PortalRoleCategory>('INSTITUTION');
  const [email, setEmail] = useState<string>(ROLE_PRESETS.INSTITUTION.email);
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  // Security Math Verification
  const [captchaNum1] = useState<number>(() => Math.floor(Math.random() * 8) + 2);
  const [captchaNum2] = useState<number>(() => Math.floor(Math.random() * 8) + 1);
  const [captchaInput, setCaptchaInput] = useState<string>('');

  const handleRoleTabClick = (role: PortalRoleCategory) => {
    setSelectedRole(role);
    setEmail(ROLE_PRESETS[role].email);
    setPassword('demoPass2026!');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;

    if (!email || !password) {
      setErrorMsg('Please enter both official email address and password.');
      return;
    }

    const expectedSum = captchaNum1 + captchaNum2;
    if (parseInt(captchaInput, 10) !== expectedSum) {
      setErrorMsg(`Security verification failed: ${captchaNum1} + ${captchaNum2} is ${expectedSum}.`);
      return;
    }

    try {
      setErrorMsg(null);
      await login(email, password, selectedRole);
    } catch (err: any) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 4) {
        setIsRateLimited(true);
        setErrorMsg('Too many failed attempts. Account locked for 60 seconds due to security rate limiting.');
        setTimeout(() => {
          setIsRateLimited(false);
          setAttempts(0);
          setErrorMsg(null);
        }, 60000);
      } else {
        setErrorMsg('The official credentials entered do not match our regulatory directory.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-900 font-sans">
      {/* Background with start.png (India Gate sunset) - Crisp & Sharp, no blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/bg.png"
          alt="India Gate sunset background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/65" />
      </div>

      <div className="relative z-10 w-full">
        <GovtTopBar />
      </div>

      {/* Main Login Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="max-w-md w-full bg-white/95 border border-slate-300 rounded-xl shadow-2xl overflow-hidden">
          {/* Card Header with Council Identity */}
          <div className="bg-[#0b2545] text-white p-5 text-center border-b border-slate-700">
            <Link to="/" className="inline-block mb-2">
              <img src="/assets/logo2.png" alt="OneCheck" className="h-10 w-auto mx-auto brightness-110" />
            </Link>
            <h1 className="text-base font-extrabold tracking-wide uppercase">
              AICTE Regulatory Verification Gateway
            </h1>
            <p className="text-[11px] text-amber-300 font-medium mt-0.5">
              OneCheck Single-Sign-On Portal (Standard GFR Rule 194)
            </p>
          </div>

          <div className="p-6">
            {/* Role Switcher Tabs */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Sign-in Category:
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-300 text-xs">
                {(Object.keys(ROLE_PRESETS) as PortalRoleCategory[]).map((r) => {
                  const item = ROLE_PRESETS[r];
                  const Icon = item.icon;
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleTabClick(r)}
                      className={`py-2 px-1 rounded-md text-center font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#005ea2] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-[10px] leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10.5px] text-slate-500 mt-1.5 text-center italic">
                {ROLE_PRESETS[selectedRole].desc}
              </p>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3 mb-4 bg-rose-50 border border-rose-300 rounded text-xs text-rose-800 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1 text-[11px]">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    disabled={isLoading || isRateLimited}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.ac.in or officer@aicte.gov.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#005ea2]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#005ea2] hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={isLoading || isRateLimited}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#005ea2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security CAPTCHA Check */}
              <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                <label className="block font-bold text-slate-800 text-[11px] mb-1">
                  Security Math Verification
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-slate-200 border border-slate-300 rounded font-mono font-black text-sm text-slate-800 tracking-widest select-none">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>
                  <input
                    type="number"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Answer"
                    className="w-24 px-2 py-1.5 border border-slate-300 rounded text-xs text-center font-mono focus:ring-2 focus:ring-[#005ea2] focus:outline-none bg-white"
                  />
                  <span className="text-[10px] text-slate-500">Solve to authenticate</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold text-xs bg-[#005ea2] hover:bg-blue-800"
                isLoading={isLoading}
                disabled={isRateLimited}
              >
                <span>Authenticate & Access Workspace</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {/* Quick Preset Fill Trigger */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-medium">Quick Credentials Fill:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail(ROLE_PRESETS[selectedRole].email);
                  setPassword('demoPass2026!');
                  setCaptchaInput(String(captchaNum1 + captchaNum2));
                }}
                className="font-bold text-[#005ea2] hover:underline cursor-pointer"
              >
                Fill Preset & CAPTCHA
              </button>
            </div>

            {/* Development-Only Bypass Login Section */}
            {import.meta.env.DEV && (
              <div
                data-testid="dev-bypass-login"
                className="mt-4 pt-3 border-t border-slate-200 bg-slate-50/80 rounded-md p-3 text-xs text-slate-900"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-[#005ea2]" />
                    <span>Bypass Login (Testing Only)</span>
                  </div>
                  <span className="text-[9.5px] font-mono font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                    DEV ONLY
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 mb-2 leading-tight">
                  Enter internal application directly using a predefined testing role:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => devBypassLogin('INSTITUTION')}
                    className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors font-semibold text-slate-800 text-[11px] flex items-center justify-between cursor-pointer"
                    title="Enter Institution Workspace directly"
                  >
                    <span>🏫 Institute Desk</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => devBypassLogin('SCRUTINY_OFFICER')}
                    className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors font-semibold text-slate-800 text-[11px] flex items-center justify-between cursor-pointer"
                    title="Enter Scrutiny Officer Review Queue directly"
                  >
                    <span>🔍 Officer Queue</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => devBypassLogin('ADMIN')}
                    className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors font-semibold text-slate-800 text-[11px] flex items-center justify-between cursor-pointer"
                    title="Enter Admin Configuration directly"
                  >
                    <span>⚙️ System Admin</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => devBypassLogin('AUDITOR')}
                    className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors font-semibold text-slate-800 text-[11px] flex items-center justify-between cursor-pointer"
                    title="Enter CAG Audit Chain directly"
                  >
                    <span>🛡️ CAG Auditor</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-xs text-slate-600">
              Need new institutional registration?{' '}
              <Link to="/signup" className="text-[#005ea2] font-bold hover:underline">
                Register Institute
              </Link>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 w-full">
        <TricolorBar />
        <footer className="bg-slate-900/90 text-slate-400 text-xs py-2.5 text-center border-t border-slate-800">
          Official Regulatory Gateway • AICTE, Ministry of Education, Government of India
        </footer>
      </div>
    </div>
  );
};
