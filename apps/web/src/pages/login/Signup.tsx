import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GovtTopBar, TricolorBar, Button } from '../../components/ui';
import { Building2, Mail, Lock, User, CheckCircle, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [instName, setInstName] = useState<string>('');
  const [aicteId, setAicteId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-900 font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/bg.png"
          alt="India Gate background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-900/65" />
      </div>

      <div className="relative z-10 w-full">
        <GovtTopBar />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white/95 border border-slate-200 rounded-lg shadow-xl p-5 sm:p-7">
          <div className="text-center mb-5">
            <Link to="/" className="inline-block mb-1.5">
              <img src="/assets/logo2.png" alt="OneCheck" className="h-10 w-auto mx-auto" />
            </Link>
            <h1 className="text-lg font-bold text-[#0b2545]">Register Institution</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create official institutional profile for AICTE statutory filings
            </p>
          </div>

          {submitted ? (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-md text-center text-slate-800">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-xs">Registration Request Logged</h3>
              <p className="text-[11px] mt-1 text-slate-600">
                Proceeding to regulatory login portal...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Institution Legal Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    placeholder="e.g. Sardar Vallabhbhai National Institute of Technology"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Permanent AICTE ID (If Assigned)</label>
                <input
                  type="text"
                  value={aicteId}
                  onChange={(e) => setAicteId(e.target.value)}
                  placeholder="e.g. 1-38291083 or LEAVE BLANK FOR NEW"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Official Nodal Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="director@institution.edu.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 mt-2 font-bold text-xs bg-[#005ea2] hover:bg-blue-800"
              >
                <span>Register & Create Workspace</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}

          <div className="mt-5 text-center text-xs text-slate-600">
            Already have an active account?{' '}
            <Link to="/login" className="text-blue-700 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <div className="relative z-10 w-full">
        <TricolorBar />
      </div>
    </div>
  );
};
