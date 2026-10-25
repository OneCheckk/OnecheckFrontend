import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlerts, useUpdateAlertStatus } from '../../api/queries';
import { PageHeader, Skeleton, ErrorState, Modal, Button } from '../../components/ui';
import { SeverityChip } from '../../components/status';
import type { Alert, Severity } from '@contracts';
import { AlertCircle, Filter, CheckCircle2, ChevronRight, Clock, ShieldAlert } from 'lucide-react';

export const AlertsQueuePage: React.FC = () => {
  const { data: alerts = [], isLoading, isError, error, refetch } = useAlerts();
  const updateStatusMutation = useUpdateAlertStatus();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [nextStatus, setNextStatus] = useState<string>('ACKNOWLEDGED');
  const [reason, setReason] = useState<string>('');
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        <ErrorState
          message={(error as any)?.message || 'Failed to load regulatory alerts queue.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const filteredAlerts = alerts.filter(
    (a) => severityFilter === 'ALL' || a.severity === severityFilter
  );

  const handleUpdate = async () => {
    if (!reason.trim() || reason.trim().length < 5) {
      setReasonError('A regulatory rationale of at least 5 characters is mandatory.');
      return;
    }
    setReasonError(null);

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedAlert!.id,
        status: nextStatus,
        reason,
      });
      setToastMessage(`Alert ${selectedAlert!.id} marked as ${nextStatus}.`);
      setSelectedAlert(null);
      setReason('');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e: any) {
      setReasonError(e?.message || 'Failed to update alert status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6 text-xs">
      <PageHeader
        title="Regulatory Alerts & Forensic Signals Queue"
        description="Priority queue of document anomalies, temporal certificate lapses, GIS geofence discrepancies, and ghost-faculty collisions."
        breadcrumbs={[{ label: 'Scrutiny Officer Desk' }, { label: 'Alerts Queue' }]}
      />

      {toastMessage && (
        <div
          role="status"
          className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Filter Belt */}
      <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700 text-xs">Filter by Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverityFilter(s)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                severityFilter === s
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-slate-500 font-mono text-[11px]">
          Showing <strong>{filteredAlerts.length}</strong> of {alerts.length} signals
        </span>
      </div>

      {/* Table */}
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
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Signal Type & Description</th>
                <th className="py-3 px-4">Application Reference</th>
                <th className="py-3 px-4 font-mono">Raised At</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAlerts.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <SeverityChip severity={alt.severity} />
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block text-xs">{alt.type}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{alt.message}</p>
                    {alt.acknowledged && (
                      <span className="font-mono text-[10px] text-slate-500 mt-1 block">
                        ✓ Officer Acknowledged
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-medium">
                    <Link
                      to={`/review/${alt.applicationId}`}
                      className="text-[#005ea2] hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>{alt.applicationId}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(alt.raisedAt).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alt);
                        setNextStatus(alt.acknowledged ? 'RESOLVED' : 'ACKNOWLEDGED');
                      }}
                      className="text-xs"
                    >
                      Update Signal
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {selectedAlert && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAlert(null)}
          title="Update Forensic Signal Status"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedAlert(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdate}
                isLoading={updateStatusMutation.isPending}
                className="bg-[#005ea2] font-bold"
              >
                Record Disposition
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">{selectedAlert.type}</span>
                <SeverityChip severity={selectedAlert.severity} />
              </div>
              <p className="text-slate-600 text-[11px]">{selectedAlert.message}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-[11px] uppercase tracking-wide mb-1">
                Resolution Disposition:
              </label>
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white font-medium focus:ring-1 focus:ring-blue-600"
              >
                <option value="ACKNOWLEDGED">ACKNOWLEDGED — Signal noted, review in progress</option>
                <option value="RESOLVED">RESOLVED — Reconciled with authoritative evidence</option>
                <option value="FALSE_POSITIVE">FALSE_POSITIVE — Document scanner tolerance confirmed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-[11px] uppercase tracking-wide mb-1">
                Officer Rationale (Mandatory for Audit Trail):
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State the regulatory basis or evidence reference..."
                className="w-full border border-slate-300 rounded p-2.5 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              {reasonError && (
                <p className="text-rose-700 font-semibold text-[11px] mt-1">{reasonError}</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
