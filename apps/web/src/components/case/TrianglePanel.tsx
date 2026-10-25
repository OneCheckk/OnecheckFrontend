import React, { useState } from 'react';
import { useTriangleFindings } from '../../api/queries';
import { Skeleton, ErrorState, Modal, Button } from '../ui';
import { StatusBadge } from '../status';
import type { TriangleFinding, VerificationStatus } from '@contracts';
import { Network, Search, Filter, FileText, BookOpen } from 'lucide-react';

const NODE_LABELS = {
  COLLEGE_CLAIM: '1. College Form Claim',
  DOCUMENT_OCR: '2. Document OCR Extraction',
  AICTE_RECORDS: '3. AICTE Historical Ledger',
};

export const TrianglePanel: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const { data: findings = [], isLoading, isError, error, refetch } = useTriangleFindings(applicationId);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFinding, setSelectedFinding] = useState<TriangleFinding | null>(null);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ErrorState
          message={(error as any)?.message || 'Failed to load Triangle of Truth findings.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const filteredFindings = findings.filter(
    (f) => statusFilter === 'ALL' || f.status === statusFilter
  );

  return (
    <div className="space-y-4 text-xs">
      {/* Header & Filter Belt */}
      <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#005ea2]" />
              <h3 className="text-sm font-bold text-slate-900">
                Triangle of Truth — 3-Way Claim Graph Reconciler
              </h3>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Triangulates declared college form claims against document OCR extractions and central AICTE records. Contradictions between any two nodes trigger explicit discrepancy findings.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="triangle-filter" className="text-slate-600 font-semibold text-[11px]">
              Filter:
            </label>
            <select
              id="triangle-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white font-medium focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="ALL">All Finding Statuses ({findings.length})</option>
              <option value="MISMATCH_DETECTED">MISMATCH_DETECTED</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="MANUAL_REVIEW_REQUIRED">MANUAL_REVIEW_REQUIRED</option>
              <option value="SOURCE_UNAVAILABLE">SOURCE_UNAVAILABLE</option>
              <option value="VERIFICATION_PENDING">VERIFICATION_PENDING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFindings.length === 0 ? (
          <div className="bg-white border border-slate-300 rounded-lg p-8 text-center text-slate-500">
            No triangle findings match the selected status filter.
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className={`bg-white border rounded-lg p-4 shadow-2xs space-y-3 transition-colors ${
                finding.status === 'MISMATCH_DETECTED'
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{finding.title}</h4>
                  <span className="font-mono text-[11px] text-slate-500">
                    Claim Key: <strong>{finding.claimKey}</strong>
                  </span>
                </div>
                <StatusBadge status={finding.status} size="sm" />
              </div>

              {/* 3-Node Comparison Card Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {finding.nodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      {NODE_LABELS[node.source] || node.source}
                    </span>
                    <p className="font-medium text-xs text-slate-900 leading-snug">{node.value}</p>
                  </div>
                ))}
              </div>

              {/* Discrepancy Note */}
              <p className="text-slate-700 text-xs leading-relaxed bg-white/80 p-2.5 border border-slate-200 rounded">
                {finding.explanation}
              </p>

              {/* Footer Evidence References & Inspect Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Evidence: {finding.evidencePage}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    Handbook: {finding.handbookClause}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFinding(finding)}
                  className="text-[#005ea2] hover:text-[#0b4778] font-bold text-xs hover:underline cursor-pointer self-end sm:self-auto"
                >
                  Inspect Evidence Detail →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspect Evidence Modal */}
      {selectedFinding && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFinding(null)}
          title={selectedFinding.title}
          footer={
            <Button size="sm" variant="primary" onClick={() => setSelectedFinding(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedFinding.status} size="sm" />
              <span className="font-mono text-[11px] text-slate-500">
                Key: {selectedFinding.claimKey}
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px] block">
                Triangulation Nodes:
              </span>
              <div className="space-y-1.5">
                {selectedFinding.nodes.map((n, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-[10.5px] uppercase text-slate-600 block">
                      {NODE_LABELS[n.source] || n.source}
                    </span>
                    <span className="text-slate-900 font-medium">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">Discrepancy Analysis:</span>
              <p className="text-slate-700 leading-relaxed">{selectedFinding.explanation}</p>
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 font-medium">Evidence Page:</span>
                  <p className="font-mono text-slate-800 font-semibold">{selectedFinding.evidencePage}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Statutory Clause:</span>
                  <p className="font-mono text-slate-800 font-semibold">{selectedFinding.handbookClause}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
