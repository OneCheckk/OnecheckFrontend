import React from 'react';
import type { FindingEvidence } from '@contracts';
import { FileText, ArrowRightLeft } from 'lucide-react';

interface EvidenceCompareProps {
  evidenceA: FindingEvidence;
  evidenceB: FindingEvidence;
}

export const EvidenceCompare: React.FC<EvidenceCompareProps> = ({ evidenceA, evidenceB }) => {
  return (
    <div
      data-testid="evidence-compare"
      className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wide">
        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
        <span>Cross-Document Comparative Reconciliation</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source A */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              {evidenceA.label}
            </span>
            <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-slate-600 font-mono">
              Conf: {Math.round(evidenceA.confidence * 100)}%
            </span>
          </div>
          <div className="bg-white p-2 border border-slate-200 rounded mb-2 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase">Extracted Value:</span>
            <span className="font-mono font-bold text-base text-slate-900">
              {evidenceA.value} {evidenceA.unit || ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 italic">
            "{evidenceA.source.snippet || 'Extracted from cited document context'}"
          </p>
        </div>

        {/* Source B */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              {evidenceB.label}
            </span>
            <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-slate-600 font-mono">
              Conf: {Math.round(evidenceB.confidence * 100)}%
            </span>
          </div>
          <div className="bg-white p-2 border border-slate-200 rounded mb-2 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase">Compared Value:</span>
            <span className="font-mono font-bold text-base text-slate-900">
              {evidenceB.value} {evidenceB.unit || ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 italic">
            "{evidenceB.source.snippet || 'Extracted from cited document context'}"
          </p>
        </div>
      </div>
    </div>
  );
};

interface RecordEvidenceCardProps {
  label: string;
  value: string | number;
  sourceLabel?: string;
  timestamp?: string;
  isDemo?: boolean;
}

export const RecordEvidenceCard: React.FC<RecordEvidenceCardProps> = ({
  label,
  value,
  sourceLabel = 'DEMO ADAPTER - simulated source',
  timestamp,
  isDemo = true,
}) => {
  return (
    <div
      data-testid="record-evidence-card"
      className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-800">{label}</span>
        {isDemo && (
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-medium">
            SYNTHETIC_DEMO
          </span>
        )}
      </div>
      <div className="font-mono font-bold text-sm text-slate-900 mb-1.5">{value}</div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t pt-1.5">
        <span className="truncate max-w-[200px]">{sourceLabel}</span>
        {timestamp && <span>{new Date(timestamp).toLocaleDateString()}</span>}
      </div>
    </div>
  );
};
