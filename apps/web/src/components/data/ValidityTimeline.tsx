import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useQueryClient } from '@tanstack/react-query';
import type { ValidityRecord } from '@contracts';
import { Clock, CheckCircle2, AlertTriangle, XCircle, Sliders, RefreshCw } from 'lucide-react';

interface ValidityTimelineProps {
  applicationId: string;
  records: ValidityRecord[];
  isDemoMode?: boolean;
}

export const ValidityTimeline: React.FC<ValidityTimelineProps> = ({
  applicationId,
  records,
  isDemoMode = true,
}) => {
  const queryClient = useQueryClient();
  const [offsetDays, setOffsetDays] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Debounced update to /demo/settings on slider shift
  useEffect(() => {
    if (!isDemoMode) return;

    const handler = setTimeout(async () => {
      setIsUpdating(true);
      try {
        await apiClient.put('/demo/settings', {
          decisionDateOffsetDays: offsetDays,
        });
        // Invalidate validity and findings to re-render in place
        queryClient.invalidateQueries({ queryKey: ['validity', applicationId] });
        queryClient.invalidateQueries({ queryKey: ['findings', applicationId] });
      } catch (err) {
        console.error('Failed to update decision date offset', err);
      } finally {
        setIsUpdating(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [offsetDays, applicationId, queryClient, isDemoMode]);

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'VALID':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            VALID
          </span>
        );
      case 'LAPSES_IN_PERIOD':
        return (
          <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            LAPSES IN PERIOD
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            EXPIRED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      data-testid="validity-timeline"
      className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-5"
    >
      {/* Live Demo Moment: Decision Date Slider */}
      {isDemoMode && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Live Demo: Decision Date Simulation Clock
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isUpdating && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Re-evaluating norm validity...
                </span>
              )}
              <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 border rounded">
                +{offsetDays} Days Offset
              </span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={offsetDays}
            onChange={(e) => setOffsetDays(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Simulate Decision Date Time Offset"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Today (T=0)</span>
            <span>+30 Days</span>
            <span>+60 Days</span>
            <span>+90 Days (Academic Session Start)</span>
          </div>
        </div>
      )}

      {/* Visual Timeline Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Statutory Document Validity Windows
        </h4>

        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.docId}
              className={`p-3.5 rounded-lg border transition-all ${
                rec.state === 'EXPIRED'
                  ? 'bg-rose-50/60 border-rose-300'
                  : rec.state === 'LAPSES_IN_PERIOD'
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{rec.documentName}</h5>
                  <span className="font-mono text-[11px] text-slate-500">Doc ID: {rec.docId}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStateBadge(rec.state)}
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {rec.daysRemaining} days remaining
                  </span>
                </div>
              </div>

              {/* Progress representation */}
              <div className="relative pt-2">
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      rec.state === 'EXPIRED'
                        ? 'bg-rose-600'
                        : rec.state === 'LAPSES_IN_PERIOD'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(5, (rec.daysRemaining / 365) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>Issued: {rec.validFrom}</span>
                  <span>Approval Period: {rec.approvalPeriod.start} – {rec.approvalPeriod.end}</span>
                  <span>Valid Until: {rec.validUntil}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
