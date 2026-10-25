import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { Button } from '../ui';
import { Sliders, X, AlertTriangle, ShieldAlert, BarChart3, RefreshCw } from 'lucide-react';

interface DemoControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoControlsDrawer: React.FC<DemoControlsDrawerProps> = ({ isOpen, onClose }) => {
  const [offsetDays, setOffsetDays] = useState<number>(0);
  const [forceUnavailable, setForceUnavailable] = useState<boolean>(false);
  const [tamperStatus, setTamperStatus] = useState<string | null>(null);
  const [isTampering, setIsTampering] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      apiClient.get('/demo/settings').then((res) => {
        if (res.data?.data) {
          setOffsetDays(res.data.data.decisionDateOffsetDays || 0);
          setForceUnavailable(!!res.data.data.forceSourceUnavailable);
        }
      });
    }
  }, [isOpen]);

  const updateSettings = async (newOffset: number, newForce: boolean) => {
    try {
      await apiClient.put('/demo/settings', {
        decisionDateOffsetDays: newOffset,
        forceSourceUnavailable: newForce,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTamperAudit = async () => {
    setIsTampering(true);
    setTamperStatus(null);
    try {
      await apiClient.post('/demo/tamper-audit');
      const verifyRes = await apiClient.get('/audit/verify');
      const data = verifyRes.data.data;
      if (!data.intact) {
        setTamperStatus(`Tamper successful! Chain broken at event #${data.brokenAtSeq}`);
      } else {
        setTamperStatus('Event altered in payload.');
      }
    } catch (err: any) {
      setTamperStatus('Tamper simulation error.');
    } finally {
      setIsTampering(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-300 flex flex-col justify-between p-5 text-xs animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-sm text-slate-900">Demo Simulation Controls</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Decision Date Slider */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-800">Decision Date Offset:</label>
                <span className="font-mono bg-white px-2 py-0.5 border rounded font-bold text-blue-700">
                  +{offsetDays} Days
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={offsetDays}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setOffsetDays(val);
                  updateSettings(val, forceUnavailable);
                }}
                className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Shifts decision date to trigger document expiration and validity states in place.
              </p>
            </div>

            {/* Force Source Unavailable Toggle */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 block">Force Source Unavailable</label>
                <p className="text-[10px] text-slate-500">Simulate external municipal gateway outage</p>
              </div>
              <input
                type="checkbox"
                checked={forceUnavailable}
                onChange={(e) => {
                  setForceUnavailable(e.target.checked);
                  updateSettings(offsetDays, e.target.checked);
                }}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Quick Link to Benchmark */}
            <div className="pt-2">
              <Link
                to="/benchmark"
                onClick={onClose}
                className="w-full py-2 px-3 border border-slate-300 rounded flex items-center justify-between text-slate-800 hover:bg-slate-50 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-700" />
                  <span>Run Benchmark Suite</span>
                </div>
                <span>→</span>
              </Link>
            </div>

            {/* Dev Tamper Audit Event Button */}
            <div className="p-3 border border-rose-200 bg-rose-50/60 rounded space-y-2">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                Dev: Tamper Audit Event
              </span>
              <p className="text-[11px] text-slate-600">
                Mutates event payload #2 in memory to verify SHA-256 cryptographic chain detection.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={handleTamperAudit}
                isLoading={isTampering}
                className="w-full text-xs"
              >
                Tamper Audit Event #2
              </Button>

              {tamperStatus && (
                <div className="p-2 bg-white border border-rose-300 text-rose-800 text-[11px] font-mono rounded">
                  {tamperStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 text-slate-500 text-[11px]">
          Demo settings persist in in-memory session.
        </div>
      </div>
    </div>
  );
};
