import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GovtTopBar, TricolorBar, Button } from '../../components/ui';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
        <div className="max-w-md w-full bg-white/95 border border-slate-300 rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-2">
              <img src="/assets/logo2.png" alt="OneCheck" className="h-12 w-auto mx-auto" />
            </Link>
            <h1 className="text-xl font-black text-[#0b2545]">Recover Access</h1>
            <p className="text-xs text-slate-600 mt-1">
              Enter official registered email to receive authentication OTP
            </p>
          </div>

          {sent ? (
            <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-lg text-center text-xs space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-950">Verification Link Dispatched</h3>
              <p className="text-slate-600 leading-relaxed">
                A secure statutory one-time link has been sent to <strong>{email}</strong>. Please check your official inbox.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-blue-700 font-bold hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.ac.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold text-xs bg-[#005ea2] hover:bg-blue-800"
              >
                Send Password Reset OTP
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <div className="relative z-10 w-full">
        <TricolorBar />
      </div>
    </div>
  );
};
