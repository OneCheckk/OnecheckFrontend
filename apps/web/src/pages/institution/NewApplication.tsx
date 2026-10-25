import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useCreateApplication } from '../../api/queries';
import { Button, ErrorState, Skeleton } from '../../components/ui';
import { Building2, CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';

export const NewApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, isError } = useCategories();
  const createMutation = useCreateApplication();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [instName, setInstName] = useState<string>('Apex Institute of Technology & Management');

  // Set default category when loaded
  React.useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      const created = await createMutation.mutateAsync({
        category: selectedCategory,
        institutionName: instName,
      });
      navigate(`/portal/applications/${created.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <ErrorState message="Failed to load available regulatory approval categories from central API." />
      </div>
    );
  }

  const selectedCatObj = categories?.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <button
        onClick={() => navigate('/portal')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Applications</span>
      </button>

      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs">
        <div className="border-b border-slate-200 pb-4 mb-5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Create AICTE Approval Filing
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Initiate a new statutory regulatory submission. Categories and checklist requirements are dynamically retrieved from the AICTE handbook engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1">
              Applicant Institutional Name
            </label>
            <input
              type="text"
              required
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1">
              Approval Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            >
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.checklistCount} mandatory documents)
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Checklist Preview from API */}
          {selectedCatObj && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-700" />
                <span>Statutory Checklist Applicable to this Category:</span>
              </h4>
              <p className="text-slate-600 mb-3 text-[11px]">
                Upon workspace initialization, you will be required to upload {selectedCatObj.checklistCount} authenticated documents (PDF format) for automated multi-source verification.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                <li>Mandatory Self-Disclosure Form & Faculty Roster</li>
                <li>Sanctioned Architectural Building Master Plan</li>
                {selectedCatObj.checklistCount > 2 && <li>State Fire Directorate Clearance Certificate</li>}
                {selectedCatObj.checklistCount > 3 && <li>AICTE Processing Fee Deposit Challan</li>}
              </ul>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => navigate('/portal')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={createMutation.isPending}
              className="bg-[#005ea2] hover:bg-blue-800"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
