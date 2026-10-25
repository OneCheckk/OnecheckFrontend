import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  Application,
  ChecklistItem,
  Claim,
  Finding,
  LedgerEntry,
  ValidityRecord,
  DeficiencyLetter,
  AuditEvent,
  BenchmarkRun,
  Alert,
  OfficerDashboardSummary,
  ClaimRecheckResult,
  Institution,
  TriangleFinding,
  ForensicsSuiteData,
  RiskScoreBreakdown,
  CheckRun,
} from '@contracts';

// Canonical TanStack Query Key Factories
export const queryKeys = {
  apps: (filters?: Record<string, any>) => ['apps', filters] as const,
  app: (id: string) => ['app', id] as const,
  claims: (id: string) => ['claims', id] as const,
  findings: (id: string) => ['findings', id] as const,
  ledger: (id: string) => ['ledger', id] as const,
  docs: (id: string) => ['docs', id] as const,
  alerts: () => ['alerts'] as const,
  audit: (filters?: Record<string, any>) => ['audit', filters] as const,
  bench: (runId?: string) => ['bench', runId] as const,
  dashboardOfficer: () => ['dashboard', 'officer'] as const,
  categories: () => ['categories'] as const,
  demoSettings: () => ['demo', 'settings'] as const,
  institutions: () => ['institutions'] as const,
  triangle: (id: string) => ['triangle', id] as const,
  forensics: (id: string) => ['forensics', id] as const,
  riskScore: (id: string) => ['risk-score', id] as const,
};

// --- Applications Queries ---

export const useApplications = (filters?: { band?: string; status?: string; search?: string }) => {
  return useQuery({
    queryKey: queryKeys.apps(filters),
    queryFn: async () => {
      const res = await apiClient.get<any>('/applications', {
        params: filters,
      });
      const data = res.data?.data;
      if (Array.isArray(data)) return data;
      if (data?.applications && Array.isArray(data.applications)) return data.applications;
      return [];
    },
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: queryKeys.app(id),
    queryFn: async () => {
      const res = await apiClient.get<any>(`/applications/${id}`);
      const data = res.data?.data;
      return (data?.application || data) as Application;
    },
    enabled: !!id,
  });
};

export const useApplicationChecklist = (id: string) => {
  return useQuery({
    queryKey: queryKeys.docs(id),
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>(`/applications/${id}/checklist`);
        const data = res.data?.data;
        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            ...item,
            state: item.status || item.state || 'MISSING',
            fileName: item.document?.originalName || item.fileName,
          }));
        }
        if (data?.items && Array.isArray(data.items)) {
          return data.items.map((item: any) => ({
            ...item,
            state: item.status || item.state || 'MISSING',
            fileName: item.document?.originalName || item.fileName,
          }));
        }
      } catch {
        // Fallback to /documents
      }
      try {
        const docRes = await apiClient.get<any>(`/applications/${id}/documents`);
        const docs = docRes.data?.data;
        if (Array.isArray(docs)) {
          return docs.map((d: any) => ({
            id: d._id || d.id,
            label: d.originalName || d.documentType,
            docTypes: [d.documentType || d.docType],
            required: true,
            state: d.uploadStatus === 'STORED' ? 'DONE' : 'UPLOADED',
            fileName: d.originalName,
          }));
        }
      } catch {
        // Ignore fallback error
      }
      return [] as ChecklistItem[];
    },
    enabled: !!id,
  });
};

