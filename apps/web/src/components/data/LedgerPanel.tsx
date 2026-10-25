import React, { useState } from 'react';
import { StatusBadge } from '../status';
import { Button, Modal } from '../ui';
import type { LedgerEntry } from '@contracts';
import { ChevronDown, ChevronRight, CheckSquare, ShieldCheck, Clock, Server } from 'lucide-react';

interface LedgerPanelProps {
  entries: LedgerEntry[];
  onManualConfirm?: (entryId: string, outcome: 'CONFIRMED' | 'REJECTED', note: string) => Promise<void>;
}

export const LedgerPanel: React.FC<LedgerPanelProps> = ({ entries, onManualConfirm }) => {
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  const [manualDialogEntry, setManualDialogEntry] = useState<LedgerEntry | null>(null);
  const [manualOutcome, setManualOutcome] = useState<'CONFIRMED' | 'REJECTED'>('CONFIRMED');
  const [manualNote, setManualNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleExpand = (id: string) => {
    setExpandedEntries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitManualConfirm = async () => {
    if (!manualDialogEntry) return;
    setIsSubmitting(true);
    try {
      await onManualConfirm?.(manualDialogEntry.id, manualOutcome, manualNote);
      setManualDialogEntry(null);
      setManualNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="ledger-panel" className="space-y-3">
      {entries.map((entry) => {
        const isExpanded = !!expandedEntries[entry.id];
        const isManual =
          entry.status === 'MANUAL_REVIEW_REQUIRED' || entry.status === 'BLOCKED_LOW_CONFIDENCE';

        return (
          <div
            key={entry.id}
            className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs hover:border-slate-400 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <StatusBadge status={entry.status} size="sm" />
                <span className="font-mono font-bold text-xs text-slate-900">{entry.checkType}</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="font-mono text-xs text-slate-600">Doc {entry.docId}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="bg-slate-100 border px-1.5 py-0.5 rounded font-mono">
                  {entry.source.label}
                </span>
                {entry.source.kind === 'SYNTHETIC_DEMO' && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                    SYNTHETIC_DEMO
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Request Summary:</span>
                <p className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono text-[11px]">
                  {entry.requestSummary}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Response Summary:</span>
                <p className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono text-[11px]">
                  {entry.responseSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-3">
                <span>Requested: {new Date(entry.requestedAt).toLocaleTimeString()}</span>
                {entry.respondedAt && (
                  <span>Responded: {new Date(entry.respondedAt).toLocaleTimeString()}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isManual && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualDialogEntry(entry)}
                    className="bg-amber-50 border-amber-300 text-amber-900 text-xs py-1"
                  >
                    <CheckSquare className="w-3.5 h-3.5 mr-1" />
                    Record manual confirmation
                  </Button>
                )}

                {entry.earlierResults && entry.earlierResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(entry.id)}
                    className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Earlier results ({entry.earlierResults.length})</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded History */}
            {isExpanded && entry.earlierResults && (
              <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700 text-[11px] uppercase">Audit Run History:</span>
                {entry.earlierResults.map((hist, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b last:border-0 border-slate-200">
                    <span className="font-mono text-[11px]">{hist.timestamp}</span>
                    <StatusBadge status={hist.status} size="sm" />
                    <span className="text-slate-600 italic text-[11px]">{hist.note || 'Prior pipeline execution'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Manual Confirmation Dialog */}
      <Modal
        isOpen={!!manualDialogEntry}
        onClose={() => setManualDialogEntry(null)}
        title="Record Manual Regulatory Confirmation"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setManualDialogEntry(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={submitManualConfirm} isLoading={isSubmitting}>
              Save Confirmation & Seal
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            For entry <strong className="font-mono">{manualDialogEntry?.checkType}</strong> (Doc{' '}
            {manualDialogEntry?.docId}). Record statutory officer verification:
          </p>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Confirmation Outcome:</label>
            <select
              value={manualOutcome}
              onChange={(e) => setManualOutcome(e.target.value as any)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="CONFIRMED">CONFIRMED — Verified via official departmental channel</option>
              <option value="REJECTED">REJECTED — Failed manual verification</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Officer Verification Note / Dispatch Number:
            </label>
            <textarea
              rows={3}
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="Record verified file reference or official communication tracking id..."
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
