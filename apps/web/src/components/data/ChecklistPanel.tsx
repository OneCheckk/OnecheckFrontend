import React, { useState } from 'react';
import { StateChip, PlaceholderTag } from '../status';
import { Button } from '../ui';
import type { ChecklistItem } from '@contracts';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Edit3,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface ChecklistPanelProps {
  items: ChecklistItem[];
  onUploadFile: (itemId: string, file: File, docTypeHint: string) => Promise<void>;
  onReplaceFile?: (itemId: string, file: File) => Promise<void>;
  onDeleteVersion?: (itemId: string) => Promise<void>;
}

export const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  items,
  onUploadFile,
  onReplaceFile,
  onDeleteVersion,
}) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [editingTypeItemId, setEditingTypeItemId] = useState<string | null>(null);

  const handleFileDrop = async (itemId: string, file: File, docType: string) => {
    // Validate MIME type & file size (e.g. max 15MB, PDF only)
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Invalid file type: Regulatory scrutiny requires standard PDF format.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds statutory size limit of 15 MB.');
      return;
    }

    setUploadError(null);
    setUploadingItemId(itemId);
    try {
      await onUploadFile(itemId, file, docType);
    } catch (err: any) {
      setUploadError(err?.response?.data?.error?.message || 'Server rejected document upload.');
    } finally {
      setUploadingItemId(null);
    }
  };

  return (
    <div data-testid="checklist-panel" className="space-y-4">
      {uploadError && (
        <div
          role="alert"
          className="p-3 bg-rose-50 border border-rose-300 rounded text-xs text-rose-800 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" />
          <span>{uploadError}</span>
        </div>
      )}

      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Statutory Documentation Checklist & Digital Verification
            </h3>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Upload authenticated PDF documents for automated verification against AICTE Approval Process norms.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-1 border rounded">
            {items.filter((i) => i.state === 'DONE').length} / {items.length} Completed
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {items.map((item) => {
            const isUploading = uploadingItemId === item.id;
            const isDone = item.state === 'DONE';

            return (
              <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{item.label}</span>
                      {item.required && (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Required
                        </span>
                      )}
                      <StateChip state={item.state} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        Clause: <strong className="font-mono text-slate-700">{item.clauseRef}</strong>
                      </span>
                      {item.docType && (
                        <span>
                          Expected Type:{' '}
                          <span className="font-mono bg-slate-100 px-1 rounded">{item.docType}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & File Upload */}
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{item.fileName || 'Document Stored'}</span>
                        </span>

                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileDrop(item.id, f, item.docType);
                            }}
                          />
                          <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700">
                            Replace
                          </span>
                        </label>

                        {onDeleteVersion && (
                          <button
                            type="button"
                            onClick={() => onDeleteVersion(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete document version"
                            aria-label="Delete document version"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileDrop(item.id, f, item.docType);
                          }}
                        />
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#005ea2] hover:bg-blue-800 text-white rounded shadow-2xs">
                          {isUploading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5" />
                          )}
                          <span>Upload PDF</span>
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {item.placeholder && (
                  <div className="mt-1">
                    <PlaceholderTag />
                  </div>
                )}

                {/* Per-file extraction progress from SSE */}
                {item.state === 'EXTRACTING' && (
                  <div className="mt-2 bg-purple-50 border border-purple-200 p-2 rounded text-xs">
                    <div className="flex items-center justify-between text-purple-900 font-medium mb-1">
                      <span>Extracting OCR text & table structures...</span>
                      <span>{item.processingProgress || 65}%</span>
                    </div>
                    <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-700 h-full transition-all"
                        style={{ width: `${item.processingProgress || 65}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
