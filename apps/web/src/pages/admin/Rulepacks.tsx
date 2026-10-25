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
  Copy,
  Layers,
  BookOpen,
  ShieldCheck,
  Cpu,
  Building2,
  Users,
  Coins,
  FileCheck,
} from 'lucide-react';

interface HandbookRule {
  id: string;
  name: string;
  category: 'INFRASTRUCTURE' | 'FACULTY' | 'FINANCIAL' | 'MUNICIPAL' | 'FORENSICS';
  severity: Severity;
  clauseRef: string;
  tolerance: string;
  description: string;
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
    status: 'ACTIVE',
  },
];

export const AdminRulepacksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'yaml'>('visual');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [yamlContent, setYamlContent] = useState<string>(`version: "2026.1-demo"
name: "AICTE Approval Process Handbook (APH) 2025-26 Standard Norms"
totalRules: 194
rules:
  - id: "AREA-CONSIST-001"
    name: "Architectural Blueprint CAD vs Claimed Area"
    category: "INFRASTRUCTURE"
    severity: "HIGH"
    tolerance: 0.02
    clauseRef: "APH 2026 §4.1"
  - id: "FACULTY-RATIO-002"
    name: "Student-to-Faculty Cadre Ratio"
    category: "FACULTY"
    severity: "CRITICAL"
    clauseRef: "APH 2026 §4.2"
  - id: "FEE-RECON-001"
    name: "TER Processing Fee Challan Gateway Reconciliation"
    category: "FINANCIAL"
    severity: "HIGH"
    clauseRef: "APH 2026 §2.5"
  - id: "NOC-VALID-003"
    name: "Fire Safety & Building Stability Certificate Lapsing Check"
    category: "MUNICIPAL"
    severity: "MEDIUM"
    clauseRef: "APH 2026 §7.1"
  - id: "DOC-FORENSIC-001"
    name: "PDF Dual XRef Stream Alteration & Software Tracing"
    category: "FORENSICS"
    severity: "HIGH"
    clauseRef: "APH 2026 §9.4"
  - id: "GEOFENCE-001"
    name: "Campus Boundary Geofence & Photo EXIF Audit"
    category: "INFRASTRUCTURE"
    severity: "HIGH"
    clauseRef: "APH 2026 §3.2"
  - id: "GHOST-FACULTY-001"
    name: "DPDP HMAC Multi-Payroll Collision Detector"
    category: "FACULTY"
    severity: "CRITICAL"
    clauseRef: "APH 2026 §5.3"
`);

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

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
            <span className="text-slate-500 font-mono text-xs">194 Total Norms (10 Evaluated)</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span>Deployed: <strong className="text-slate-700 font-mono">2026-10-24 UTC</strong></span>
          </div>
        </div>

        {/* Tab Toggle: Visual Rules Directory vs Declarative YAML Schema */}
        <div className="px-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'visual'
                  ? 'border-blue-700 text-[#005ea2]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Active Rules Directory ({filteredRules.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('yaml')}
              className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'yaml'
                  ? 'border-blue-700 text-[#005ea2]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Declarative Schema (YAML Specification)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Rules Directory Tab */}
      {activeTab === 'visual' && (
        <div className="space-y-4">
          {/* Search & Filter Belt */}
          <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rule ID, handbook clause, or keyword..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
              {['ALL', 'INFRASTRUCTURE', 'FACULTY', 'FINANCIAL', 'MUNICIPAL', 'FORENSICS'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Rules Table */}
          <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Rule ID & Normative Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Handbook Clause</th>
                    <th className="py-3 px-4">Enforcement Severity</th>
                    <th className="py-3 px-4">Automated Evaluation Logic</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block text-xs">
                          {r.id}
                        </span>
                        <span className="text-slate-700 font-medium text-xs mt-0.5 block">
                          {r.name}
                        </span>
                        <p className="text-slate-500 text-[11px] mt-1 leading-snug max-w-md">
                          {r.description}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600 text-[11px]">
                        {r.category}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900 text-xs">
                        {r.clauseRef}
                      </td>

                      <td className="py-3.5 px-4">
                        <SeverityChip severity={r.severity} />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                        {r.tolerance}
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

      {/* Declarative YAML Schema Tab */}
      {activeTab === 'yaml' && (
        <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#005ea2]" />
                <span>Declarative YAML Specification</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Machine-readable rulepack definition compiled for the FastAPI automated verification pipeline.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyYaml}
                className="text-xs bg-white text-slate-800"
              >
                <Copy className="w-3.5 h-3.5 mr-1 text-slate-600" />
                {copied ? 'Copied!' : 'Copy YAML'}
              </Button>
            </div>
          </div>

          <pre className="p-4 bg-slate-900 border border-slate-800 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed max-h-[460px]">
            {yamlContent}
          </pre>
        </div>
      )}

      {/* New Version Modal */}
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
              onClick={() => {
                setValidationSuccess(true);
                setTimeout(() => {
                  setShowNewModal(false);
                  setValidationSuccess(false);
                }, 1000);
              }}
              className="bg-[#005ea2]"
            >
              Validate & Save
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <label className="block font-bold text-slate-800">Rulepack Specification (YAML):</label>
          <textarea
            rows={10}
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
            className="w-full font-mono text-xs p-3 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
          />
          {validationSuccess && (
            <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>YAML schema validated successfully. Version staged.</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
