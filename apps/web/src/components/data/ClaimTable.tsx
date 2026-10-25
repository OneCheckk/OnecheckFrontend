import React, { useState } from 'react';
import { StatusBadge, StateChip } from '../status';
import { Button, Modal } from '../ui';
import type { Claim, ClaimRecheckResult } from '@contracts';
import { Edit2, CheckCircle, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';

interface ClaimTableProps {
  claims: Claim[];
  onSelectClaimSource?: (claim: Claim) => void;
  onConfirmClaim?: (claimId: string) => Promise<void>;
  onEditClaim?: (claimId: string, value: string | number, reason: string) => Promise<ClaimRecheckResult>;
  onShowRecheckToast?: (result: ClaimRecheckResult) => void;
}

export const ClaimTable: React.FC<ClaimTableProps> = ({
  claims,
  onSelectClaimSource,
  onConfirmClaim,
  onEditClaim,
  onShowRecheckToast,
}) => {
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const startEdit = (claim: Claim) => {
    setEditingClaim(claim);
    setNewValue(String(claim.value));
    setEditReason('');
    setErrorMsg(null);
  };

  const submitEdit = async () => {
    if (!editReason || editReason.trim().length < 5) {
      setErrorMsg('A mandatory explanation (min 5 chars) is required for correcting extracted data.');
      return;
    }
    if (!editingClaim) return;

    setIsSubmitting(true);
    try {
      const parsedValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
      const res = await onEditClaim?.(editingClaim.claimId, parsedValue, editReason);
      if (res && onShowRecheckToast) {
        onShowRecheckToast(res);
      }
      setEditingClaim(null);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || 'Failed to apply correction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="claim-table" className="w-full bg-white border border-slate-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Predicate</th>
              <th className="py-2.5 px-3">Extracted Value</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Verification Status</th>
              <th className="py-2.5 px-3">Source Evidence</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {claims.map((claim) => {
              const isLowConfidence = claim.confidence < 0.75 || claim.needsConfirmation;
              return (
                <tr
                  key={claim.claimId}
                  data-testid="claim-row"
                  className={`hover:bg-slate-50 transition-colors ${
                    isLowConfidence ? 'bg-amber-50/60' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{claim.predicateLabel}</span>
                    <span className="font-mono text-[10px] text-slate-500">{claim.predicate}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {claim.value} {claim.unit || ''}
                    </span>
                    {claim.originalValue && (
                      <span className="block text-[10px] text-slate-400 line-through">
                        Original: {claim.originalValue}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            claim.confidence >= 0.85
                              ? 'bg-emerald-600'
                              : claim.confidence >= 0.7
                              ? 'bg-amber-500'
                              : 'bg-rose-600'
                          }`}
                          style={{ width: `${claim.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-medium text-slate-700">
                        {Math.round(claim.confidence * 100)}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <StatusBadge status={claim.status} size="sm" />
                  </td>

                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => onSelectClaimSource?.(claim)}
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold hover:underline"
                    >
                      <span className="font-mono text-[11px]">
                        Doc {claim.source.docId} (p.{claim.source.page})
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isLowConfidence && !claim.confirmed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onConfirmClaim?.(claim.claimId)}
                          className="bg-amber-100 border-amber-300 text-amber-900 text-[11px] py-1 px-2"
                        >
                          <HelpCircle className="w-3 h-3 text-amber-700" />
                          Please confirm
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(claim)}
                        className="text-[11px] py-1 px-2 text-slate-700"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Claim Modal with Mandatory Reason */}
      <Modal
        isOpen={!!editingClaim}
        onClose={() => setEditingClaim(null)}
        title={`Edit Extracted Data: ${editingClaim?.predicateLabel}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditingClaim(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={submitEdit} isLoading={isSubmitting}>
              Confirm Correction & Re-verify
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Corrected Value:</label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Mandatory Correction Reason (Regulatory Audit Log):
            </label>
            <textarea
              rows={3}
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder="e.g. Scanned OCR misread digit 4 as 1 in sub-clause table..."
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 rounded flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
