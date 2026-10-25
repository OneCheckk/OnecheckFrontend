import React from 'react';
import { Link } from 'react-router-dom';
import { GovtTopBar, TricolorBar, Button, AppFooter } from '../components/ui';
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  FileSpreadsheet,
  Building2,
  ArrowRight,
  Lock,
  Search,
  Scale,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      {/* Top Government of India Header */}
      <GovtTopBar />

      {/* Main Navigation Bar - Balanced height, crisp alignment */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo2.png" alt="OneCheck Logo" className="h-9 w-auto" />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#0b2545] block leading-tight">
                ONECHECK
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                AICTE Regulatory Scrutiny Platform
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <a href="#vision" className="hover:text-[#005ea2] transition-colors">
              The Vision
            </a>
            <a href="#engine" className="hover:text-[#005ea2] transition-colors">
              Verification Engine
            </a>
            <a href="#capabilities" className="hover:text-[#005ea2] transition-colors">
              Core Capabilities
            </a>
            <a href="#governance" className="hover:text-[#005ea2] transition-colors">
              DPI Commitment
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#005ea2] hover:bg-[#0b4778] text-white font-semibold rounded-md text-xs shadow-2xs transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Perfectly centered, authoritative institutional presentation */}
      <section className="relative min-h-[calc(100svh-4rem)] flex items-center justify-center overflow-hidden border-b border-slate-200">
        {/* Sharp Background Image spanning full viewport */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/bg.png"
            alt="OneCheck Regulatory Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Centered Hero Content with professional optical balance */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#0b2545] tracking-tight mb-4 drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]">
            ONECHECK
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-800 font-medium max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)]">
            Automated documentary cross-verification and regulatory compliance scrutiny for technical education institutions under AICTE Approval Process Handbook norms.
          </p>

          {/* Direct Primary Actions with subtle Tricolor identity */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-[#0b2545] hover:bg-[#07192f] text-white font-bold rounded-md text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 relative overflow-hidden group border border-slate-700/50"
            >
              <span>Institutional Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              {/* Subtle Tricolor bottom accent */}
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] flex" aria-hidden="true">
                <span className="w-1/3 bg-[#FF9933]" />
                <span className="w-1/3 bg-white" />
                <span className="w-1/3 bg-[#138808]" />
              </span>
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-[#0b2545] font-bold rounded-md text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 border border-slate-300 relative overflow-hidden group"
            >
              <Lock className="w-4 h-4 text-[#005ea2]" />
              <span>Scrutiny Officer Queue</span>
              {/* Subtle Tricolor bottom accent */}
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] flex" aria-hidden="true">
                <span className="w-1/3 bg-[#FF9933]" />
                <span className="w-1/3 bg-white" />
                <span className="w-1/3 bg-[#138808]" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tricolor National Accent Line */}
      <TricolorBar />

      {/* Editorial Prime Minister Quote Banner - Restrained, official strip */}
      <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
          <img
            src="/assets/modi_ji.png"
            alt="PM Narendra Modi"
            className="w-10 h-10 rounded-full border border-slate-300 object-cover shrink-0"
          />
          <p className="text-xs text-slate-700 italic leading-snug">
            "I see technology, innovation and regulatory transparency as exciting and effective instruments for India's transformation."
            <span className="not-italic font-semibold text-slate-900 ml-1.5">
              — Narendra Modi, Prime Minister of India
            </span>
          </p>
        </div>
      </div>

      {/* The Vision Section - Structured, clean institutional presentation */}
      <section id="vision" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 card-tricolor p-6 text-center flex flex-col items-center">
            {/* National Tricolor Top Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>

            <img src="/assets/logo2.png" alt="OneCheck Logo" className="h-14 w-auto mb-3 mt-1" />
            <h3 className="font-bold text-lg text-[#0b2545] mb-0.5">ONECHECK</h3>
            <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Automated Regulatory Scrutiny
            </span>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mb-4">
              Connecting academic institutions with zero-trust automated scrutiny pipelines through secure, compliant verification.
            </p>
            <div className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1.5 pt-3 border-t border-slate-100 w-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standard GFR Rule 194 Conformance</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005ea2] block">
              Our Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight">
              The Vision
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Traditional regulatory approval processes were constrained by manual document inspections, creating insurmountable verification backlogs, delayed academic sessions, and subjective manual checks across thousands of institutions.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>OneCheck transforms this.</strong> As an automated regulatory scrutiny engine, it cross-verifies physical building plans, land revenue records, fire safety certifications, and faculty rosters against AICTE Approval Process Handbook (APH) norms in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics Section - Tricolor bordered cards */}
      <section id="engine" className="py-12 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005ea2] block mb-1">
            Verification Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] mb-2 tracking-tight">
            Evidence-Based Automated Scrutiny
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            OneCheck provides automated, evidence-backed verification before statutory review by authorized scrutiny officers.
          </p>

          {/* 3 Metric Cards with Tricolor borders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="card-tricolor p-5 text-center">
              <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
                <div className="w-1/3 bg-[#FF9933]" />
                <div className="w-1/3 bg-slate-200" />
                <div className="w-1/3 bg-[#138808]" />
              </div>
              <span className="text-3xl font-extrabold text-[#0b2545] block mb-1 font-mono pt-1">100%</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Evidence Traceability
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Every finding points to normalized coordinate bounding boxes</p>
            </div>

            <div className="card-tricolor p-5 text-center">
              <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
                <div className="w-1/3 bg-[#FF9933]" />
                <div className="w-1/3 bg-slate-200" />
                <div className="w-1/3 bg-[#138808]" />
              </div>
              <span className="text-3xl font-extrabold text-[#005ea2] block mb-1 font-mono pt-1">194+</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Handbook Norm Rules
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Full GFR and AICTE Approval Process Handbook compliance</p>
            </div>

            <div className="card-tricolor p-5 text-center">
              <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
                <div className="w-1/3 bg-[#FF9933]" />
                <div className="w-1/3 bg-slate-200" />
                <div className="w-1/3 bg-[#138808]" />
              </div>
              <span className="text-3xl font-extrabold text-[#0b2545] block mb-1 font-mono pt-1">0%</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Subjective Guesswork
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Advisory proofs verified directly against authentic sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid - All cards with Tricolor borders */}
      <section id="capabilities" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight">
            Regulatory Scrutiny Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Engineered specifically to fulfill the AICTE regulatory compliance mandate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="card-tricolor p-5 text-left">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#005ea2] flex items-center justify-center mb-3 mt-1">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Automated Scrutiny Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates institutional self-disclosures against architectural building plans, calculating exact percentage discrepancies.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-tricolor p-5 text-left">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#005ea2] flex items-center justify-center mb-3 mt-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Verification Ledger</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connects directly to state municipal databases, fire safety directorates, and banking gateways with explicit source transparency.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-tricolor p-5 text-left">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#005ea2] flex items-center justify-center mb-3 mt-1">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Document Forensics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects post-issuance PDF modifications, dual xref streams, and software tampering signals across multi-page statutory attachments.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-tricolor p-5 text-left">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#005ea2] flex items-center justify-center mb-3 mt-1">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Institutional Self-Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Self-check capabilities empower colleges to preview norm conformance before submission, avoiding protracted deficiency proceedings.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card-tricolor p-5 text-left">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#005ea2] flex items-center justify-center mb-3 mt-1">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">TER Fee Reconciliation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct verification of processing fee challans against central nodal treasury accounts, preventing unverified transactions.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card-tricolor p-5 text-left">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#005ea2] flex items-center justify-center mb-3 mt-1">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Immutable Audit Chain</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cryptographic SHA-256 hash chaining records every officer disposition, claim edit, and automated event with statutory auditability.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Public Infrastructure Section */}
      <section id="governance" className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="card-tricolor p-6 sm:p-8 text-center">
            <div className="absolute top-0 left-0 right-0 h-[3.5px] flex" aria-hidden="true">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 pt-1">
              Digital Public Infrastructure
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b2545] mb-2 tracking-tight">
              Our Statutory Commitment
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Built as scalable <strong>Digital Public Infrastructure (DPI)</strong> for technical education governance in collaboration with AICTE and state regulatory authorities conforming to Standard GFR Rule 194.
            </p>
          </div>
        </div>
      </section>

      {/* Official Government Footer */}
      <AppFooter />
    </div>
  );
};
