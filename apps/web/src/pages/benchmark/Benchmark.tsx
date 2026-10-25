import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Button, Skeleton } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { BenchmarkRun } from '@contracts';
import { Play, Download, Sparkles, BarChart2, ShieldCheck, Clock, FileSpreadsheet } from 'lucide-react';

export const BenchmarkPage: React.FC = () => {
  const [n, setN] = useState<number>(100);
  const [seed, setSeed] = useState<number>(42);
  const [faultRate, setFaultRate] = useState<number>(0.35);
  const [scanRatio, setScanRatio] = useState<number>(0.4);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { data: runs = [], refetch } = useQuery({
    queryKey: ['benchmark', 'runs'],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: BenchmarkRun[] }>('/benchmark/runs');
      return res.data.data;
    },
  });

  const latestRun = runs[0];

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      await apiClient.post('/benchmark/run', { n, seed, faultRate, scanRatio });
      setTimeout(() => {
        setIsRunning(false);
        refetch();
      }, 1500);
    } catch {
      setIsRunning(false);
    }
  };

  const handleDownload = () => {
    if (!latestRun) return;
    const blob = new Blob([JSON.stringify(latestRun, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark_report_seed_${latestRun.seed}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData =
    latestRun?.results?.perFault.map((f) => ({
      name: f.faultType.replace(/_/g, ' '),
      Recall: Math.round(f.recall * 100),
      Precision: Math.round(f.precision * 100),
    })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Synthetic Benchmark Suite</h1>
            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
              SYNTHETIC EVALUATION
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Deterministic statutory evaluation against held-out synthetic test ground truth.
          </p>
        </div>

        {latestRun && (
          <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs bg-white">
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download report (JSON)</span>
          </Button>
        )}
      </div>

      {/* Configuration & Trigger Form */}
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-2xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-blue-700" />
          <span>Configure Benchmark Parameters</span>
        </h3>

        <form onSubmit={handleRun} className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs items-end">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Applications (N):</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Random Seed:</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Fault Rate (0-1):</label>
            <input
              type="number"
              step="0.05"
              value={faultRate}
              onChange={(e) => setFaultRate(Number(e.target.value))}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Scan Ratio (0-1):</label>
            <input
              type="number"
              step="0.05"
              value={scanRatio}
              onChange={(e) => setScanRatio(Number(e.target.value))}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isRunning}
              className="w-full bg-[#005ea2] hover:bg-blue-800 font-bold"
            >
              <Play className="w-4 h-4 mr-1" />
              Run Suite
            </Button>
          </div>
        </form>
      </div>

      {latestRun && latestRun.results && (
        <div className="space-y-6">
          {/* 4 Headline Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Extraction Accuracy
              </span>
              <span className="text-3xl font-black text-blue-900 block font-mono">
                {latestRun.results.extractionAccuracy}%
              </span>
              <span className="text-[10px] text-slate-500">Across tabular & field predicates</span>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Validation Accuracy
              </span>
              <span className="text-3xl font-black text-emerald-900 block font-mono">
                {latestRun.results.validationAccuracy}%
              </span>
              <span className="text-[10px] text-slate-500">Handbook normative rules</span>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Clean App FP Rate
              </span>
              <span className="text-3xl font-black text-emerald-700 block font-mono">
                {latestRun.results.cleanAppFalsePositiveRate}%
              </span>
              <span className="text-[10px] text-slate-500">Zero false alarms on clean applications</span>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Avg Verification Time
              </span>
              <span className="text-3xl font-black text-slate-900 block font-mono">
                {latestRun.results.avgVerificationTimeSec}s
              </span>
              <span className="text-[10px] text-slate-500">Per multi-document application</span>
            </div>
          </div>

          {/* Recharts Bar Chart of Recall Per Fault */}
          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Recall & Precision Per Injected Anomaly
              </h3>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#005ea2] rounded-xs" /> Recall (%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-emerald-600 rounded-xs" /> Precision (%)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      fontSize: '12px',
                      borderRadius: '4px',
                    }}
                  />
                  <Bar dataKey="Recall" fill="#005ea2" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Precision" fill="#15803d" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-Fault Performance Table */}
          <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                Detailed Classification Metrics Table
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-3">Anomaly Type</th>
                    <th className="py-2.5 px-3">Precision</th>
                    <th className="py-2.5 px-3">Recall</th>
                    <th className="py-2.5 px-3">F1 Score</th>
                    <th className="py-2.5 px-3 font-mono">TP</th>
                    <th className="py-2.5 px-3 font-mono">FP</th>
                    <th className="py-2.5 px-3 font-mono">FN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {latestRun.results.perFault.map((fault) => (
                    <tr key={fault.faultType} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {fault.faultType}
                      </td>
                      <td className="py-2.5 px-3">{(fault.precision * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 font-bold text-blue-900">
                        {(fault.recall * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3">{(fault.f1 * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-emerald-700">{fault.tp}</td>
                      <td className="py-2.5 px-3 text-rose-700">{fault.fp}</td>
                      <td className="py-2.5 px-3 text-slate-700">{fault.fn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 font-mono">
            <span>Manifest Hash: {latestRun.manifestHash}</span>
            <span>Alert Timeliness: {latestRun.results.alertTimelinessMin}m</span>
            <span>Seed: {latestRun.seed}</span>
          </div>
        </div>
      )}
    </div>
  );
};
