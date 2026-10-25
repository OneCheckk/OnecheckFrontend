import React, { useState } from 'react';
import { StatusBadge, SeverityChip, StateChip, PlaceholderTag } from '../status';
import { Button } from '../ui';
import type { Finding, FindingEvidence } from '@contracts';
import {
  FileText,
  Calculator,
  History,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface FindingDetailProps {
  finding?: Finding;
  onSelectEvidence?: (evidence: FindingEvidence) => void;
  onDisposition: (state: string, reason?: string) => Promise<void>;
  onRequestClarification?: () => void;
}

export const FindingDetail: React.FC<FindingDetailProps> = ({
  finding,
  onSelectEvidence,
  onDisposition,
  onRequestClarification,
}) => {
  const [dismissReason, setDismissReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDismissInput, setShowDismissInput] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!finding) {
    return (
      <div
        data-testid="finding-detail-empty"
        className="flex items-center justify-center h-full bg-white border border-slate-300 rounded-lg p-8 text-center text-slate-500 text-xs"
      >
        Select a finding from the left panel to inspect its statutory proof, evidence trail, and record disposition.
      </div>
    );
  }

  const handleDismiss = async () => {
    if (dismissReason.trim().length < 10) {
      setErrorMsg('A mandatory justification of at least 10 characters is required to dismiss a regulatory finding.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onDisposition('DISMISSED', dismissReason);
      setShowDismissInput(false);
      setDismissReason('');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || 'Failed to update disposition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onDisposition('ACCEPTED');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="finding-detail"
      className="flex flex-col h-full bg-white border border-slate-300 rounded-lg overflow-y-auto text-xs"
    >
      {/* Finding Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <SeverityChip severity={finding.severity} />
            <span className="font-mono text-slate-500 font-medium">{finding.ruleId}</span>
          </div>
          <StateChip state={finding.state} />
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">{finding.title}</h3>
        <p className="text-slate-700 leading-relaxed text-xs mb-2">{finding.message}</p>

        {finding.placeholder && (
          <div className="mt-2">
            <PlaceholderTag />
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Clause Reference */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2.5 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Statutory Handbook Clause:</span>
          <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 border rounded">
            {finding.clauseRef}
          </span>
        </div>

        {/* Proof Statement */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Proof Statement</span>
          </h4>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono text-[11px] leading-relaxed">
            {finding.proof.statement}
          </div>
        </div>

        {/* Proof Computation (Rendered from API, not calculated in React) */}
        {finding.proof.computation && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-700" />
              <span>Normative Computation</span>
            </h4>
            <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded text-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Formula:</span>
                <span className="font-mono font-bold text-indigo-950 text-xs">
                  {finding.proof.computation.formula}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Inputs:</span>
                <span className="font-mono text-slate-800 text-[11px]">
                  {JSON.stringify(finding.proof.computation.inputs)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-indigo-200/80">
                <span className="text-slate-700 font-semibold text-[11px]">Computed Discrepancy:</span>
                <span className="font-mono font-bold text-rose-800 text-xs">
                  {finding.proof.computation.result}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Cited Evidence Trail */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
            Cited Evidence Lines ({finding.proof.evidence.length})
          </h4>
          <div className="space-y-2">
            {finding.proof.evidence.map((ev, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{ev.label}</span>
                  <span className="text-[10px] bg-white border px-1 rounded font-mono text-slate-600">
                    Confidence: {Math.round(ev.confidence * 100)}%
                  </span>
                </div>
                <p className="text-slate-600 italic text-[11px] mb-2">
                  "{ev.source.snippet || `${ev.value} ${ev.unit || ''}`}"
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">
                    Doc: {ev.source.docId} • Page {ev.source.page}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectEvidence?.(ev)}
                    className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Jump to BBox</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Officer Disposition Form */}
        <div className="pt-3 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
            Official Regulatory Disposition
          </h4>

          {finding.dismissalReason && (
            <div className="p-2.5 mb-3 bg-slate-100 border rounded text-[11px] text-slate-700">
              <span className="font-bold block text-slate-900">Recorded Dismissal Reason:</span>
              <p className="mt-0.5">{finding.dismissalReason}</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-2 mb-2 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded">
              {errorMsg}
            </div>
          )}

          {!showDismissInput ? (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                disabled={isSubmitting || finding.state === 'ACCEPTED'}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Accept Finding
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDismissInput(true)}
                disabled={isSubmitting || finding.state === 'DISMISSED'}
              >
                <XCircle className="w-3.5 h-3.5 mr-1 text-slate-600" />
                Dismiss Finding...
              </Button>

              {onRequestClarification && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRequestClarification}
                  disabled={isSubmitting || finding.state === 'CLARIFICATION_REQUESTED'}
                >
                  <HelpCircle className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Queue for Clarification Letter
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 p-3 bg-slate-50 border border-slate-300 rounded">
              <label className="block font-medium text-slate-800 text-[11px]">
                Statutory Justification for Dismissal (min 10 characters required):
              </label>
              <textarea
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                rows={3}
                placeholder="State the regulatory basis, verifying document, or authorized exemption..."
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDismissInput(false);
                    setErrorMsg(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDismiss}
                  isLoading={isSubmitting}
                >
                  Confirm Dismissal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