export const useClaims = (applicationId: string) => {
  return useQuery({
    queryKey: queryKeys.claims(applicationId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Claim[] }>(`/applications/${applicationId}/claims`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useFindings = (applicationId: string, filters?: { status?: string; severity?: string; state?: string }) => {
  return useQuery({
    queryKey: queryKeys.findings(applicationId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Finding[] }>(`/applications/${applicationId}/findings`, {
        params: filters,
      });
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useLedger = (applicationId: string) => {
  return useQuery({
    queryKey: queryKeys.ledger(applicationId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: LedgerEntry[] }>(`/applications/${applicationId}/ledger`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useValidity = (applicationId: string) => {
  return useQuery({
    queryKey: ['validity', applicationId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: ValidityRecord[] }>(`/applications/${applicationId}/validity`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useOfficerDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dashboardOfficer(),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: OfficerDashboardSummary }>('/dashboard/officer');
      return res.data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: { id: string; name: string; checklistCount: number }[] }>('/categories');
      return res.data.data;
    },
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: queryKeys.alerts(),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Alert[] }>('/alerts');
      return res.data.data;
    },
  });
};

export const useAuditEvents = (filters?: { entityId?: string; action?: string }) => {
  return useQuery({
    queryKey: queryKeys.audit(filters),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AuditEvent[] }>('/audit', { params: filters });
      return res.data.data;
    },
  });
};

export const useDeficiencyLetters = (applicationId: string) => {
  return useQuery({
    queryKey: ['letters', applicationId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: DeficiencyLetter[] }>(`/applications/${applicationId}/letters`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

// --- Mutations ---

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { category: string; institutionName: string }) => {
      const res = await apiClient.post<{ success: boolean; data: Application }>('/applications', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};

export const useRunSelfCheck = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ success: boolean; data: { findings: Finding[] } }>(`/applications/${applicationId}/self-check`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.findings(applicationId) });
    },
  });
};

export const useCorrectClaim = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ claimId, value, reason }: { claimId: string; value: string | number; reason: string }) => {
      const res = await apiClient.patch<{ success: boolean; data: ClaimRecheckResult }>(`/claims/${claimId}`, {
        value,
        reason,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.findings(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
    },
  });
};

export const useConfirmClaim = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ claimId }: { claimId: string }) => {
      const res = await apiClient.patch<{ success: boolean; data: Claim }>(`/claims/${claimId}/confirm`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
    },
  });
};

export const useDispositionFinding = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ findingId, state, reason }: { findingId: string; state: string; reason?: string }) => {
      const res = await apiClient.post<{ success: boolean; data: Finding }>(`/findings/${findingId}/disposition`, {
        state,
        reason,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.findings(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
    },
  });
};

export const useRecordDecision = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ outcome, reason }: { outcome: string; reason?: string }) => {
      const res = await apiClient.post<{ success: boolean; data: Application }>(`/applications/${applicationId}/decision`, {
        outcome,
        reason,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};

export const useSendDeficiencyLetter = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { findingIds: string[]; content: string }) => {
      const res = await apiClient.post<{ success: boolean; data: DeficiencyLetter }>(`/applications/${applicationId}/letters`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters', applicationId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.findings(applicationId) });
    },
  });
};

export const useVerifyAuditChain = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: { intact: boolean; verifiedCount: number; brokenAtSeq?: number } }>('/audit/verify');
      return res.data.data;
    },
  });
};

// --- Integration Hooks: Institutions, Triangle, Forensics, Risk ---

export const useInstitutions = () => {
  return useQuery({
    queryKey: queryKeys.institutions(),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Institution[] }>('/institutions');
      return res.data.data;
    },
  });
};

export const useTriangleFindings = (applicationId: string) => {
  return useQuery({
    queryKey: queryKeys.triangle(applicationId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: TriangleFinding[] }>(`/applications/${applicationId}/triangle`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useForensicsSuite = (applicationId: string) => {
  return useQuery({
    queryKey: queryKeys.forensics(applicationId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: ForensicsSuiteData }>(`/applications/${applicationId}/forensics`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useRiskScoreBreakdown = (applicationId: string) => {
  return useQuery({
    queryKey: queryKeys.riskScore(applicationId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: RiskScoreBreakdown }>(`/applications/${applicationId}/risk-score`);
      return res.data.data;
    },
    enabled: !!applicationId,
  });
};

export const useRunOfficerChecks = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ success: boolean; data: CheckRun }>(`/applications/${applicationId}/run-checks`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.findings(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.riskScore(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.forensics(applicationId) });
    },
  });
};

export const useUpdateAlertStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason: string }) => {
      const res = await apiClient.patch<{ success: boolean; data: Alert }>(`/alerts/${id}`, { status, reason });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    },
  });
};


export const useUploadDocument = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, docTypeHint, checklistItemId }: { file: File; docTypeHint?: string; checklistItemId?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (docTypeHint) {
        formData.append('docType', docTypeHint);
        formData.append('docTypeHint', docTypeHint);
        formData.append('documentType', docTypeHint);
      }
      if (checklistItemId) {
        formData.append('checklistItemId', checklistItemId);
      }
      const res = await apiClient.post(`/applications/${applicationId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docs(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.claims(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
    },
  });
};

export const useSubmitApplication = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/applications/${applicationId}/submit`);
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.app(applicationId) });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
};
