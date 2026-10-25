import React from 'react';
import { useRiskScoreBreakdown } from '../../api/queries';
import { Skeleton, ErrorState } from '../ui';
import { BandChip } from '../status';
import type { PillarScores } from '@contracts';
import { ShieldAlert, BarChart3, Info } from 'lucide-react';

const PILLAR_LABELS: Record<keyof PillarScores, { label: string; weight: number }> = {
  documentCompleteness: { label: 'Document Completeness', weight: 20 },
  anomalyFlags: { label: 'Anomaly Flags & Forensics', weight: 25 },
  sourceVerification: { label: 'Source Authority Verification', weight: 20 },
  historicalCompliance: { label: 'Historical Regulatory Compliance', weight: 15 },
  infrastructureEvidence: { label: 'Infrastructure Evidence (GIS/CAD)', weight: 20 },
};

export const RiskScorePanel: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const { data: score, isLoading, isError, error, refetch } = useRiskScoreBreakdown(applicationId);

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !score) {
    return (
      <div className="p-4">
        <ErrorState
          message={(error as any)?.message || 'Failed to load objective 5-pillar risk evaluation.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-5 text-xs">
      {/* Header with Total Score and Risk Band */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#005ea2]" />
            <h3 className="text-sm font-bold text-slate-900">
              Five-Pillar Regulatory Risk Score Evaluation
            </h3>
          </div>
          <p className="text-slate-600 text-[11px] mt-0.5">
            Objective algorithm evaluates documentary completeness, anomaly heuristics, and authority clearances.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="font-mono text-2xl font-black text-slate-900 leading-none">
              {score.totalScore}
            </span>
            <span className="text-slate-500 text-xs font-mono"> / 100</span>
          </div>
          <BandChip band={score.riskLevel} />
        </div>
      </div>

      {/* 5-Pillar Weighted Progress Bars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Pillar Conformance Scores:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(Object.keys(score.pillarScores) as (keyof PillarScores)[]).map((key) => {
            const pillar = PILLAR_LABELS[key];
            const val = score.pillarScores[key];
            return (
              <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800">
                    {pillar.label}{' '}
                    <span className="text-slate-500 font-normal font-mono">({pillar.weight}%)</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{val} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      val >= 75 ? 'bg-emerald-600' : val >= 50 ? 'bg-amber-500' : 'bg-rose-600'
                    }`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Objective Deductions Log */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Objective Point Deductions Log:
        </h4>

        <div className="space-y-2">
          {score.deductions.map((d) => (
            <div
              key={d.ruleId}
              className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-xs shrink-0">
                  −{d.points} pts
                </span>
                <div>
                  <span className="font-bold text-slate-900">{d.ruleId}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{d.explanation}</p>
                </div>
              </div>

              {d.handbookRef && (
                <span className="font-mono text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0 self-end sm:self-auto">
                  {d.handbookRef}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Advisory Notice */}
      <div className="p-3 bg-slate-100 rounded border border-slate-200 text-slate-600 flex items-start gap-2 text-[11px]">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Decision Support Notice:</strong> Risk evaluations are produced by normative Rules Engine{' '}
          <span className="font-mono">{score.rulesVersion}</span>. Automated scores are advisory aids and do not constitute statutory determinations. Authorized scrutiny officers record all formal approvals and deficiency citations.
        </p>
      </div>
    </div>
  );
};
