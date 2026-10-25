import { http, HttpResponse, delay } from 'msw';
import {
  faultedApplication,
  faultedFindings,
  faultedClaims,
  faultedChecklist,
  faultedLedger,
  faultedValidity,
} from './fixtures/faultedApplication';
import {
  cleanApplication,
  cleanFindings,
  cleanClaims,
  cleanChecklist,
  cleanLedger,
  cleanValidity,
} from './fixtures/cleanApplication';
import type {
  Finding,
  Claim,
  ChecklistItem,
  AuditEvent,
  BenchmarkRun,
  Alert,
  Institution,
  TriangleFinding,
  ForensicsSuiteData,
  RiskScoreBreakdown,
  CheckRun,
} from '@contracts';
import {
  archiveInstitutions,
  archiveApplications,
  archiveTriangleFindings,
  archiveForensicsData,
  archiveRiskScore,
  archiveAlerts,
} from './fixtures/archiveData';

// In-memory mutable states for MSW session
let applications = [faultedApplication, cleanApplication, ...archiveApplications];
let findingsMap: Record<string, Finding[]> = {
  [faultedApplication.id]: [...faultedFindings],
  [cleanApplication.id]: [...cleanFindings],
  'app-101': [...faultedFindings],
};
let claimsMap: Record<string, Claim[]> = {
  [faultedApplication.id]: [...faultedClaims],
  [cleanApplication.id]: [...cleanClaims],
};
let checklistMap: Record<string, ChecklistItem[]> = {
  [faultedApplication.id]: [...faultedChecklist],
  [cleanApplication.id]: [...cleanChecklist],
};
let ledgerMap = {
  [faultedApplication.id]: [...faultedLedger],
  [cleanApplication.id]: [...cleanLedger],
};
let lettersMap: Record<string, any[]> = {
  [faultedApplication.id]: [
    {
      id: 'let-01',
      applicationId: faultedApplication.id,
      findingIds: ['F-017', 'F-035'],
      content:
        'Sub: Formal Clarification Request regarding AICTE Application AICTE-2026-NRO-8921.\n\nPlease furnish the clarified sanctioned architectural drawing demonstrating laboratory space conformity as per Clause 4.2. Additionally, submit authenticated banking settlement advice for TER deposit challan UTR 9831128827 within 7 calendar days.',
      status: 'SENT',
      createdAt: '2026-10-24T09:40:00Z',
      sentAt: '2026-10-24T09:45:00Z',
      recipient: 'registrar@apex-institute.ac.in',
    },
  ],
};

