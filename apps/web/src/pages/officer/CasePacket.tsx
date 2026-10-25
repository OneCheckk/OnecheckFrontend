import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useApplication,
  useFindings,
  useClaims,
  useLedger,
  useValidity,
  useAlerts,
  useAuditEvents,
  useDispositionFinding,
  useRecordDecision,
} from '../../api/queries';
import { FindingList } from '../../components/case/FindingList';
import { FindingDetail } from '../../components/case/FindingDetail';
import { EvidenceViewer } from '../../components/evidence/EvidenceViewer';
import { EvidenceCompare, RecordEvidenceCard } from '../../components/evidence/EvidenceCompare';
import { LedgerPanel } from '../../components/data/LedgerPanel';
import { ValidityTimeline } from '../../components/data/ValidityTimeline';
import { ClaimTable } from '../../components/data/ClaimTable';
import { StatusBadge, BandChip, DemoBanner } from '../../components/status';
import { Button, Modal, ErrorState, Skeleton } from '../../components/ui';
import type { Finding, FindingEvidence } from '@contracts';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react';

export const OfficerCasePacketPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: application, isLoading: appLoading, isError: appError } = useApplication(id);
  const { data: findings = [], isLoading: findLoading } = useFindings(id);
  const { data: claims = [] } = useClaims(id);
  const { data: ledger = [] } = useLedger(id);
  const { data: validity = [] } = useValidity(id);
  const { data: alerts = [] } = useAlerts();
  const { data: audit = [] } = useAuditEvents();

  const dispositionMutation = useDispositionFinding(id);
  const decisionMutation = useRecordDecision(id);

  // Active Finding & Selected Evidence
  const [selectedFinding, setSelectedFinding] = useState<Finding | undefined>(undefined);
  const [selectedEvidence, setSelectedEvidence] = useState<FindingEvidence | null>(null);

  // Bottom Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'ledger' | 'validity' | 'claims' | 'alerts' | 'audit'>('ledger');

  // Record Outcome Modal State
  const [showOutcomeModal, setShowOutcomeModal] = useState<boolean>(false);
  const [selectedOutcome, setSelectedOutcome] = useState<'APPROVED' | 'REJECTED' | 'RECOMMEND_ADVERSE_ACTION'>('APPROVED');
  const [outcomeReason, setOutcomeReason] = useState<string>('');
  const [outcomeError, setOutcomeError] = useState<string | null>(null);

  // Compare mode toggle
  const [isCompareView, setIsCompareView] = useState<boolean>(false);

  // Initialize selected finding
  useEffect(() => {
    if (findings.length > 0 && !selectedFinding) {
      setSelectedFinding(findings[0]);
      if (findings[0].proof.evidence.length > 0) {
        setSelectedEvidence(findings[0].proof.evidence[0]);
      }
    }
  }, [findings, selectedFinding]);

  if (appLoading || findLoading) {
    return (
      <div className="max-w-full p-6 space-y-4">
        <Skeleton className="h-14 w-full" />
        <div className="grid grid-cols-12 gap-4 h-[750px]">
          <Skeleton className="col-span-3 h-full" />
          <Skeleton className="col-span-6 h-full" />
          <Skeleton className="col-span-3 h-full" />
        </div>
      </div>
    );
  }

  if (appError || !application) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ErrorState message="Could not find regulatory case packet for official scrutiny." />
      </div>
    );
  }

  const handleSelectFinding = (finding: Finding) => {
    setSelectedFinding(finding);
    if (finding.proof.evidence.length > 0) {
      setSelectedEvidence(finding.proof.evidence[0]);
    }
  };

  const handleSelectEvidence = (ev: FindingEvidence) => {
    setSelectedEvidence(ev);
  };

  const handleDisposition = async (state: string, reason?: string) => {
    if (!selectedFinding) return;
    await dispositionMutation.mutateAsync({
      findingId: selectedFinding.findingId,
      state,
      reason,
    });
  };

  const handleRecordOutcome = async () => {
    // Check if adverse action requires dispositioning all high/critical findings
    if (selectedOutcome === 'RECOMMEND_ADVERSE_ACTION') {
      const openSevere = findings.filter(
        (f) => (f.severity === 'HIGH' || f.severity === 'CRITICAL') && f.state === 'OPEN'
      );
      if (openSevere.length > 0) {
        setOutcomeError(
          `Regulatory Block: Adverse action cannot be recommended until all HIGH and CRITICAL findings have recorded officer dispositions (${openSevere.length} open remaining).`
        );
        return;
      }
      if (!outcomeReason || outcomeReason.trim().length < 10) {
        setOutcomeError('Adverse action recommendation requires a mandatory statutory rationale (min 10 characters).');
        return;
      }
    }

    try {
      setOutcomeError(null);
      await decisionMutation.mutateAsync({
        outcome: selectedOutcome,
        reason: outcomeReason,
      });
      setShowOutcomeModal(false);
    } catch (err: any) {
      setOutcomeError(err?.response?.data?.error?.message || 'Failed to record decision');
    }
  };

  // Check if finding has two evidence sources for side-by-side compare
  const hasMultipleSources = selectedFinding && selectedFinding.proof.evidence.length >= 2;

  return (
    <div
      data-testid="case-packet-screen"
      className="flex flex-col flex-1 h-[calc(100vh-6rem)] bg-slate-100 overflow-hidden"
    >
      <DemoBanner />

      {/* Case Header */}
      <div className="bg-white border-b border-slate-300 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
        <div className="flex items-center gap-4">
          <Link
            to="/review"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
            title="Return to Queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 font-mono">
                {application.applicationNumber}
              </h1>
              <span className="text-xs bg-slate-100 border px-1.5 py-0.2 rounded font-medium text-slate-700">
                {application.category.replace(/_/g, ' ')}
              </span>
              {application.band && <BandChip band={application.band} />}
              <span className="text-xs bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded font-semibold">
                {application.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{application.institutionName}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/review/${application.id}/letters`)}
            className="text-xs bg-white text-slate-800"
          >
            <FileText className="w-3.5 h-3.5 mr-1 text-blue-700" />
            Deficiency Letters
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Referral dispatched to Regional Inspection Directorate.')}
            className="text-xs bg-white text-slate-800"
          >
            Refer for Inspection
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowOutcomeModal(true)}
            className="text-xs font-bold bg-[#005ea2]"
          >
            Record Outcome...
          </Button>
        </div>
      </div>

      {/* Main Three-Pane Layout */}
      <div className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* Left Pane: Findings List (Col 3) */}
        <div className="col-span-3 h-full overflow-hidden">
          <FindingList
            findings={findings}
            selectedFindingId={selectedFinding?.findingId}
            onSelectFinding={handleSelectFinding}
          />
        </div>

        {/* Centre Pane: Evidence Viewer & Compare (Col 6) */}
        <div className="col-span-6 h-full flex flex-col overflow-hidden bg-white border border-slate-300 rounded-lg">
          {/* Subheader Toggle for Evidence Mode */}
          {hasMultipleSources && (
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Evidence View:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsCompareView(false)}
                  className={`px-2 py-0.5 rounded font-medium border ${
                    !isCompareView
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Document Viewer
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompareView(true)}
                  className={`px-2 py-0.5 rounded font-medium border ${
                    isCompareView
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Side-by-Side Compare
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {isCompareView && hasMultipleSources ? (
              <div className="p-4 h-full overflow-y-auto space-y-4">
                <EvidenceCompare
                  evidenceA={selectedFinding!.proof.evidence[0]}
                  evidenceB={selectedFinding!.proof.evidence[1]}
                />
                <RecordEvidenceCard
                  label="Sanctioned Land Title Sanction (Nodal Record)"
                  value="Survey #48/2A • 640 sq m"
                  sourceLabel="DEMO ADAPTER - simulated source"
                  timestamp="2026-10-24T08:00:00Z"
                  isDemo={true}
                />
              </div>
            ) : (
              <EvidenceViewer
                selectedEvidence={selectedEvidence}
                evidenceList={selectedFinding?.proof.evidence || []}
                onSelectEvidence={handleSelectEvidence}
              />
            )}
          </div>
        </div>

        {/* Right Pane: Finding Detail & Disposition (Col 3) */}
        <div className="col-span-3 h-full overflow-hidden">
          <FindingDetail
            finding={selectedFinding}
            onSelectEvidence={handleSelectEvidence}
            onDisposition={handleDisposition}
            onRequestClarification={() => navigate(`/review/${application.id}/letters`)}
          />
        </div>
      </div>

      {/* Bottom Drawer (Ledger, Validity, Claims, Alerts, Audit) */}
      <div
        data-testid="bottom-drawer"
        className={`bg-white border-t-2 border-slate-400 transition-all duration-200 z-30 shrink-0 flex flex-col ${
          isDrawerOpen ? 'h-72' : 'h-10'
        }`}
      >
        {/* Drawer Header / Tabs */}
        <div className="h-10 px-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => {
                setDrawerTab('ledger');
                setIsDrawerOpen(true);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                isDrawerOpen && drawerTab === 'ledger'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ledger ({ledger.length})
            </button>

            <button
              onClick={() => {
                setDrawerTab('validity');
                setIsDrawerOpen(true);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                isDrawerOpen && drawerTab === 'validity'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Validity ({validity.length})
            </button>

            <button
              onClick={() => {
                setDrawerTab('claims');
                setIsDrawerOpen(true);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                isDrawerOpen && drawerTab === 'claims'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Claims ({claims.length})
            </button>

            <button
              onClick={() => {
                setDrawerTab('alerts');
                setIsDrawerOpen(true);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                isDrawerOpen && drawerTab === 'alerts'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alerts ({alerts.length})
            </button>

            <button
              onClick={() => {
                setDrawerTab('audit');
                setIsDrawerOpen(true);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                isDrawerOpen && drawerTab === 'audit'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit ({audit.length})
            </button>
          </div>

          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-1 text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-semibold"
          >
            <span>{isDrawerOpen ? 'Collapse Drawer' : 'Expand Drawer'}</span>
            {isDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Drawer Body */}
        {isDrawerOpen && (
          <div className="flex-1 p-4 overflow-y-auto text-xs bg-slate-50/50">
            {drawerTab === 'ledger' && <LedgerPanel entries={ledger} />}
            {drawerTab === 'validity' && (
              <ValidityTimeline applicationId={application.id} records={validity} />
            )}
            {drawerTab === 'claims' && <ClaimTable claims={claims} />}
            {drawerTab === 'alerts' && (
              <div className="space-y-2">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 bg-white border border-slate-300 rounded flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{alt.type}</span>
                      <p className="text-slate-600 text-xs mt-0.5">{alt.message}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{alt.raisedAt}</span>
                  </div>
                ))}
              </div>
            )}
            {drawerTab === 'audit' && (
              <div className="space-y-2 font-mono text-[11px]">
                {audit.map((ev) => (
                  <div
                    key={ev.seq}
                    className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between"
                  >
                    <span>
                      #{ev.seq} • {ev.action} • {ev.actor.name} ({ev.actor.role})
                    </span>
                    <span className="text-slate-400">Hash: {ev.hash.substring(0, 16)}...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Outcome Dialog */}
      <Modal
        isOpen={showOutcomeModal}
        onClose={() => {
          setShowOutcomeModal(false);
          setOutcomeError(null);
        }}
        title="Record Statutory Regulatory Decision"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowOutcomeModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRecordOutcome}
              className="bg-[#005ea2] font-bold"
            >
              Confirm Official Determination
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Determination Outcome:</label>
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value as any)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-600"
            >
              <option value="APPROVED">APPROVED — Grant statutory AICTE Approval</option>
              <option value="RECOMMEND_ADVERSE_ACTION">
                RECOMMEND ADVERSE ACTION — Deficiency Hearing / Rejection
              </option>
              <option value="REJECTED">REJECTED — Application Denied</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Official Regulatory Rationale / Scrutiny Minutes:
            </label>
            <textarea
              rows={4}
              value={outcomeReason}
              onChange={(e) => setOutcomeReason(e.target.value)}
              placeholder="State the regulatory grounds, approval clause satisfaction, or adverse action citations..."
              className="w-full border border-slate-300 rounded p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {outcomeError && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-800 text-xs flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
              <span>{outcomeError}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
