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
import type { Finding, Claim, ChecklistItem, AuditEvent, BenchmarkRun, Alert } from '@contracts';

// In-memory mutable states for MSW session
let applications = [faultedApplication, cleanApplication];
let findingsMap: Record<string, Finding[]> = {
  [faultedApplication.id]: [...faultedFindings],
  [cleanApplication.id]: [...cleanFindings],
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
];

let demoSettings = {
  enabled: true,
  decisionDateOffsetDays: 0,
  forceSourceUnavailable: false,
};

let auditTampered = false;

export const handlers = [
  // --- Auth Handlers ---
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as any;
    const { email } = body;

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
  http.get('*/api/dashboard/officer', () => {
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
  http.get('*/api/applications', ({ request }) => {
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

  http.post('*/api/applications', async ({ request }) => {
    const body = (await request.json()) as any;
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
        label: 'Sanctioned Master Building Plan & NOC',
        clauseRef: 'APH-2026-APP-2',
        required: true,
        state: 'MISSING',
        docType: 'BUILDING_PLAN',
      },
    ];

    findingsMap[newApp.id] = [];
    claimsMap[newApp.id] = [];

    return HttpResponse.json({
      success: true,
      data: newApp,
    });
  }),

  http.get('*/api/applications/:id', ({ params }) => {
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
  http.get('*/api/applications/:id/documents', ({ params }) => {
    const { id } = params as { id: string };
    const items = checklistMap[id] || checklistMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: items });
  }),

  http.post('*/api/documents/upload', async ({ request }) => {
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
  http.get('*/api/applications/:id/claims', ({ params }) => {
    const { id } = params as { id: string };
    const claims = claimsMap[id] || claimsMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: claims });
  }),

  http.patch('*/api/claims/:claimId', async ({ params, request }) => {
    const { claimId } = params as { claimId: string };
    const body = (await request.json()) as any;
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
        rulesRerun: 4,
        rulesTotal: 18,
        closed: 1,
        opened: 0,
        changed: 1,
      },
    });
  }),

  http.patch('*/api/claims/:claimId/confirm', ({ params }) => {
    const { claimId } = params as { claimId: string };
    let foundClaim: Claim | undefined;
    Object.values(claimsMap).forEach((list) => {
      const c = list.find((item) => item.claimId === claimId);
      if (c) {
        c.needsConfirmation = false;
        c.confirmed = true;
        c.status = 'VERIFIED';
        foundClaim = c;
      }
    });

    return HttpResponse.json({
      success: true,
      data: foundClaim || { claimId, confirmed: true },
    });
  }),

  // --- Findings ---
  http.get('*/api/applications/:id/findings', ({ params }) => {
    const { id } = params as { id: string };
    const findings = findingsMap[id] || findingsMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: findings });
  }),

  http.post('*/api/findings/:id/disposition', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as any;
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
  http.get('*/api/applications/:id/ledger', ({ params }) => {
    const { id } = params as { id: string };
    const ledger = (ledgerMap as any)[id] || ledgerMap[faultedApplication.id] || [];
    return HttpResponse.json({ success: true, data: ledger });
  }),

  // --- Validity ---
  http.get('*/api/applications/:id/validity', ({ params }) => {
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
  http.post('*/api/applications/:id/self-check', async ({ params }) => {
    await delay(600);
    const { id } = params as { id: string };
    const findings = findingsMap[id] || [];
    return HttpResponse.json({
      success: true,
      data: { findings },
    });
  }),

  // --- Decision ---
  http.post('*/api/applications/:id/decision', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as any;
    const { outcome, reason } = body;

    const app = applications.find((a) => a.id === id);
    if (app) {
      if (outcome === 'APPROVED') {
        app.status = 'APPROVED';
      } else if (outcome === 'REJECTED') {
        app.status = 'REJECTED';
      }
    }

    return HttpResponse.json({
      success: true,
      data: app,
    });
  }),

  // --- Deficiency Letters ---
  http.get('*/api/applications/:id/letters', ({ params }) => {
    const { id } = params as { id: string };
    const letters = lettersMap[id] || [];
    return HttpResponse.json({ success: true, data: letters });
  }),

  http.post('*/api/applications/:id/letters', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as any;
    const newLetter = {
      id: `let-${Date.now()}`,
      applicationId: id,
      findingIds: body.findingIds || [],
      content: body.content,
      status: 'SENT',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      recipient: 'registrar@institution.ac.in',
    };

    if (!lettersMap[id]) lettersMap[id] = [];
    lettersMap[id].unshift(newLetter);

    return HttpResponse.json({
      success: true,
      data: newLetter,
    });
  }),

  // --- Audit & Hash Chain ---
  http.get('*/api/audit', () => {
    return HttpResponse.json({
      success: true,
      data: auditEvents,
    });
  }),

  http.get('*/api/audit/verify', () => {
    if (auditTampered) {
      return HttpResponse.json({
        success: true,
        data: {
          intact: false,
          verifiedCount: 1,
          brokenAtSeq: 2,
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

  // --- Benchmark ---
  http.get('*/api/benchmark/runs', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          runId: 'bench-seed-42',
          timestamp: '2026-10-24T06:00:00Z',
          n: 100,
          seed: 42,
          faultRate: 0.35,
          scanRatio: 0.4,
          manifestHash: 'sha256-8a9d12f3bc17e9a8',
          status: 'COMPLETED',
          results: {
            extractionAccuracy: 98.4,
            validationAccuracy: 99.1,
            cleanAppFalsePositiveRate: 0.0,
            avgVerificationTimeSec: 2.3,
            scanVsTextAccuracy: { scan: 97.2, text: 99.8 },
            alertTimelinessMin: 0.8,
            perFault: [
              { faultType: 'AREA_MISMATCH', precision: 1.0, recall: 0.98, f1: 0.99, tp: 34, fp: 0, fn: 1 },
              { faultType: 'FACULTY_INTAKE', precision: 0.97, recall: 1.0, f1: 0.98, tp: 28, fp: 1, fn: 0 },
              { faultType: 'TER_PAYMENT', precision: 1.0, recall: 1.0, f1: 1.0, tp: 22, fp: 0, fn: 0 },
              { faultType: 'NOC_VALIDITY', precision: 1.0, recall: 0.96, f1: 0.98, tp: 25, fp: 0, fn: 1 },
              { faultType: 'DOC_FORENSICS', precision: 0.95, recall: 0.92, f1: 0.93, tp: 19, fp: 1, fn: 2 },
            ],
          },
        },
      ],
    });
  }),

  // --- Demo Settings ---
  http.get('*/api/demo/settings', () => {
    return HttpResponse.json({ success: true, data: demoSettings });
  }),

  http.put('*/api/demo/settings', async ({ request }) => {
    const body = (await request.json()) as any;
    demoSettings = { ...demoSettings, ...body };
    return HttpResponse.json({ success: true, data: demoSettings });
  }),

  http.post('*/api/demo/tamper-audit', () => {
    auditTampered = true;
    return HttpResponse.json({ success: true, message: 'Audit event #2 tampered in test environment.' });
  }),

  // --- Categories ---
  http.get('*/api/categories', () => {
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
  http.get('*/api/alerts', () => {
    return HttpResponse.json({
      success: true,
      data: alerts,
    });
  }),

  http.post('*/api/alerts/:id/ack', ({ params }) => {
    const { id } = params as { id: string };
    const alt = alerts.find((a) => a.id === id);
    if (alt) alt.acknowledged = true;
    return HttpResponse.json({ success: true, data: alt });
  }),
];
