import React from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Hourglass,
  CloudOff,
  Eye,
  MinusCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import clsx from 'clsx';
import type { VerificationStatus, Band, Severity, FindingState, ChecklistState } from '@contracts';

interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <span
          data-testid="status-badge"
          data-status="VERIFIED"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-emerald-50 text-emerald-900 border-emerald-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <CheckCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Verified</span>
        </span>
      );
    case 'MISMATCH_DETECTED':
      return (
        <span
          data-testid="status-badge"
          data-status="MISMATCH_DETECTED"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-rose-50 text-rose-900 border-rose-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <XCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Mismatch detected</span>
        </span>
      );
    case 'EXPIRED':
      return (
        <span
          data-testid="status-badge"
          data-status="EXPIRED"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-rose-50 text-rose-900 border-rose-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <Clock className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Expired</span>
        </span>
      );
    case 'VERIFICATION_PENDING':
      return (
        <span
          data-testid="status-badge"
          data-status="VERIFICATION_PENDING"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-blue-50 text-blue-900 border-blue-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <Hourglass className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Verification pending</span>
        </span>
      );
    case 'SOURCE_UNAVAILABLE':
      return (
        <span
          data-testid="status-badge"
          data-status="SOURCE_UNAVAILABLE"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-slate-100 text-slate-700 border-slate-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <CloudOff className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Source unavailable</span>
        </span>
      );
    case 'MANUAL_REVIEW_REQUIRED':
      return (
        <span
          data-testid="status-badge"
          data-status="MANUAL_REVIEW_REQUIRED"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-amber-50 text-amber-900 border-amber-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <Eye className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Manual review required</span>
        </span>
      );
    case 'NOT_CHECKED':
      return (
        <span
          data-testid="status-badge"
          data-status="NOT_CHECKED"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-slate-100 text-slate-700 border-slate-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <MinusCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Not checked</span>
        </span>
      );
    case 'BLOCKED_LOW_CONFIDENCE':
      return (
        <span
          data-testid="status-badge"
          data-status="BLOCKED_LOW_CONFIDENCE"
          className={clsx(
            'inline-flex items-center gap-1.5 font-medium rounded border px-2 py-0.5',
            'bg-amber-50 text-amber-900 border-amber-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            className
          )}
        >
          <HelpCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
          <span>Needs confirmation</span>
        </span>
      );
    default:
      return null;
  }
};

interface BandChipProps {
  band: Band;
  className?: string;
}

export const BandChip: React.FC<BandChipProps> = ({ band, className }) => {
  const configs = {
    RED: {
      label: 'High priority',
      classes: 'bg-rose-50 text-rose-900 border-rose-300',
      icon: ShieldAlert,
    },
    YELLOW: {
      label: 'Needs attention',
      classes: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: AlertTriangle,
    },
    GREEN: {
      label: 'Routine',
      classes: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      icon: CheckCircle,
    },
  };

  const { label, classes, icon: Icon } = configs[band] || configs.GREEN;

  return (
    <span
      data-testid="band-chip"
      data-band={band}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold border',
        classes,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

interface SeverityChipProps {
  severity: Severity;
  className?: string;
}

export const SeverityChip: React.FC<SeverityChipProps> = ({ severity, className }) => {
  const configs = {
    CRITICAL: {
      label: 'CRITICAL',
      classes: 'bg-rose-50 text-rose-900 border-rose-300',
    },
    HIGH: {
      label: 'HIGH',
      classes: 'bg-red-50 text-red-900 border-red-300',
    },
    MEDIUM: {
      label: 'MEDIUM',
      classes: 'bg-amber-50 text-amber-900 border-amber-300',
    },
    LOW: {
      label: 'LOW',
      classes: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    INFO: {
      label: 'INFO',
      classes: 'bg-slate-50 text-slate-700 border-slate-200',
    },
  };

  const { label, classes } = configs[severity] || configs.INFO;

  return (
    <span
      data-testid="severity-chip"
      data-severity={severity}
      className={clsx(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold border tracking-wide uppercase',
        classes,
        className
      )}
    >
      {label}
    </span>
  );
};

export const SeverityBadge = SeverityChip;


interface StateChipProps {
  state: FindingState | ChecklistState;
  className?: string;
}

export const StateChip: React.FC<StateChipProps> = ({ state, className }) => {
  const stateLabels: Record<string, { label: string; style: string }> = {
    OPEN: { label: 'Open', style: 'bg-red-50 text-red-800 border-red-200' },
    ACCEPTED: { label: 'Accepted', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    DISMISSED: { label: 'Dismissed', style: 'bg-slate-100 text-slate-700 border-slate-300' },
    CLARIFICATION_REQUESTED: { label: 'Clarification Queued', style: 'bg-blue-50 text-blue-800 border-blue-200' },
    MISSING: { label: 'Missing', style: 'bg-amber-50 text-amber-800 border-amber-300' },
    UPLOADED: { label: 'Uploaded', style: 'bg-slate-100 text-slate-700 border-slate-200' },
    EXTRACTING: { label: 'Extracting', style: 'bg-slate-100 text-slate-700 border-slate-200' },
    DONE: { label: 'Done', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    FAILED: { label: 'Failed', style: 'bg-rose-50 text-rose-800 border-rose-300' },
  };

  const item = stateLabels[state] || { label: state, style: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span
      data-testid="state-chip"
      data-state={state}
      className={clsx('inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border', item.style, className)}
    >
      {item.label}
    </span>
  );
};

export const PlaceholderTag: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span
      data-testid="placeholder-tag"
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-300',
        className
      )}
      title="Norm reference pending handbook clause alignment"
    >
      <Info className="w-3 h-3 text-slate-500" aria-hidden="true" />
      <span>Norm pending handbook check</span>
    </span>
  );
};

export const DemoBanner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      data-testid="demo-banner"
      role="alert"
      className={clsx(
        'bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 flex items-center justify-center gap-2',
        className
      )}
    >
      <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
      <span>Synthetic data and simulated sources for regulatory demonstration.</span>
    </div>
  );
};
