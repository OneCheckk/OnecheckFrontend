import React, { useState } from 'react';
import { Button, Modal } from '../../components/ui';
import { Settings, CheckCircle2, AlertCircle, FileCode, Play } from 'lucide-react';

export const AdminRulepacksPage: React.FC = () => {
  const [activeVersion, setActiveVersion] = useState<string>('2026.1-demo');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [yamlContent, setYamlContent] = useState<string>(`version: "2026.1-demo"
rules:
  - id: "AREA-CONSIST-001"
    severity: "HIGH"
    tolerance: 0.02
    clauseRef: "HANDBOOK-REF-TBD"
    placeholder: true
  - id: "FACULTY-RATIO-002"
    severity: "CRITICAL"
    clauseRef: "APH-2026-CL-4.2"
  - id: "FEE-RECON-001"
    severity: "HIGH"
    clauseRef: "APH-2026-CL-2.5"
  - id: "NOC-VALID-003"
    severity: "MEDIUM"
    clauseRef: "APH-2026-CL-7.1"
  - id: "DOC-FORENSIC-001"
    severity: "HIGH"
    clauseRef: "APH-2026-CL-9.4"
`);

  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">AICTE Rulepacks Configuration</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage Approval Process Handbook normative rulepacks and validate declarative YAML schemas.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowNewModal(true)} className="bg-[#005ea2]">
          Deploy New Version...
        </Button>
      </div>

      {/* Version Table */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
        {/* Subtle Tricolor Accent Strip */}
        <div className="h-[2px] w-full flex" aria-hidden="true">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-5">Rulepack Version</th>
              <th className="py-3 px-5">Lifecycle State</th>
              <th className="py-3 px-5">Active Rules</th>
              <th className="py-3 px-5">Deployed Timestamp</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3.5 px-5 font-mono font-bold text-slate-900">2026.1-demo</td>
              <td className="py-3.5 px-5">
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                  ACTIVE
                </span>
              </td>
              <td className="py-3.5 px-5 font-mono text-slate-700">194 Rules</td>
              <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">2026-10-24 00:00:00 UTC</td>
              <td className="py-3.5 px-5 text-right">
                <span className="text-slate-500 font-mono text-[11px]">Current Standard</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/80 transition-colors text-slate-600">
              <td className="py-3.5 px-5 font-mono font-medium text-slate-700">2025.4-final</td>
              <td className="py-3.5 px-5">
                <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                  ARCHIVED
                </span>
              </td>
              <td className="py-3.5 px-5 font-mono text-slate-600">182 Rules</td>
              <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">2025-06-15 00:00:00 UTC</td>
              <td className="py-3.5 px-5 text-right">
                <button
                  type="button"
                  onClick={() => alert('Activated version 2025.4')}
                  className="text-[#005ea2] font-bold hover:underline cursor-pointer"
                >
                  Rollback
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Read-Only Active YAML Preview */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-[#005ea2]" />
            <span>Active Declarative Rulepack Specification (YAML)</span>
          </h3>
          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Read-Only Schema
          </span>
        </div>

        <pre className="p-4 bg-[#0b1329] border border-slate-800 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed max-h-[460px]">
          {yamlContent}
        </pre>
      </div>

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