let auditEvents: AuditEvent[] = [
  {
    seq: 1,
    ts: '2026-10-24T07:15:00Z',
    actor: { id: 'usr-inst-1', name: 'Dr. R. K. Sharma', role: 'INSTITUTION' },
    action: 'DOC_UPLOADED',
    entity: { type: 'DOCUMENT', id: 'D1' },
    payload: { filename: 'Affidavit_SelfDisclosure_2026.pdf', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
  },
  {
    seq: 2,
    ts: '2026-10-24T08:00:00Z',
    actor: { id: 'usr-inst-1', name: 'Dr. R. K. Sharma', role: 'INSTITUTION' },
    action: 'APPLICATION_SUBMITTED',
    entity: { type: 'APPLICATION', id: faultedApplication.id },
    payload: { applicationNumber: faultedApplication.applicationNumber },
    prevHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    hash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1',
  },
  {
    seq: 3,
    ts: '2026-10-24T09:30:00Z',
    actor: { id: 'sys-pipeline', name: 'OneCheck Automated Pipeline', role: 'SYSTEM' },
    action: 'RULES_EVALUATED',
    entity: { type: 'FINDINGS', id: faultedApplication.id },
    payload: { findingsGenerated: 6, riskBandAssigned: 'RED' },
    prevHash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1',
    hash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2',
  },
];

let alerts: Alert[] = [
  {
    id: 'alt-1',
    type: 'DOC_EXPIRING',
    severity: 'MEDIUM',
    message: 'State Fire Department NOC lapses within 22 days of academic period commencement.',
    applicationId: faultedApplication.id,
    raisedAt: '2026-10-24T08:05:00Z',
    acknowledged: false,
  },
  {
    id: 'alt-2',
    type: 'FORENSIC_SIGNAL',
    severity: 'HIGH',
    message: 'Post-generation xref modifications and dual producers detected on Building Plan document.',
    applicationId: faultedApplication.id,
    raisedAt: '2026-10-24T08:06:00Z',
    acknowledged: false,
  },
  ...archiveAlerts,
];

let benchmarkRuns: BenchmarkRun[] = [
  {
    runId: 'bench-2026-run-001',
    timestamp: '2026-10-24T06:00:00Z',
    n: 100,
    seed: 42,
    faultRate: 0.35,
    scanRatio: 0.4,
    manifestHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'COMPLETED',
    results: {
      extractionAccuracy: 99.4,
      validationAccuracy: 99.1,
      cleanAppFalsePositiveRate: 0.0,
      avgVerificationTimeSec: 1.2,
      scanVsTextAccuracy: { scan: 98.7, text: 99.8 },
      alertTimelinessMin: 4.8,
      perFault: [
        { faultType: 'AREA_MISMATCH', precision: 1.0, recall: 0.98, f1: 0.99, tp: 34, fp: 0, fn: 1 },
        { faultType: 'FACULTY_INTAKE', precision: 0.97, recall: 1.0, f1: 0.98, tp: 28, fp: 1, fn: 0 },
        { faultType: 'TER_PAYMENT', precision: 1.0, recall: 1.0, f1: 1.0, tp: 22, fp: 0, fn: 0 },
        { faultType: 'NOC_VALIDITY', precision: 1.0, recall: 0.96, f1: 0.98, tp: 25, fp: 0, fn: 1 },
        { faultType: 'DOC_FORENSICS', precision: 0.95, recall: 0.92, f1: 0.93, tp: 19, fp: 1, fn: 2 },
      ],
    },
  },
];

let demoSettings = {
  enabled: true,
  decisionDateOffsetDays: 0,
  forceSourceUnavailable: false,
};

let auditTampered = false;

// Helper to register both relative '/api/...' and wildcard '*/api/...' paths with explicit any signature
function route(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  resolver: (info: any) => any
) {
  const normPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath = normPath.startsWith('/api/') ? normPath : `/api${normPath}`;
  return [
    http[method](apiPath, resolver as any),
    http[method](`*${apiPath}`, resolver as any),
  ];
}

export const handlers = [
  // --- Auth Handlers ---
  ...route('post', '/api/auth/login', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const email = body.email || '';

    let role = 'INSTITUTION';
    let name = 'Institutional Officer';
    if (email.includes('officer')) {
      role = 'SCRUTINY_OFFICER';
      name = 'Shri V. S. Rao (Scrutiny Officer)';
    } else if (email.includes('director')) {
      role = 'REGIONAL_DIRECTOR';
      name = 'Dr. Sunita Deshmukh (Regional Director)';
    } else if (email.includes('admin')) {
      role = 'ADMIN';
      name = 'AICTE Central System Admin';
    } else if (email.includes('auditor')) {
      role = 'AUDITOR';
      name = 'Statutory Compliance Auditor';
    }

    return HttpResponse.json({
      success: true,
      data: {
        token: `mock-jwt-token-for-${role}`,
        user: {
          id: `usr-${role.toLowerCase()}`,
          name,
          email,
          role,
        },
      },
    });
  }),

  // --- Dashboard Officer ---
  ...route('get', '/api/dashboard/officer', () => {
    return HttpResponse.json({
      success: true,
      data: {
        bandCounts: {
          RED: applications.filter((a) => a.band === 'RED').length,
          YELLOW: applications.filter((a) => a.band === 'YELLOW').length,
          GREEN: applications.filter((a) => a.band === 'GREEN').length,
        },
        pendingSourceVerifications: 1,
        oldestUnresolvedDays: 4,
        avgTimePerStageDays: 1.8,
      },
    });
  }),

  // --- Applications ---
  ...route('get', '/api/applications', ({ request }) => {
    const url = new URL(request.url);
    const band = url.searchParams.get('band');
    const search = url.searchParams.get('search');

    let result = [...applications];
    if (band && band !== 'ALL') {
      result = result.filter((a) => a.band === band);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.applicationNumber.toLowerCase().includes(q) ||
          a.institutionName.toLowerCase().includes(q)
      );
    }

    return HttpResponse.json({
      success: true,
      data: result,
      meta: {
        requestId: 'req-' + Date.now(),
        pagination: { page: 1, limit: 10, totalItems: result.length, totalPages: 1 },
      },
    });
  }),

  ...route('post', '/api/applications', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const newApp = {
      id: `app-new-${Date.now()}`,
      applicationNumber: `AICTE-2026-RO-${Math.floor(1000 + Math.random() * 9000)}`,
      institutionId: 'inst-user-current',
      institutionName: body.institutionName || 'National Institute of Science & Technology',
      category: body.category || 'ENGINEERING_UNDERGRADUATE',
      status: 'DRAFT',
      band: undefined,
      missingItemsCount: 4,
      openFindingsCount: { info: 0, low: 0, medium: 0, high: 0, critical: 0 },
      pendingSourcesCount: 0,
      claimsNeedingConfirmationCount: 0,
      updatedAt: new Date().toISOString(),
      sourceLabel: 'DEMO ADAPTER - simulated source',
    };

    applications.unshift(newApp as any);
    checklistMap[newApp.id] = [
      {
        id: 'chk-new-1',
        category: newApp.category,
        label: 'Mandatory Self-Disclosure Affidavit',
        clauseRef: 'APH-2026-APP-1',
        required: true,
        state: 'MISSING',
        docType: 'SELF_DISCLOSURE_FORM',
      },
      {
        id: 'chk-new-2',
        category: newApp.category,
        label: 'Approved Architectural Blueprint CAD Drawing',
        clauseRef: 'APH-2026-INFRA-1',
        required: true,
        state: 'MISSING',
        docType: 'BUILDING_PLAN',
      },
      {
        id: 'chk-new-3',
        category: newApp.category,
        label: 'Sanctioned Faculty Cadre List with Biometric Identification',
        clauseRef: 'APH-2026-FAC-1',
        required: true,
        state: 'MISSING',
        docType: 'FACULTY_LIST',
      },
      {
        id: 'chk-new-4',
        category: newApp.category,
        label: 'State Fire Service Safety NOC',
        clauseRef: 'APH-2026-SAFETY-1',
        required: true,
        state: 'MISSING',
        docType: 'FIRE_NOC',
      },
    ];

    claimsMap[newApp.id] = [
      {
        claimId: `clm-${Date.now()}-1`,
        applicationId: newApp.id,
        docId: 'chk-new-1',
        predicate: 'carpet_area_sqm',
        predicateLabel: 'Total Carpet Area (sq.m)',
        value: 12500,
        unit: 'sqm',
        confidence: 0.95,
        status: 'VERIFICATION_PENDING',
        source: {
          docId: 'chk-new-1',
          page: 1,
          bbox: [0.1, 0.1, 0.9, 0.2],
          snippet: 'Declared Carpet Area: 12500 sqm',
          docType: 'SELF_DISCLOSURE_FORM',
        },
        needsConfirmation: false,
      },
      {
        claimId: `clm-${Date.now()}-2`,
        applicationId: newApp.id,
        docId: 'chk-new-3',
        predicate: 'student_faculty_ratio',
        predicateLabel: 'Student-to-Faculty Ratio',
        value: '1:20',
        confidence: 0.92,
        status: 'VERIFICATION_PENDING',
        source: {
          docId: 'chk-new-3',
          page: 1,
          bbox: [0.1, 0.3, 0.9, 0.4],
          snippet: 'Cadre ratio: 1:20',
          docType: 'FACULTY_LIST',
        },
        needsConfirmation: false,
      },
    ];

    findingsMap[newApp.id] = [];

    return HttpResponse.json({ success: true, data: newApp });
  }),

  ...route('get', '/api/applications/:id', ({ params }) => {
    const { id } = params;
    const app = applications.find((a) => a.id === id);
    if (!app) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: app });
  }),

  // --- Documents & Checklists ---
  ...route('get', '/api/applications/:id/documents', ({ params }) => {
    const { id } = params as { id: string };
    const items = checklistMap[id] || checklistMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: items });
  }),

  ...route('post', '/api/documents/upload', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        docId: `D-${Date.now()}`,
        status: 'UPLOADED',
        detectedDocType: 'SELF_DISCLOSURE_FORM',
      },
    });
  }),

  // --- Claims ---
  ...route('get', '/api/applications/:id/claims', ({ params }) => {
    const { id } = params as { id: string };
    const claims = claimsMap[id] || claimsMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: claims });
  }),

  ...route('patch', '/api/claims/:claimId', async ({ params, request }) => {
    const { claimId } = params as { claimId: string };
    const body = (await request.json().catch(() => ({}))) as any;
    const { value, reason } = body;

    if (!reason || reason.trim().length < 5) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'A mandatory reason is required for editing claimed data.' },
        },
        { status: 400 }
      );
    }

    // Update in-memory claim across all lists
    Object.values(claimsMap).forEach((list) => {
      const target = list.find((c) => c.claimId === claimId);
      if (target) {
        target.originalValue = target.originalValue || target.value;
        target.value = value;
        target.correctionReason = reason;
        target.status = 'VERIFIED';
        target.needsConfirmation = false;
      }
    });

    return HttpResponse.json({
      success: true,
      data: {
        claimId,
        newStatus: 'VERIFIED',
        recheckFindings: [],
        timestamp: new Date().toISOString(),
      },
    });
  }),

  ...route('patch', '/api/claims/:claimId/confirm', ({ params }) => {
    const { claimId } = params as { claimId: string };
    let confirmedClaim: Claim | undefined;
    Object.values(claimsMap).forEach((list) => {
      const target = list.find((c) => c.claimId === claimId);
      if (target) {
        target.needsConfirmation = false;
        target.status = 'VERIFIED';
        confirmedClaim = target;
      }
    });

    return HttpResponse.json({
      success: true,
      data: confirmedClaim || { claimId, needsConfirmation: false },
    });
  }),

  // --- Findings ---
  ...route('get', '/api/applications/:id/findings', ({ params }) => {
    const { id } = params as { id: string };
    const findings = findingsMap[id] || findingsMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: findings });
  }),

  ...route('post', '/api/findings/:id/disposition', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json().catch(() => ({}))) as any;
    const { state, reason } = body;

    if (state === 'DISMISSED' && (!reason || reason.trim().length < 10)) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dismissing an automated regulatory finding requires a justification of at least 10 characters.',
          },
        },
        { status: 400 }
      );
    }

    let updatedFinding: Finding | undefined;
    Object.values(findingsMap).forEach((list) => {
      const f = list.find((item) => item.findingId === id);
      if (f) {
        f.state = state;
        f.dismissalReason = reason;
        updatedFinding = f;
      }
    });

    return HttpResponse.json({
      success: true,
      data: updatedFinding || { findingId: id, state },
    });
  }),

  // --- Ledger ---
  ...route('get', '/api/applications/:id/ledger', ({ params }) => {
    const { id } = params as { id: string };
    const ledger = (ledgerMap as any)[id] || ledgerMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: ledger });
  }),

  // --- Validity ---
  ...route('get', '/api/applications/:id/validity', ({ params }) => {
    const { id } = params as { id: string };
    let validity = id === cleanApplication.id ? [...cleanValidity] : [...faultedValidity];

    // If decision date slider offset is active in demo settings, shift remaining days
    if (demoSettings.decisionDateOffsetDays > 0) {
      validity = validity.map((v) => {
        const remaining = v.daysRemaining - demoSettings.decisionDateOffsetDays;
        let state = v.state;
        if (remaining <= 0) {
          state = 'EXPIRED';
        } else if (remaining < 60) {
          state = 'LAPSES_IN_PERIOD';
        }
        return {
          ...v,
          daysRemaining: Math.max(0, remaining),
          state,
        };
      });
    }

    return HttpResponse.json({ success: true, data: validity });
  }),

  // --- Self-Check ---
  ...route('post', '/api/applications/:id/self-check', async ({ params }) => {
    const { id } = params as { id: string };
    await delay(600);
    const findings = findingsMap[id] || findingsMap[faultedApplication.id] || [];
    return HttpResponse.json({
      success: true,
      data: {
        findings,
        timestamp: new Date().toISOString(),
      },
    });
  }),

  // --- Decision ---
  ...route('post', '/api/applications/:id/decision', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json().catch(() => ({}))) as any;
    const { outcome, reason } = body;

    const app = applications.find((a) => a.id === id);
    if (app) {
      app.status = outcome === 'APPROVE' ? 'APPROVED' : outcome === 'REJECT' ? 'REJECTED' : 'DEFICIENCY_RAISED';
      (app as any).decisionReason = reason;
      (app as any).decidedAt = new Date().toISOString();
    }

    return HttpResponse.json({
      success: true,
      data: app,
    });
  }),

  // --- Deficiency Letters ---
  ...route('get', '/api/applications/:id/letters', ({ params }) => {
    const { id } = params as { id: string };
    const letters = lettersMap[id] || [];
    return HttpResponse.json({ success: true, data: letters });
  }),

  ...route('post', '/api/applications/:id/letters', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json().catch(() => ({}))) as any;
    const newLetter = {
      id: `let-${Date.now()}`,
      applicationId: id,
      findingIds: body.findingIds || [],
      content: body.content || '',
      status: 'SENT',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      recipient: 'registrar@institution.ac.in',
    };

    if (!lettersMap[id]) lettersMap[id] = [];
    lettersMap[id].push(newLetter);

    return HttpResponse.json({
      success: true,
      data: newLetter,
    });
  }),

  // --- Cryptographic Audit Chain ---
  ...route('get', '/api/audit', () => {
    return HttpResponse.json({
      success: true,
      data: auditEvents,
      meta: {
        totalItems: auditEvents.length,
      },
    });
  }),

  ...route('get', '/api/audit/verify', () => {
    if (auditTampered) {
      return HttpResponse.json({
        success: true,
        data: {
          intact: false,
          verifiedCount: 1,
          brokenAtSeq: 2,
          reason: 'SHA-256 hash mismatch at event sequence #2: cryptographic parent pointer violated.',
        },
      });
    }

    return HttpResponse.json({
      success: true,
      data: {
        intact: true,
        verifiedCount: auditEvents.length,
      },
    });
  }),

  // --- Benchmark Runs ---
  ...route('get', '/api/benchmark/runs', () => {
    return HttpResponse.json({
      success: true,
      data: benchmarkRuns,
    });
  }),

  ...route('post', '/api/benchmark/run', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const n = Number(body.n) || 100;
    const seed = Number(body.seed) || 42;
    const faultRate = typeof body.faultRate === 'number' ? body.faultRate : 0.35;
    const scanRatio = typeof body.scanRatio === 'number' ? body.scanRatio : 0.4;

    const totalInjectedFaults = Math.round(n * faultRate);

    const newRun: BenchmarkRun = {
      runId: `bench-${Date.now()}`,
      timestamp: new Date().toISOString(),
      n,
      seed,
      faultRate,
      scanRatio,
      manifestHash: `sha256-${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
      status: 'COMPLETED',
      results: {
        extractionAccuracy: +(99.2 + Math.random() * 0.6).toFixed(1),
        validationAccuracy: +(99.0 + Math.random() * 0.8).toFixed(1),
        cleanAppFalsePositiveRate: 0.0,
        avgVerificationTimeSec: +(1.1 + Math.random() * 0.3).toFixed(1),
        scanVsTextAccuracy: { scan: 98.6, text: 99.8 },
        alertTimelinessMin: +(4.2 + Math.random() * 0.9).toFixed(1),
        perFault: [
          {
            faultType: 'AREA_MISMATCH',
            precision: 1.0,
            recall: +(0.97 + Math.random() * 0.03).toFixed(2),
            f1: 0.99,
            tp: Math.max(1, Math.round(totalInjectedFaults * 0.28)),
            fp: 0,
            fn: 1,
          },
          {
            faultType: 'FACULTY_INTAKE',
            precision: 0.98,
            recall: 1.0,
            f1: 0.99,
            tp: Math.max(1, Math.round(totalInjectedFaults * 0.24)),
            fp: 1,
            fn: 0,
          },
          {
            faultType: 'TER_PAYMENT',
            precision: 1.0,
            recall: 1.0,
            f1: 1.0,
            tp: Math.max(1, Math.round(totalInjectedFaults * 0.20)),
            fp: 0,
            fn: 0,
          },
          {
            faultType: 'NOC_VALIDITY',
            precision: 1.0,
            recall: +(0.96 + Math.random() * 0.04).toFixed(2),
            f1: 0.98,
            tp: Math.max(1, Math.round(totalInjectedFaults * 0.22)),
            fp: 0,
            fn: 1,
          },
          {
            faultType: 'DOC_FORENSICS',
            precision: 0.96,
            recall: +(0.93 + Math.random() * 0.05).toFixed(2),
            f1: 0.94,
            tp: Math.max(1, Math.round(totalInjectedFaults * 0.16)),
            fp: 1,
            fn: 1,
          },
        ],
      },
    };

    benchmarkRuns.unshift(newRun);
    return HttpResponse.json({ success: true, data: newRun });
  }),

  // --- Demo Settings ---
  ...route('get', '/api/demo/settings', () => {
    return HttpResponse.json({ success: true, data: demoSettings });
  }),

  ...route('put', '/api/demo/settings', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    demoSettings = { ...demoSettings, ...body };
    return HttpResponse.json({ success: true, data: demoSettings });
  }),

  ...route('post', '/api/demo/tamper-audit', () => {
    auditTampered = true;
    return HttpResponse.json({ success: true, message: 'Audit event #2 tampered in test environment.' });
  }),

  // --- Categories ---
  ...route('get', '/api/categories', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'ENGINEERING_UNDERGRADUATE', name: 'Engineering & Technology (Undergraduate / B.Tech)', checklistCount: 4 },
        { id: 'MANAGEMENT_POSTGRADUATE', name: 'Management Studies (Postgraduate / MBA)', checklistCount: 2 },
        { id: 'PHARMACY_DIPLOMA', name: 'Pharmacy & Medical Sciences (Diploma / B.Pharm)', checklistCount: 3 },
      ],
    });
  }),

  // --- Alerts ---
  ...route('get', '/api/alerts', () => {
    return HttpResponse.json({
      success: true,
      data: alerts,
    });
  }),

  ...route('post', '/api/alerts/:id/ack', ({ params }) => {
    const { id } = params as { id: string };
    const alt = alerts.find((a) => a.id === id);
    if (alt) alt.acknowledged = true;
    return HttpResponse.json({ success: true, data: alt });
  }),

  ...route('patch', '/api/alerts/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json().catch(() => ({}))) as any;
    const alt = alerts.find((a) => a.id === id);
    if (alt) {
      if (body.status === 'RESOLVED' || body.status === 'ACKNOWLEDGED' || body.status === 'FALSE_POSITIVE') {
        alt.acknowledged = true;
      }
      if (body.reason) {
        (alt as any).resolutionReason = body.reason;
      }
    }
    return HttpResponse.json({ success: true, data: alt });
  }),

  // --- Institutions ---
  ...route('get', '/api/institutions', () => {
    return HttpResponse.json({
      success: true,
      data: archiveInstitutions,
    });
  }),

  ...route('get', '/api/institutions/:id', ({ params }) => {
    const { id } = params as { id: string };
    const inst = archiveInstitutions.find((i) => i.id === id) || archiveInstitutions[0];
    return HttpResponse.json({
      success: true,
      data: inst,
    });
  }),

  // --- Triangle of Truth ---
  ...route('get', '/api/applications/:id/triangle', () => {
    return HttpResponse.json({
      success: true,
      data: archiveTriangleFindings,
    });
  }),

  // --- Forensics Suite ---
  ...route('get', '/api/applications/:id/forensics', () => {
    return HttpResponse.json({
      success: true,
      data: archiveForensicsData,
    });
  }),

  // --- 5-Pillar Risk Score Breakdown ---
  ...route('get', '/api/applications/:id/risk-score', ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({
      success: true,
      data: {
        ...archiveRiskScore,
        applicationId: id,
      },
    });
  }),

  // --- Automated Scrutiny Check Run ---
  ...route('post', '/api/applications/:id/run-checks', async () => {
    await delay(500);
    const steps = [
      { name: 'OCR extraction', status: 'SUCCEEDED' as const },
      { name: 'PDF revision forensics', status: 'SUCCEEDED' as const },
      { name: 'ELA tamper analysis', status: 'SUCCEEDED' as const },
      { name: 'Perceptual image matching', status: 'SUCCEEDED' as const },
      { name: 'Geofence (500 m) validation', status: 'SUCCEEDED' as const },
      { name: 'Faculty identity collision check', status: 'SUCCEEDED' as const },
      { name: 'Architectural blueprint CAD analysis', status: 'SUCCEEDED' as const },
      { name: 'Records reconciliation', status: 'SUCCEEDED' as const },
      { name: 'Objective 5-pillar risk calculation', status: 'SUCCEEDED' as const },
    ];
    return HttpResponse.json({
      success: true,
      data: {
        runId: `run-${Date.now()}`,
        status: 'SUCCEEDED',
        steps,
      },
    });
  }),
];
