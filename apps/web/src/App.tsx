import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthProvider';
import { AppRoutes } from './routes';
import { apiEvents } from './api/client';
import { Modal, Button } from './components/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const [toast, setToast] = useState<{ code: string; message: string } | null>(null);
  const [conflictModalOpen, setConflictModalOpen] = useState<boolean>(false);

  // Global listeners for axios interceptors
  useEffect(() => {
    const unsubToast = apiEvents.on('TOAST_ERROR', (payload) => {
      setToast(payload);
      setTimeout(() => setToast(null), 5000);
    });

    const unsubConflict = apiEvents.on('409_CONFLICT', () => {
      setConflictModalOpen(true);
    });

    return () => {
      unsubToast();
      unsubConflict();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {/* Global Toast Message */}
          {toast && (
            <div
              role="alert"
              className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-200 max-w-md"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-rose-400 block font-mono text-[10px]">
                  {toast.code}
                </span>
                <span className="text-slate-200">{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-white text-xs ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* 409 Conflict Dialog: "This item changed, reload?" */}
          <Modal
            isOpen={conflictModalOpen}
            onClose={() => setConflictModalOpen(false)}
            title="Concurrency Conflict Detected"
            footer={
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setConflictModalOpen(false);
                  window.location.reload();
                }}
                className="bg-[#005ea2]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Reload Latest Version
              </Button>
            }
          >
            <p className="text-xs text-slate-700 leading-relaxed">
              This item changed, reload? Another user or background regulatory scrutiny job has updated this record.
            </p>
          </Modal>

          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
