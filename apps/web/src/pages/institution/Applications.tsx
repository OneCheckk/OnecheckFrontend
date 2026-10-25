import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../api/queries';
import { BandChip } from '../../components/status';
import {
  PageHeader,
  Button,
  FilterBar,
  EmptyState,
  ErrorState,
  Skeleton,
} from '../../components/ui';
import { PlusCircle, ChevronRight, FileText } from 'lucide-react';
import type { Application } from '@contracts';

export const InstitutionApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: applications, isLoading, isError, error, refetch } = useApplications();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredApps = useMemo(() => {
    if (!applications) return [];
    return applications.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 w-full space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6 w-full">
        <ErrorState
          title="Could not load applications"
          message={(error as any)?.message || 'An error occurred fetching institutional applications.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const activeTags = [];
  if (statusFilter !== 'ALL') {
    activeTags.push({
      id: 'status',
      label: `Status: ${statusFilter}`,
      onRemove: () => setStatusFilter('ALL'),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <PageHeader
        title="Institutional Applications Desk"
        description="Statutory AICTE Approval Process filings, document bundle submissions, and automated pre-submission self-scrutiny checks."
        breadcrumbs={[{ label: 'Institutional Desk' }, { label: 'My Applications' }]}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/portal/new')}
            className="bg-[#005ea2] hover:bg-blue-800"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>Create New Filing</span>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-4">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          searchPlaceholder="Search by application number, institute name, or category..."
          totalCount={filteredApps.length}
          activeTags={activeTags}
          onClearAll={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
          }}
          filtersSlot={
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#005ea2]"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_SCRUTINY">UNDER_SCRUTINY</option>
              <option value="DEFICIENCY_ISSUED">DEFICIENCY_ISSUED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          }
        />
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState
          title="No Matching Applications"
          description={
            applications && applications.length > 0
              ? 'No application records matched your search or status filter.'
              : 'Your institution does not have any active statutory approval filings for the current academic session.'
          }
          actionText="Create New Application"
          onAction={() => navigate('/portal/new')}
        />
      ) : (
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
                <tr className="bg-[#0b2545] border-b border-slate-700 text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Approval Category</th>
                  <th className="py-3.5 px-4">Regulatory Status</th>
                  <th className="py-3.5 px-4">Risk Band</th>
                  <th className="py-3.5 px-4">Checklist Items</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredApps.map((app, rowIdx) => {
                  const isSubmitted = app.status !== 'DRAFT';
                  return (
                    <tr
                      key={app.id}
                      onClick={() => navigate(`/portal/applications/${app.id}`)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block text-xs sm:text-sm">
                          {app.applicationNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">{app.institutionName}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {app.category.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {isSubmitted && app.band ? (
                          <BandChip band={app.band} />
                        ) : (
                          <span className="text-slate-400 font-mono text-[10.5px]">Draft (Unassessed)</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs font-medium">
                        {app.missingItemsCount > 0 ? (
                          <span className="text-amber-700 font-semibold font-mono">{app.missingItemsCount} missing</span>
                        ) : (
                          <span className="text-slate-600">Complete</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="text-[#005ea2] font-bold inline-flex items-center gap-1 hover:underline">
                          <span>Open Filing</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
