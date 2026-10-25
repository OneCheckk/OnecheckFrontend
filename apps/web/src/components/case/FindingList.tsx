import React, { useState } from 'react';
import { StatusBadge, StateChip, SeverityChip, PlaceholderTag } from '../status';
import type { Finding, Severity } from '@contracts';
import { ChevronDown, ChevronRight, CheckCircle2, ShieldAlert, FileSearch } from 'lucide-react';

interface FindingListProps {
  findings: Finding[];
  selectedFindingId?: string;
  onSelectFinding: (finding: Finding) => void;
  passedChecksCount?: number;
}

export const FindingList: React.FC<FindingListProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  passedChecksCount = 14,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [showPassedChecks, setShowPassedChecks] = useState<boolean>(false);
  const [showDocumentSignals, setShowDocumentSignals] = useState<boolean>(false);

  // Filter findings
  const filtered = findings.filter((f) => {
    if (filterSeverity !== 'ALL' && f.severity !== filterSeverity) return false;
    return true;
  });

  // Group by severity
  const severityOrder: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
  const grouped = severityOrder.reduce((acc, sev) => {
    acc[sev] = filtered.filter((f) => f.severity === sev);
    return acc;
  }, {} as Record<Severity, Finding[]>);

  return (
    <div
      data-testid="finding-list"
      className="flex flex-col h-full bg-white border border-slate-300 rounded-lg overflow-hidden"
    >
      {/* Header and Filter Controls */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Automated Findings ({findings.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Advisory for Official Review</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-2 py-0.5 rounded text-xs font-medium border ${
              filterSeverity === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {severityOrder.map((sev) => {
            const count = findings.filter((f) => f.severity === sev).length;
            if (count === 0) return null;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-0.5 rounded text-xs font-medium border flex items-center gap-1 ${
                  filterSeverity === sev
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{sev}</span>
                <span className="bg-black/10 px-1.5 py-0.2 rounded text-[10px] font-mono">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Findings List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No findings match the selected severity filter.
          </div>
        ) : (
          severityOrder.map((sev) => {
            const items = grouped[sev];
            if (!items || items.length === 0) return null;

            return (
              <div key={sev} className="space-y-1.5">
                <div className="flex items-center gap-2 px-1">
                  <SeverityChip severity={sev} />
                  <span className="text-xs font-semibold text-slate-500">({items.length})</span>
                </div>

                <div className="space-y-1.5">
                  {items.map((finding) => {
                    const isSelected = selectedFindingId === finding.findingId;
                    return (
                      <div
                        key={finding.findingId}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectFinding(finding)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onSelectFinding(finding);
                          }
                        }}
                        className={`p-3 rounded-md border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-600'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <StatusBadge status={finding.status} size="sm" />
                          <StateChip state={finding.state} />
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                          {finding.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-mono bg-slate-100 px-1 rounded">{finding.ruleId}</span>
                          {finding.placeholder && <span className="text-[10px] text-amber-700 font-medium">Norm TBD</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Collapsible Checks Passed Section */}
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowPassedChecks(!showPassedChecks)}
            className="w-full flex items-center justify-between p-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200"
          >
            <span className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Checks passed ({passedChecksCount})
            </span>
            {showPassedChecks ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showPassedChecks && (
            <div className="p-2.5 mt-1 bg-slate-50/80 rounded border border-slate-200 text-xs text-slate-700 space-y-1.5 font-sans">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span>Land Ownership Title Verification</span>
                <span className="text-emerald-700 font-medium">MATCH</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span>Principal Qualification Norm (APH-CL-5.1)</span>
                <span className="text-emerald-700 font-medium">MATCH</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span>Barrier-Free Ramp & Lift Access</span>
                <span className="text-emerald-700 font-medium">PASS</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Computer Center Terminal Density</span>
                <span className="text-emerald-700 font-medium">PASS</span>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Document Signals Section */}
        <div>
          <button
            type="button"
            onClick={() => setShowDocumentSignals(!showDocumentSignals)}
            className="w-full flex items-center justify-between p-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200"
          >
            <span className="flex items-center gap-1.5 text-amber-900">
              <FileSearch className="w-4 h-4 text-amber-700" />
              Document signals (Forensic analysis)
            </span>
            {showDocumentSignals ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showDocumentSignals && (
            <div className="p-2.5 mt-1 bg-amber-50/50 rounded border border-amber-200 text-xs text-slate-800 space-y-2">
              <div className="border-b border-amber-200 pb-1.5">
                <span className="font-bold text-amber-950 block">Building Plan (D2) — Modified Producer XRef</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Metadata indicates PDF generated on 2021-04-12, but re-saved with PDF-XChange v9.2 on 2026-10-23.
                </p>
                <p className="text-[10px] text-amber-800 mt-1 italic">
                  Limitation: Signal indicates post-processing, requiring officer inspection of municipal approval stamp.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
