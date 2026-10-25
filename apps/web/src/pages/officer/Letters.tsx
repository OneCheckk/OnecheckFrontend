import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplication, useFindings, useDeficiencyLetters, useSendDeficiencyLetter } from '../../api/queries';
import { Button, Modal, ErrorState, Skeleton } from '../../components/ui';
import { ArrowLeft, Send, FileText, CheckCircle, Mail, AlertCircle } from 'lucide-react';

export const DeficiencyLettersPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: application, isLoading: appLoading } = useApplication(id);
  const { data: findings = [], isLoading: findLoading } = useFindings(id);
  const { data: letters = [], isLoading: letLoading } = useDeficiencyLetters(id);
  const sendMutation = useSendDeficiencyLetter(id);

  const [selectedFindingIds, setSelectedFindingIds] = useState<string[]>([]);
  const [letterContent, setLetterContent] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Initialize selected finding ids
  React.useEffect(() => {
    if (findings.length > 0 && selectedFindingIds.length === 0) {
      const openIds = findings.filter((f) => f.state === 'OPEN').map((f) => f.findingId);
      setSelectedFindingIds(openIds);
      generateDraft(openIds);
    }
  }, [findings]);

  const generateDraft = (selectedIds: string[]) => {
    const selected = findings.filter((f) => selectedIds.includes(f.findingId));
    let text = `F.No. AICTE/NRO/SCRUTINY/${application?.applicationNumber || '2026'}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;
    text += `To,\nThe Principal / Director,\n${application?.institutionName || 'Applicant Institution'}\n\n`;
    text += `SUBJECT: STATUTORY DEFICIENCY NOTICE REGARDING APPROVAL PROCESS APPLICATION ${application?.applicationNumber || ''}\n\n`;
    text += `Sir/Madam,\n\n`;
    text += `During automated regulatory scrutiny and preliminary officer examination, the following compliance discrepancies were identified under the AICTE Approval Process Handbook (APH) regulations:\n\n`;

    selected.forEach((f, idx) => {
      text += `${idx + 1}. [${f.ruleId}] ${f.title}\n`;
      text += `   - Clause Reference: ${f.clauseRef}\n`;
      text += `   - Discrepancy Note: ${f.message}\n`;
      text += `   - Required Rectification: Submit authenticated documentary clarification or corrected schedule.\n\n`;
    });

    text += `You are hereby directed to submit your clarified documentary evidence through the OneCheck institutional portal within seven (7) calendar days from dispatch.\n\n`;
    text += `Yours faithfully,\nScrutiny Officer\nAICTE Nodal Directorate`;

    setLetterContent(text);
  };

  const handleToggleFinding = (fId: string) => {
    const next = selectedFindingIds.includes(fId)
      ? selectedFindingIds.filter((x) => x !== fId)
      : [...selectedFindingIds, fId];
    setSelectedFindingIds(next);
    generateDraft(next);
  };

  const handleSend = async () => {
    try {
      await sendMutation.mutateAsync({
        findingIds: selectedFindingIds,
        content: letterContent,
      });
      setShowConfirmModal(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  if (appLoading || findLoading || letLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
      <Link
        to={`/review/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Case Packet</span>
      </Link>

      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-2xs">
        <div className="border-b border-slate-200 pb-4 mb-5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Draft Formal Deficiency Letter
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Application: <span className="font-mono font-bold">{application?.applicationNumber}</span> •{' '}
            {application?.institutionName}
          </p>
        </div>

        {sentSuccess && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>Deficiency letter successfully dispatched to the applicant institution.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Select Findings to Include (Col 4) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-800">
              Select Cited Findings ({selectedFindingIds.length} / {findings.length})
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {findings.map((f) => {
                const checked = selectedFindingIds.includes(f.findingId);
                return (
                  <label
                    key={f.findingId}
                    className={`block p-3 rounded border text-xs cursor-pointer transition-colors ${
                      checked ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleFinding(f.findingId)}
                        className="mt-0.5 accent-blue-600 rounded"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{f.title}</span>
                        <span className="font-mono text-[10px] text-slate-500">{f.ruleId}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Right: Editable Letter Preview (Col 8) */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                Official Letter Template Preview
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Handlebars Statutory Draft</span>
            </div>

            <textarea
              rows={14}
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded font-mono text-xs leading-relaxed text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowConfirmModal(true)}
                disabled={selectedFindingIds.length === 0}
                className="bg-[#005ea2] hover:bg-blue-800 font-bold"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Dispatch Statutory Notice...
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Previously Sent Letters List */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-2xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
          Sent Statutory Notices ({letters.length})
        </h3>

        {letters.length === 0 ? (
          <p className="text-slate-500 text-xs italic">No prior deficiency notices dispatched.</p>
        ) : (
          <div className="space-y-3">
            {letters.map((letItem) => (
              <div
                key={letItem.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-900 block">Notice #{letItem.id}</span>
                  <span className="text-slate-500">Recipient: {letItem.recipient}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-500 text-[11px]">
                    Dispatched: {new Date(letItem.createdAt).toLocaleString()}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold text-[10px]">
                    SENT
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal Before Dispatch */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Formal Statutory Notice Dispatch"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              isLoading={sendMutation.isPending}
              className="bg-[#005ea2] font-bold"
            >
              Sign & Dispatch Notice
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-700 leading-relaxed">
          Are you sure you want to officially issue this deficiency notice for{' '}
          <strong className="font-mono">{application?.applicationNumber}</strong>? This action is
          cryptographically appended to the immutable audit log and dispatches a formal institutional
          clarification notification.
        </p>
      </Modal>
    </div>
  );
};
