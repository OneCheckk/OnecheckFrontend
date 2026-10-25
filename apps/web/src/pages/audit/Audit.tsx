import React, { useState } from 'react';
import { useAuditEvents, useVerifyAuditChain } from '../../api/queries';
import { Button, ErrorState, Skeleton } from '../../components/ui';
import type { AuditEvent } from '@contracts';
import {
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const AuditPage: React.FC = () => {
  const { data: events = [], isLoading, isError, error, refetch } = useAuditEvents();
  const verifyMutation = useVerifyAuditChain();

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [verifyResult, setVerifyResult] = useState<{
    intact: boolean;
    verifiedCount: number;
    brokenAtSeq?: number;
  } | null>(null);

  const [searchAction, setSearchAction] = useState<string>('');

  const handleVerify = async () => {
    try {
      const res = await verifyMutation.mutateAsync();
      setVerifyResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (!searchAction) return true;
    return (
      ev.action.toLowerCase().includes(searchAction.toLowerCase()) ||
      ev.actor.name.toLowerCase().includes(searchAction.toLowerCase()) ||
      ev.entity.id.toLowerCase().includes(searchAction.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ErrorState message="Could not load cryptographic audit events." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-800" />
            <span>Immutable Regulatory Audit Chain</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Cryptographic SHA-256 forward-linked audit trail. Every decision and document interaction is immutably logged.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleVerify}
          isLoading={verifyMutation.isPending}
          className="bg-[#005ea2] hover:bg-blue-800 font-bold"
        >
          <ShieldCheck className="w-4 h-4 mr-1.5" />
          <span>Verify Hash Chain Integrity</span>
        </Button>
      </div>

      {/* Verification Status Alert */}
      {verifyResult && (
        <div
          data-testid="verify-result-banner"
          role="alert"
          className={`p-4 rounded-lg border text-xs font-semibold flex items-center justify-between shadow-2xs ${
            verifyResult.intact
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {verifyResult.intact ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>
              {verifyResult.intact
                ? `Chain intact (${verifyResult.verifiedCount} events checked)`
                : `Chain broken at event #${verifyResult.brokenAtSeq}`}
            </span>
          </div>

          <button
            onClick={() => setVerifyResult(null)}
            className="text-xs underline text-slate-600 hover:text-slate-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchAction}
          onChange={(e) => setSearchAction(e.target.value)}
          placeholder="Filter by action name, actor, or entity id..."
          className="w-full text-xs border-0 focus:outline-none"
        />
      </div>

      {/* Audit Events Table */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Seq</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3 font-mono">SHA-256 Hash</th>
                <th className="py-2.5 px-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEvents.map((ev) => {
                const isExpanded = expandedRow === ev.seq;
                return (
                  <React.Fragment key={ev.seq}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : ev.seq)}
                      className="hover:bg-slate-50 cursor-pointer font-mono text-xs transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-slate-900">#{ev.seq}</td>
                      <td className="py-3 px-3 text-slate-600">{new Date(ev.ts).toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-blue-900">{ev.action}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="font-semibold block">{ev.actor.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{ev.actor.role}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {ev.entity.type}:{ev.entity.id}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {ev.hash.substring(0, 16)}...
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-blue-700 font-sans font-semibold inline-flex items-center gap-1">
                          <span>{isExpanded ? 'Hide' : 'View'}</span>
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable JSON Payload Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-slate-50 p-4 border-b border-slate-200">
                          <div className="bg-slate-900 text-emerald-400 p-3 rounded font-mono text-[11px] overflow-x-auto leading-relaxed">
                            <div className="text-slate-400 mb-1">
                              // Previous Hash: {ev.prevHash}
                            </div>
                            <pre>{JSON.stringify(ev.payload, null, 2)}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
