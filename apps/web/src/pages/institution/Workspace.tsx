import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useApplication,
  useApplicationChecklist,
  useClaims,
  useFindings,
  useDeficiencyLetters,
  useRunSelfCheck,
  useCorrectClaim,
  useConfirmClaim,
  useUploadDocument,
  useSubmitApplication,
} from '../../api/queries';
import { ChecklistPanel } from '../../components/data/ChecklistPanel';
import { ClaimTable } from '../../components/data/ClaimTable';
import { TrianglePanel } from '../../components/case/TrianglePanel';
import { StatusBadge, BandChip, PlaceholderTag, DemoBanner } from '../../components/status';
import { Button, ErrorState, Skeleton } from '../../components/ui';
import type { Finding, ClaimRecheckResult } from '@contracts';
import {
  CheckSquare,
  FileSpreadsheet,
  Cpu,
  Mail,
  History,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Send,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const InstitutionWorkspacePage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'checklist' | 'extracted' | 'selfcheck' | 'messages' | 'history'>('checklist');
  const [recheckToast, setRecheckToast] = useState<string | null>(null);

  const { data: application, isLoading: appLoading, isError: appError } = useApplication(id);
  const { data: checklist = [] } = useApplicationChecklist(id);
  const { data: claims = [] } = useClaims(id);
  const { data: findings = [] } = useFindings(id);
  const { data: letters = [] } = useDeficiencyLetters(id);

  const runSelfCheckMutation = useRunSelfCheck(id);
  const correctClaimMutation = useCorrectClaim(id);
  const confirmClaimMutation = useConfirmClaim(id);
  const uploadDocMutation = useUploadDocument(id);
  const submitAppMutation = useSubmitApplication(id);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmitApplication = async () => {
    if (!canSubmit) return;
    setSubmitError(null);
    try {
      await submitAppMutation.mutateAsync();
      setSubmitSuccess('Application submitted successfully for official regulatory scrutiny.');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to submit application.';
      setSubmitError(msg);
    }
  };

  if (appLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (appError || !application) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ErrorState message="Could not locate statutory application filing workspace." />
      </div>
    );
  }

  const missingRequired = checklist.filter((i) => i.required && i.state !== 'DONE');
  const canSubmit = missingRequired.length === 0;

  const handleSelfCheck = async () => {
    await runSelfCheckMutation.mutateAsync();
  };

  const handleEditClaim = async (claimId: string, val: string | number, reason: string): Promise<ClaimRecheckResult> => {
    return await correctClaimMutation.mutateAsync({ claimId, value: val, reason });
  };

  const handleConfirmClaim = async (claimId: string) => {
    await confirmClaimMutation.mutateAsync({ claimId });
  };

  const showRecheckToast = (res: ClaimRecheckResult) => {
    setRecheckToast(`Re-checked ${res.rulesRerun} of ${res.rulesTotal} rules; ${res.closed} resolved, ${res.opened} new.`);
    setTimeout(() => setRecheckToast(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-5">
      {/* Synthetic Demo Banner if applicable */}
      <DemoBanner />

      {/* Back Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/portal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
        <span className="font-mono text-xs text-slate-500">ID: {application.id}</span>
      </div>

      {/* Application Workspace Header Card */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {application.applicationNumber}
              </h1>
              <span className="text-xs bg-slate-100 border px-2 py-0.5 rounded font-medium text-slate-700">
                {application.category.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">{application.institutionName}</p>
          </div>

          <div className="flex items-center gap-3">
            {application.band && <BandChip band={application.band} />}
            <span className="text-xs bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded font-semibold">
              {application.status}
            </span>

            {/* Submit Application Button with Disabled Tooltip */}
            <div className="relative group">
              <Button
                variant="primary"
                disabled={!canSubmit || submitAppMutation.isPending}
                isLoading={submitAppMutation.isPending}
                onClick={handleSubmitApplication}
                className="bg-[#005ea2] hover:bg-blue-800 font-bold"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {application.status === 'DRAFT' ? 'Submit Application' : 'Resubmit Filing'}
              </Button>

              {!canSubmit && (
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-72 bg-slate-900 text-white text-[11px] rounded p-2.5 shadow-lg z-50">
                  <p className="font-bold text-amber-400 mb-1">Cannot Submit Filing:</p>
                  <p>Missing required checklist items:</p>
                  <ul className="list-disc list-inside mt-1 text-slate-300">
                    {missingRequired.map((i) => (
                      <li key={i.id} className="truncate">
                        {i.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess(null)} className="text-emerald-500 hover:text-emerald-800 text-xs">✕</button>
        </div>
      )}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError(null)} className="text-red-500 hover:text-red-800 text-xs">✕</button>
        </div>
      )}

      {/* Toast constructed from API response */}
      {recheckToast && (
        <div
          role="status"
          className="p-3 bg-blue-50 border border-blue-300 text-blue-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
            <span>{recheckToast}</span>
          </div>
          <button onClick={() => setRecheckToast(null)} className="text-blue-500 hover:text-blue-800 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* 5 Mandatory Workspace Tabs */}
      <div className="border-b border-slate-300 flex items-center gap-1 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'checklist'
              ? 'border-blue-700 text-blue-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tab 1: Checklist & Uploads</span>
        </button>

        <button
          onClick={() => setActiveTab('extracted')}
          className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'extracted'
              ? 'border-blue-700 text-blue-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Tab 2: Extracted Data ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('selfcheck')}
          className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'selfcheck'
              ? 'border-blue-700 text-blue-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Tab 3: Self-Check ({findings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-blue-700 text-blue-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Tab 4: Deficiency Messages ({letters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-700 text-blue-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Tab 5: History</span>
        </button>
      </div>

      {/* Tab 1: Checklist and Uploads */}
      {activeTab === 'checklist' && (
        <ChecklistPanel
          items={checklist}
          onUploadFile={async (itemId, file, docTypeHint) => {
            try {
              await uploadDocMutation.mutateAsync({ file, docTypeHint, checklistItemId: itemId });
              setRecheckToast(`Successfully uploaded ${file.name}. Regulatory extraction queued.`);
              setTimeout(() => setRecheckToast(null), 5000);
            } catch (err: any) {
              const msg = err.response?.data?.error?.message || 'File upload failed. Please verify format & size.';
              setSubmitError(msg);
              setTimeout(() => setSubmitError(null), 6000);
            }
          }}
        />
      )}

      {/* Tab 2: Extracted Data */}
      {activeTab === 'extracted' && (
        <ClaimTable
          claims={claims}
          onEditClaim={handleEditClaim}
          onConfirmClaim={handleConfirmClaim}
          onShowRecheckToast={showRecheckToast}
        />
      )}

      {/* Tab 3: Self-Check */}
      {activeTab === 'selfcheck' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-300 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Statutory Pre-Submission Self-Check</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Evaluates your uploaded documents against all 194 handbook rules and indicates discrepancies in plain language.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleSelfCheck}
              isLoading={runSelfCheckMutation.isPending}
              className="bg-[#005ea2] hover:bg-blue-800 font-bold"
            >
              <Cpu className="w-4 h-4 mr-1.5" />
              Run Self-Check
            </Button>
          </div>

          <div className="space-y-3">
            {findings.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-300 rounded-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-900">All Automated Norms Satisfied</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Self-check detected no rule anomalies across the uploaded documents.
                </p>
              </div>
            ) : (
              findings.map((finding) => (
                <div
                  key={finding.findingId}
                  className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{finding.title}</span>
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {finding.ruleId}
                      </span>
                    </div>
                    <StatusBadge status={finding.status} size="sm" />
                  </div>

                  {/* Plain language explanation: what is wrong, where, what to provide */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Discrepancy:</span>
                      <p className="text-slate-800 mt-0.5 font-medium">{finding.message}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Identified In:</span>
                      <p className="text-slate-800 mt-0.5 font-mono">
                        {finding.proof.evidence.map((e) => e.label).join(' & ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Statutory Norm:</span>
                      <p className="text-slate-800 mt-0.5 font-mono">{finding.clauseRef}</p>
                    </div>
                  </div>

                  {finding.placeholder && (
                    <div className="pt-1">
                      <PlaceholderTag />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Triangle of Truth 3-Way Reconciliation Section */}
          <div className="bg-white border border-slate-300 rounded-lg p-5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Triangle of Truth: 3-Way Reconciler</span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Self-Audit
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Compare your institution&apos;s self-reported figures against extracted OCR metrics and authoritative AICTE regulatory records.
              </p>
            </div>
            <TrianglePanel applicationId={application.id} />
          </div>
        </div>
      )}

      {/* Tab 4: Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {letters.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-300 rounded-lg text-slate-600 text-xs">
              No formal deficiency letters have been issued by the scrutiny officer.
            </div>
          ) : (
            letters.map((letItem) => (
              <div
                key={letItem.id}
                className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-sm text-slate-900">
                    Deficiency Notice #{letItem.id}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    Sent: {new Date(letItem.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-4 font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-slate-800">
                  {letItem.content}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('checklist')}
                    className="text-xs"
                  >
                    Upload Corrected Documents (Tab 1)
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('extracted')}
                    className="text-xs bg-[#005ea2]"
                  >
                    Edit Extracted Values (Tab 2)
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-2xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
            Statutory Timeline of Filing Events & Document Uploads
          </h3>

          <div className="border-l-2 border-slate-300 ml-3 pl-5 space-y-6 text-xs">
            <div className="relative">
              <span className="absolute -left-6.5 top-0.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white ring-2 ring-blue-600" />
              <span className="font-mono text-[10px] text-slate-500 block">2026-10-24 07:15:00 UTC</span>
              <h5 className="font-bold text-slate-900">Affidavit Self-Disclosure Uploaded</h5>
              <p className="text-slate-600">Document D1 processed by extraction daemon.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-6.5 top-0.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white ring-2 ring-blue-600" />
              <span className="font-mono text-[10px] text-slate-500 block">2026-10-24 07:22:00 UTC</span>
              <h5 className="font-bold text-slate-900">Architectural Master Plan Uploaded</h5>
              <p className="text-slate-600">Document D2 verified for CAD stamp and floor schedules.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-6.5 top-0.5 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white ring-2 ring-emerald-600" />
              <span className="font-mono text-[10px] text-slate-500 block">2026-10-24 08:00:00 UTC</span>
              <h5 className="font-bold text-slate-900">Self-Check Pipeline Run</h5>
              <p className="text-slate-600">Reconciliation completed against AICTE Approval Handbook.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
