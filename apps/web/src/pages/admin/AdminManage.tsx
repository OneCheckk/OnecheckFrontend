import React from 'react';

export const AdminChecklistsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Checklists Configuration</h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Configure mandatory statutory document categories and checklist templates per approval type.
        </p>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
              <th className="py-3 px-4">Category Code</th>
              <th className="py-3 px-4">Display Name</th>
              <th className="py-3 px-4">Mandatory Documents</th>
              <th className="py-3 px-4">Active Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-mono font-bold text-slate-900">ENGINEERING_UNDERGRADUATE</td>
              <td className="py-3 px-4 font-medium">Engineering & Technology (Undergraduate / B.Tech)</td>
              <td className="py-3 px-4 font-mono">4 Requirements</td>
              <td className="py-3 px-4 font-mono text-emerald-700 font-bold">v2026.1</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-mono font-bold text-slate-900">MANAGEMENT_POSTGRADUATE</td>
              <td className="py-3 px-4 font-medium">Management Studies (Postgraduate / MBA)</td>
              <td className="py-3 px-4 font-mono">2 Requirements</td>
              <td className="py-3 px-4 font-mono text-emerald-700 font-bold">v2026.1</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-mono font-bold text-slate-900">PHARMACY_DIPLOMA</td>
              <td className="py-3 px-4 font-medium">Pharmacy & Medical Sciences (Diploma / B.Pharm)</td>
              <td className="py-3 px-4 font-mono">3 Requirements</td>
              <td className="py-3 px-4 font-mono text-emerald-700 font-bold">v2026.1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminUsersPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">User Administration</h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Manage regulatory credentials and role assignments across statutory partitions.
        </p>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
              <th className="py-3 px-4">Official Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Authorized Role</th>
              <th className="py-3 px-4">Access Partition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-bold text-slate-900">Shri V. S. Rao</td>
              <td className="py-3 px-4 font-mono text-slate-600">officer.rao@aicte.gov.in</td>
              <td className="py-3 px-4 font-mono font-bold text-blue-900">SCRUTINY_OFFICER</td>
              <td className="py-3 px-4">Northern Regional Office</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-bold text-slate-900">Dr. Sunita Deshmukh</td>
              <td className="py-3 px-4 font-mono text-slate-600">director.deshmukh@aicte.gov.in</td>
              <td className="py-3 px-4 font-mono font-bold text-indigo-900">REGIONAL_DIRECTOR</td>
              <td className="py-3 px-4">Western Regional Directorate</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-bold text-slate-900">Statutory Compliance Auditor</td>
              <td className="py-3 px-4 font-mono text-slate-600">auditor@cag.gov.in</td>
              <td className="py-3 px-4 font-mono font-bold text-slate-800">AUDITOR</td>
              <td className="py-3 px-4">CAG Statutory Oversight</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 px-4 font-bold text-slate-900">AICTE Central System Admin</td>
              <td className="py-3 px-4 font-mono text-slate-600">admin@aicte.gov.in</td>
              <td className="py-3 px-4 font-mono font-bold text-slate-900">ADMIN</td>
              <td className="py-3 px-4">National Head Office</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
