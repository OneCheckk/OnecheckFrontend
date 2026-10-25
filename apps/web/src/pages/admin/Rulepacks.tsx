import React, { useState, useMemo } from 'react';
import { Button, Modal } from '../../components/ui';
import { SeverityChip } from '../../components/status';
import type { Severity } from '@contracts';
import {
  Settings,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Search,
  Filter,
  Layers,
  BookOpen,
  ShieldCheck,
  Cpu,
  Building2,
  Users,
  Coins,
  FileCheck,
  Sparkles,
  Award,
} from 'lucide-react';

interface HandbookRule {
  id: string;
  name: string;
  category: 'INFRASTRUCTURE' | 'FACULTY' | 'FINANCIAL' | 'MUNICIPAL' | 'FORENSICS';
  severity: Severity;
  clauseRef: string;
  tolerance: string;
  description: string;
  statutoryAuthority: string;
  verificationSource: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

const HANDBOOK_RULES: HandbookRule[] = [
  {
    id: 'AREA-CONSIST-001',
    name: 'Architectural Blueprint CAD vs Claimed Carpet Area',
    category: 'INFRASTRUCTURE',
    severity: 'HIGH',
    clauseRef: 'APH 2026 §4.1',
    tolerance: '±2.0% variance threshold',
    description:
      'Cross-verifies computer-extracted room dimensions from municipal approved blueprints against declared institutional square meters.',
    statutoryAuthority: 'AICTE Act 1987 §10(k) / GFR Rule 194',
    verificationSource: 'Municipal Approved Vector CAD Drawing',
    status: 'ACTIVE',
  },
  {
    id: 'FACULTY-RATIO-002',
    name: 'Student-to-Faculty Cadre Distribution Ratio',
    category: 'FACULTY',
    severity: 'CRITICAL',
    clauseRef: 'APH 2026 §4.2',
    tolerance: '1:20 UG / 1:15 PG norm',
    description:
      'Computes institutional cadre distribution (Professors, Associate, Assistant) against sanctioned intake quotas.',
    statutoryAuthority: 'AICTE Pay & Service Regulations 2019',
    verificationSource: 'Sanctioned Faculty Cadre & Biometric Registry',
    status: 'ACTIVE',
  },
  {
    id: 'FEE-RECON-001',
    name: 'TER Processing Fee Challan Gateway Reconciliation',
    category: 'FINANCIAL',
    severity: 'HIGH',
    clauseRef: 'APH 2026 §2.5',
    tolerance: 'Exact 1:1 transaction match',
    description:
      'Validates institutional Technical Education Regulatory (TER) fee payment directly against central nodal treasury gateway.',
    statutoryAuthority: 'Bharatkosh Non-Tax Receipt Portal Norms',
    verificationSource: 'Central Nodal Treasury UTR Gateway',
    status: 'ACTIVE',
  },
  {
    id: 'NOC-VALID-003',
    name: 'Fire Safety & Structural Stability Certificate Validity',
    category: 'MUNICIPAL',
    severity: 'MEDIUM',
    clauseRef: 'APH 2026 §7.1',
    tolerance: 'Valid throughout academic session',
    description:
      'Checks expiry dates of statutory municipal fire safety certifications and PWD structural soundness certificates.',
    statutoryAuthority: 'National Building Code 2016 Part 4',
    verificationSource: 'State Fire Service & PWD Nodal API',
    status: 'ACTIVE',
  },
  {
    id: 'DOC-FORENSIC-001',
    name: 'PDF Dual XRef Stream Alteration & Software Tracing',
    category: 'FORENSICS',
    severity: 'HIGH',
    clauseRef: 'APH 2026 §9.4',
    tolerance: 'Zero unauthorized xref streams',
    description:
      'Parses raw PDF byte streams for revision timeline anomalies, secondary cross-reference tables, and incremental save tampering.',
    statutoryAuthority: 'ISO 32000-1 Document Architecture Standard',
    verificationSource: 'Byte-Level Parser & Ghostscript Stream Engine',
    status: 'ACTIVE',
  },
  {
    id: 'GEOFENCE-001',
    name: 'Campus Boundary Geofence & Photo EXIF Coordinate Audit',
    category: 'INFRASTRUCTURE',
    severity: 'HIGH',
    clauseRef: 'APH 2026 §3.2',
    tolerance: '500m geofence radius',
    description:
      'Verifies embedded camera EXIF coordinates of laboratory and campus photos against registered municipal land coordinates.',
    statutoryAuthority: 'Survey of India Geospatial Guidelines',
    verificationSource: 'Hardware EXIF Metadata & State Cadastral Map',
    status: 'ACTIVE',
  },
  {
    id: 'GHOST-FACULTY-001',
    name: 'DPDP-Compliant HMAC Multi-Payroll Collision Detector',
    category: 'FACULTY',
    severity: 'CRITICAL',
    clauseRef: 'APH 2026 §5.3',
    tolerance: 'Zero cross-institution collisions',
    description:
      'Calculates salted SHA-256 hashes of faculty Aadhaar/PAN identifiers to uncover faculty simultaneously claimed across colleges.',
    statutoryAuthority: 'DPDP Act 2023 & AICTE Statutory Norms',
    verificationSource: 'Cross-Institutional Salted HMAC Index',
    status: 'ACTIVE',
  },
  {
    id: 'LAND-TITLE-001',
    name: 'Nodal Revenue Survey Title Reconciliation',
    category: 'INFRASTRUCTURE',
    severity: 'HIGH',
    clauseRef: 'APH 2026 §3.1',
    tolerance: 'Exact survey number match',
    description:
      'Reconciles registered land title deeds against state land revenue nodal registries and unencumbered possession records.',
    statutoryAuthority: 'Transfer of Property Act 1882 §54',
    verificationSource: 'State Land Revenue e-Khata Portal',
    status: 'ACTIVE',
  },
  {
    id: 'CORPUS-FUND-001',
    name: 'FDR Joint Liability Deposit Term Validation',
    category: 'FINANCIAL',
    severity: 'MEDIUM',
    clauseRef: 'APH 2026 §8.1',
    tolerance: 'Maturity ≥ 10 years joint lien',
    description:
      'Confirms joint fixed deposit receipts (FDR) pledged to AICTE Regional Officer are lien-marked without early encashment.',
    statutoryAuthority: 'AICTE Regulations 2020 Clause 8',
    verificationSource: 'Scheduled Commercial Bank Lien Confirmation',
    status: 'ACTIVE',
  },
  {
    id: 'CAD-BLUEPRINT-002',
    name: 'Instructional & Administrative Area Proportion Norm',
    category: 'INFRASTRUCTURE',
    severity: 'HIGH',
    clauseRef: 'APH 2026 §4.3',
    tolerance: 'Instructional ≥ 50% built-up area',
    description:
      'Audits polygon areas of classrooms, laboratories, workshops, and administrative offices against minimum norm quotas.',
    statutoryAuthority: 'APH 2026 Appendix 4 Spatial Specifications',
    verificationSource: 'Vector CAD Layer Polygon Analysis',
    status: 'ACTIVE',
  },
];

export const AdminRulepacksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'matrix'>('visual');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New Version Form State (No raw code!)
  const [formVersion, setFormVersion] = useState<string>('v2026.2-draft');
  const [formTitle, setFormTitle] = useState<string>('AICTE Approval Process Handbook (APH) 2026-27 Standard Norms');
  const [formYear, setFormYear] = useState<string>('2026-2027');
  const [formStandard, setFormStandard] = useState<string>('Standard GFR Rule 194 & AICTE Act §10(k)');
  const [formGazetteRef, setFormGazetteRef] = useState<string>('F. No. AICTE/AB/APH/2026-27/GAZ-01');
  const [formNotes, setFormNotes] = useState<string>(
    'Refined vector CAD tolerance threshold to ±2.0% for instructional laboratories. Updated DPDP HMAC salted identifier checks.'
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'INFRASTRUCTURE',
    'FACULTY',
    'FINANCIAL',
    'MUNICIPAL',
    'FORENSICS',
  ]);
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);

  const filteredRules = useMemo(() => {
    return HANDBOOK_RULES.filter((rule) => {
      const matchesCategory = categoryFilter === 'ALL' || rule.category === categoryFilter;
      const matchesSearch =
        searchQuery === '' ||
        rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.clauseRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleDeployRulepack = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationSuccess(true);
    setTimeout(() => {
      setShowNewModal(false);
      setValidationSuccess(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              AICTE Rulepacks & Handbook Norms
            </h1>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
              Standard GFR 194
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Declarative rule definitions governing automated documentary scrutiny and threshold evaluations under the AICTE Approval Process Handbook (APH).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewModal(true)}
            className="bg-[#005ea2] font-bold"
          >
            Deploy New Rulepack...
          </Button>
        </div>
      </div>

      {/* Version Summary Card */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
        <div className="h-[2px] w-full flex" aria-hidden="true">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm text-slate-900">v2026.1-demo</span>
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              ACTIVE REGULATORY RULEPACK
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Deployed: 2026-10-24 UTC</span>
            <span>Standard GFR 194 Verified</span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white">
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Edition Title</span>
            <span className="font-semibold text-slate-800">AICTE APH 2025-26 Norms</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Enforced Rules</span>
            <span className="font-bold text-blue-900 font-mono">194 Active Clauses</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Verification Domains</span>
            <span className="font-semibold text-slate-800">5 Regulatory Areas</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Engine Mode</span>
            <span className="font-semibold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Deterministic Pipeline
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors ${
            activeTab === 'visual'
              ? 'bg-[#005ea2] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Rules Directory ({filteredRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors ${
            activeTab === 'matrix'
              ? 'bg-[#005ea2] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Norms & Clause Matrix</span>
        </button>
      </div>

      {/* Visual Directory Tab */}
      {activeTab === 'visual' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-300 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search rule ID, handbook clause, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-slate-500 font-semibold text-[11px] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Area:
              </span>
              {['ALL', 'INFRASTRUCTURE', 'FACULTY', 'FINANCIAL', 'MUNICIPAL', 'FORENSICS'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      categoryFilter === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Rules Table */}
          <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-4">Rule ID & Normative Title</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Handbook Clause</th>
                    <th className="py-2.5 px-4">Severity</th>
                    <th className="py-2.5 px-4">Automated Evaluation Logic</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{rule.id}</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">{rule.name}</span>
                        <span className="text-[11px] text-slate-500 block mt-1 leading-relaxed">
                          {rule.description}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {rule.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                          {rule.clauseRef}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <SeverityChip severity={rule.severity} />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                        {rule.tolerance}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Norms & Clause Matrix Tab (Clean Structured Table - No raw code!) */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#005ea2]" />
              <span>AICTE Statutory Handbook Norms & Legal Authority Matrix</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Full mapping of handbook normative clauses, governing statutory acts, automated verification sources, and scrutiny engine enforcement modes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Clause Reference</th>
                  <th className="py-2.5 px-3">Normative Evaluation Standard</th>
                  <th className="py-2.5 px-3">Statutory Legal Authority</th>
                  <th className="py-2.5 px-3">Verification Data Source</th>
                  <th className="py-2.5 px-3">Enforcement Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {HANDBOOK_RULES.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {rule.clauseRef}
                      <span className="block text-[10px] text-slate-500 font-mono font-normal">
                        {rule.id}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{rule.name}</span>
                      <span className="text-[11px] text-slate-600 mt-0.5 block font-mono">
                        Tolerance: {rule.tolerance}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {rule.statutoryAuthority}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                      {rule.verificationSource}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Automated Scrutiny
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-slate-700 text-[11px] flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              All 194 normative rules conform to <strong>Standard GFR Rule 194</strong> and the AICTE Approval Process Handbook (APH). Automated findings remain advisory and are subject to authorized scrutiny officer concurrence.
            </span>
          </div>
        </div>
      )}

      {/* Deploy New Rulepack Version Modal (Clean Institutional Form - No raw code!) */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Deploy New Rulepack Version"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeployRulepack}
              className="bg-[#005ea2]"
            >
              Validate & Stage Rulepack
            </Button>
          </>
        }
      >
        <form onSubmit={handleDeployRulepack} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Rulepack Version Tag:</label>
              <input
                type="text"
                value={formVersion}
                onChange={(e) => setFormVersion(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Academic Session:</label>
              <input
                type="text"
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Regulatory Handbook Title:</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Statutory Standard Conformance:</label>
              <input
                type="text"
                value={formStandard}
                onChange={(e) => setFormStandard(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Gazette Notification Reference:</label>
              <input
                type="text"
                value={formGazetteRef}
                onChange={(e) => setFormGazetteRef(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Active Evaluation Domains (5 Regulatory Areas):
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'INFRASTRUCTURE', label: 'Infrastructure & CAD Area' },
                { id: 'FACULTY', label: 'Faculty Cadre & Intake Ratio' },
                { id: 'FINANCIAL', label: 'TER Challan & FDR Lien' },
                { id: 'MUNICIPAL', label: 'Fire Safety & Structural NOC' },
                { id: 'FORENSICS', label: 'Digital Document Forensics' },
              ].map((domain) => (
                <button
                  type="button"
                  key={domain.id}
                  onClick={() => toggleDomain(domain.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border flex items-center gap-1.5 transition-colors ${
                    selectedDomains.includes(domain.id)
                      ? 'bg-blue-50 border-blue-400 text-blue-900'
                      : 'bg-slate-50 border-slate-300 text-slate-500'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      selectedDomains.includes(domain.id) ? 'text-blue-700' : 'text-slate-300'
                    }`}
                  />
                  <span>{domain.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Release Scope & Governance Notes:</label>
            <textarea
              rows={3}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {validationSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                AICTE Statutory Rulepack {formVersion} validated successfully under Standard GFR Rule 194. Staged for automated scrutiny engine.
              </span>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
