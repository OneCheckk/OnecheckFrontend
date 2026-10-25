import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInstitutions, useApplications, useAlerts } from '../../api/queries';
import { PageHeader, Skeleton, ErrorState } from '../../components/ui';
import {
  Building2,
  Activity,
  ShieldCheck,
  Server,
  Database,
  MapPin,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const AdminInstitutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: institutions = [], isLoading, isError, error, refetch } = useInstitutions();
  const { data: applications = [] } = useApplications();
  const { data: alerts = [] } = useAlerts();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        <ErrorState
          message={(error as any)?.message || 'Failed to load registered institutions directory.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6 text-xs">
      <PageHeader
        title="Institutions Directory & System Health"
        description="Comprehensive directory of participating technical education institutions, physical campus coordinates, and verification infrastructure health."
        breadcrumbs={[{ label: 'System Administration' }, { label: 'Institutions & Health' }]}
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-semibold text-xs">Registered Colleges</span>
            <Building2 className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {institutions.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Approved state-affiliated institutions</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-semibold text-xs">Total Applications</span>
            <FileText className="w-4 h-4 text-indigo-700" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {applications.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Active filings across all categories</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-semibold text-xs">Compliance Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-700 font-mono">
            {alerts.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Forensic signals requiring review</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-semibold text-xs">Infrastructure Health</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700 font-mono">
            100%
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">All verification engines online</p>
        </div>
      </div>

      {/* Institutions Directory Table */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
        <div className="h-[2px] w-full flex" aria-hidden="true">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Registered Institutions Directory</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Official institutional records participating in the 2025-26 regulatory scrutiny cycle
            </p>
          </div>
          <span className="bg-white border border-slate-300 px-2.5 py-1 rounded font-mono text-xs font-semibold text-slate-700">
            {institutions.length} Institutions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Registration ID</th>
                <th className="py-3 px-4">Location & State</th>
                <th className="py-3 px-4">Campus Coordinates</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {institutions.map((inst) => {
                const instApps = applications.filter((a) => a.institutionId === inst.id);
                return (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{inst.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">ID: {inst.id}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {inst.registrationId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{inst.address}</div>
                      <div className="text-slate-500 font-semibold">{inst.state}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {inst.latitude.toFixed(4)}°N, {inst.longitude.toFixed(4)}°E
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          inst.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{inst.verificationStatus}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate('/review')}
                        className="text-[#005ea2] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <span>{instApps.length} Cases</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Health & Infrastructure Telemetry */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-2xs space-y-4">
        <div>
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-700" />
            <span>Verification Pipeline & Adapter Health</span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time status of multi-modal forensic engines, nodal databases, and statutory adapters
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">FastAPI Forensics Pipeline</span>
              <p className="text-slate-600 text-[11px]">
                PDF byte-stream parsing, Error Level Analysis (ELA) and 64-bit pHash photo matching.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
              OPERATIONAL
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">AICTE Central Database Sync</span>
              <p className="text-slate-600 text-[11px]">
                Historical seat matrices, sanctioned intakes, and approved architectural floor areas.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
              SYNCHRONIZED
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">State Land Revenue Registry</span>
              <p className="text-slate-600 text-[11px]">
                Land deed title verification adapter. Automatically reroutes to scrutiny officer when offline.
              </p>
            </div>
            <span className="bg-slate-200 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
              OFFLINE (ROUTED)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">DPDP-Compliant HMAC Anonymizer</span>
              <p className="text-slate-600 text-[11px]">
                Salted SHA-256 identifier hashing pipeline for privacy-safe multi-college faculty matching.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
