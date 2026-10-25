import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications, useOfficerDashboard } from '../../api/queries';
import { BandChip, DemoBanner } from '../../components/status';
import { Button, ErrorState, Skeleton } from '../../components/ui';
import {
  Inbox,
  Search,
  SlidersHorizontal,
  Clock,
  ShieldAlert,
  Server,
  ArrowUpDown,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const OfficerQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [bandFilter, setBandFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: dashboard, isLoading: dashLoading } = useOfficerDashboard();
  const { data: applications = [], isLoading: appsLoading, isError, error, refetch } = useApplications({
    band: bandFilter !== 'ALL' ? bandFilter : undefined,
    search: searchQuery || undefined,
  });

  if (dashLoading || appsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ErrorState message="Could not load regulatory scrutiny queue from central server." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Scrutiny Officer Review Queue
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            AICTE Central Scrutiny Desk • Automated evidence validation and regulatory decision recording.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards from /dashboard/officer */}
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Card 1: Risk Band Counts */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Cases by Risk Band
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-medium text-slate-800">
                Red: <span className="font-mono font-bold text-rose-800">{dashboard.bandCounts?.RED ?? 0}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">•</span>
              <span className="font-medium text-slate-800">
                Yellow: <span className="font-mono font-bold text-slate-800">{dashboard.bandCounts?.YELLOW ?? 0}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">•</span>
              <span className="font-medium text-slate-800">
                Green: <span className="font-mono font-bold text-emerald-800">{dashboard.bandCounts?.GREEN ?? 0}</span>
              </span>
            </div>
          </div>

          {/* Card 2: Pending Source Verifications */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Pending Sources
            </span>
            <span className="text-2xl font-black text-slate-900 block">
              {dashboard.pendingSourceVerifications ?? dashboard.pendingSources ?? 0}
            </span>
            <span className="text-[10px] text-slate-500">Awaiting remote departmental response</span>
          </div>

          {/* Card 3: Oldest Unresolved Item */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Oldest Unresolved
            </span>
            <span className="text-2xl font-black text-slate-900 block">
              {dashboard.oldestUnresolvedDays ?? 4} Days
            </span>
            <span className="text-[10px] text-slate-500">Prioritized by statutory queue order</span>
          </div>

          {/* Card 4: Average Time Per Stage */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Avg Time / Stage
            </span>
            <span className="text-2xl font-black text-emerald-900 block">
              {dashboard.avgTimePerStageDays ?? 1.8} Days
            </span>
            <span className="text-[10px] text-slate-500">Benchmark SLA: 3.0 days</span>
          </div>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by application number or institution name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Band Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Band:
          </span>
          {['ALL', 'RED', 'YELLOW', 'GREEN'].map((b) => (
            <button
              key={b}
              onClick={() => setBandFilter(b)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                bandFilter === b
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
        {/* Subtle Tricolor Accent Strip */}
        <div className="h-[2px] w-full flex" aria-hidden="true">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Risk Band</th>
                <th className="py-3 px-4">Open Findings (by Severity)</th>
                <th className="py-3 px-4">Pending Sources</th>
                <th className="py-3 px-4">Needs Confirm</th>
                <th className="py-3 px-4">Submitted Age</th>
                <th className="py-3 px-4 text-right">Case Packet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => navigate(`/review/${app.id}`)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block text-sm">
                      {app.applicationNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {app.institutionName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {app.category.replace(/_/g, ' ')}
                  </td>

                  <td className="py-3.5 px-4">
                    {app.band ? (
                      <BandChip band={app.band} />
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">UNASSIGNED</span>
                    )}
                  </td>

                  {/* Open Findings Summary */}
                  <td className="py-3 px-4">
                    {(() => {
                      const crit = app.openFindingsCount.critical || 0;
                      const high = app.openFindingsCount.high || 0;
                      const med = app.openFindingsCount.medium || 0;
                      const low = app.openFindingsCount.low || 0;
                      const total = crit + high + med + low + (app.openFindingsCount.info || 0);

                      if (total === 0) {
                        return <span className="text-slate-400 font-mono text-xs">—</span>;
                      }

                      return (
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900">{total} open</span>
                          <div className="text-[11px] text-slate-500 mt-0.5 space-x-1.5 font-mono">
                            {crit > 0 && <span className="text-rose-700 font-medium">{crit} Crit</span>}
                            {high > 0 && <span className="text-red-700 font-medium">{high} High</span>}
                            {med > 0 && <span className="text-amber-700 font-medium">{med} Med</span>}
                            {low > 0 && !crit && !high && <span>{low} Low</span>}
                          </div>
                        </div>
                      );
                    })()}
                  </td>

                  <td className="py-3 px-4 font-mono text-xs">
                    {app.pendingSourcesCount > 0 ? (
                      <span className="text-blue-900 font-medium">{app.pendingSourcesCount} pending</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-xs">
                    {app.claimsNeedingConfirmationCount > 0 ? (
                      <span className="text-slate-900 font-medium">{app.claimsNeedingConfirmationCount}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {app.submittedAge || 'Recently'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-blue-700 font-bold inline-flex items-center gap-1 hover:underline">
                      <span>Open Packet</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
