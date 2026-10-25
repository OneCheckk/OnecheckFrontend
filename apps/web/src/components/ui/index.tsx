import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  FolderX,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  FileCheck,
  Phone,
  Mail,
  Clock,
  Shield,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

// ==========================================
// 1. Government Top Bar & Helpline Support
// ==========================================

export const GovtTopBar: React.FC = () => {
  const [showHelpline, setShowHelpline] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0 = A-, 1 = A, 2 = A+
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  const handleFontChange = (delta: number) => {
    const next = Math.max(0, Math.min(2, fontSizeIndex + delta));
    setFontSizeIndex(next);
    if (next === 0) document.documentElement.style.fontSize = '14px';
    if (next === 1) document.documentElement.style.fontSize = '16px';
    if (next === 2) document.documentElement.style.fontSize = '18px';
  };

  return (
    <>
      {/* 3px Tricolor Line at top of screen */}
      <div className="h-[3px] w-full flex" aria-hidden="true">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      <div className="bg-[#0b2545] text-slate-100 text-xs py-1.5 px-3 sm:px-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Bilingual Government Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#FF9933] shrink-0" aria-hidden="true" />
            <p className="text-[11px] sm:text-xs font-semibold tracking-wide truncate">
              <span className="text-[#FF9933] font-bold">भारत सरकार</span>
              <span className="mx-1 text-slate-400">·</span>
              <span>Government of India</span>
              <span className="hidden md:inline text-slate-400"> | </span>
              <span className="hidden md:inline text-slate-300 font-normal">
                Ministry of Education · AICTE Regulatory Division
              </span>
            </p>
          </div>

          {/* Utility Controls: Helpline, Accessibility, Language */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-[11px]">
            {/* Standard GFR Conformance Text */}
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Standard GFR Rule 194 Conformance</span>
            </div>

            {/* Helpline & Support Button */}
            <button
              type="button"
              onClick={() => setShowHelpline(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Official Regulatory Helpline"
            >
              <Phone className="w-3 h-3 text-slate-300" />
              <span className="font-semibold text-[10.5px]">Helpline</span>
            </button>

            {/* Accessibility Font Size Controls */}
            <div className="hidden sm:flex items-center border border-slate-600 rounded overflow-hidden text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleFontChange(-1)}
                className={clsx('px-1.5 py-0.5 hover:bg-slate-700', fontSizeIndex === 0 && 'bg-slate-700 text-amber-300')}
                title="Decrease Text Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontChange(0)}
                className={clsx('px-1.5 py-0.5 border-x border-slate-600 hover:bg-slate-700', fontSizeIndex === 1 && 'bg-slate-700 text-amber-300')}
                title="Standard Text Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontChange(1)}
                className={clsx('px-1.5 py-0.5 hover:bg-slate-700', fontSizeIndex === 2 && 'bg-slate-700 text-amber-300')}
                title="Increase Text Size"
              >
                A+
              </button>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-2 py-0.5 border border-slate-600 rounded hover:bg-slate-700 font-bold text-[10px] text-slate-200"
              title="Toggle Language Display"
            >
              {lang === 'EN' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Helpline & Support Modal */}
      {showHelpline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="helpline-modal-title"
            className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-md w-full overflow-hidden text-slate-900"
          >
            <div className="bg-[#0b2545] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <h3 id="helpline-modal-title" className="text-sm font-bold tracking-wide">
                  Regulatory Verification Support Desk
                </h3>
              </div>
              <button
                onClick={() => setShowHelpline(false)}
                className="text-slate-300 hover:text-white p-1 rounded"
                aria-label="Close helpline dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs leading-relaxed">
              <p className="text-slate-600">
                For regulatory compliance guidance, checklist verification inquiries, or institutional portal assistance:
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#005ea2] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Toll-Free National Helpline:</span>
                    <p className="text-slate-700 font-mono font-semibold">1800-11-2026 / 011-29581000</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#005ea2] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Official Institutional Email:</span>
                    <p className="text-slate-700 font-mono">support-regulatory@onecheck.gov.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#005ea2] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Operational Hours:</span>
                    <p className="text-slate-700">09:30 AM to 05:30 PM IST (Monday to Friday)</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
                <span className="font-bold block mb-0.5">Statutory Disclaimer:</span>
                Support officers cannot alter automated finding dispositions or bypass approval bands without official authorization.
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setShowHelpline(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// 2. Tricolor Ribbon Line
// ==========================================

export const TricolorBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('h-[3px] w-full flex shrink-0', className)} aria-hidden="true">
      <div className="w-1/3 bg-[#FF9933]" />
      <div className="w-1/3 bg-white" />
      <div className="w-1/3 bg-[#138808]" />
    </div>
  );
};

// ==========================================
// 3. Breadcrumbs Component
// ==========================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const PageBreadcrumbs: React.FC<{ items: BreadcrumbItem[]; className?: string }> = ({
  items,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={clsx('text-xs text-slate-600 mb-3', className)}>
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <a href="/" className="hover:text-[#005ea2] hover:underline font-medium">
            Home
          </a>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="text-slate-400" aria-hidden="true">
                /
              </span>
              {isLast || !item.href ? (
                <span className="font-bold text-slate-900" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="hover:text-[#005ea2] hover:underline font-medium">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ==========================================
// 4. Page Header Component
// ==========================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={clsx('mb-6 border-b border-slate-200 pb-4', className)}>
      {breadcrumbs && <PageBreadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0b2545] tracking-tight">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};

// ==========================================
// 5. Buttons & Action Components
// ==========================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#005ea2] hover:bg-[#0b4778] active:bg-[#08365b] text-white focus-visible:ring-[#005ea2] shadow-2xs',
    secondary: 'bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white focus-visible:ring-slate-700 shadow-2xs',
    outline: 'border border-slate-300 hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 text-slate-800 bg-white focus-visible:ring-slate-400',
    danger: 'bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white focus-visible:ring-rose-600 shadow-2xs',
    text: 'text-[#005ea2] hover:text-[#0b4778] hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-[#005ea2]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export const PrimaryButton: React.FC<ButtonProps> = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton: React.FC<ButtonProps> = (props) => <Button variant="secondary" {...props} />;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  icon: React.ReactNode;
  size?: 'sm' | 'md';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[#005ea2] disabled:opacity-50',
        size === 'sm' ? 'p-1.5' : 'p-2',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

// ==========================================
// 6. Form Fields & Inputs
// ==========================================

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className,
}) => {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined;

  return (
    <div className={clsx('space-y-1', className)}>
      <label htmlFor={htmlFor} className="block text-xs font-bold text-slate-800">
        {label}
        {required && (
          <span className="text-rose-600 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onClear, className, ...props }) => {
  return (
    <div className="relative flex items-center w-full">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        className={clsx(
          'w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005ea2] focus:border-[#005ea2]',
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Clear search text"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ options, className, ...props }) => {
  return (
    <div className="relative">
      <select
        className={clsx(
          'appearance-none w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 pr-8 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#005ea2] focus:border-[#005ea2] cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};

export interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = 'application/pdf,image/png,image/jpeg',
  maxSizeMB = 10,
  label = 'Upload Regulatory Document',
  helperText = 'Supported formats: PDF, JPEG, PNG (Max 10MB)',
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={clsx(
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150',
        dragActive
          ? 'border-[#005ea2] bg-blue-50/70'
          : 'border-slate-300 hover:border-slate-400 bg-slate-50/60',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
      />
      <UploadCloud className="w-8 h-8 text-[#005ea2] mx-auto mb-2" aria-hidden="true" />
      <span className="text-xs font-bold text-slate-900 block mb-0.5">{label}</span>
      <p className="text-[11px] text-slate-500">{helperText}</p>
    </div>
  );
};

// ==========================================
// 7. Tabs Component
// ==========================================

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={clsx('border-b border-slate-300', className)} role="tablist">
      <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'whitespace-nowrap py-2.5 px-3.5 text-xs font-bold rounded-t-md transition-colors flex items-center gap-2 border-b-2 cursor-pointer',
                isActive
                  ? 'border-[#005ea2] text-[#005ea2] bg-white border-t border-x border-slate-300 -mb-px'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={clsx(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-[#005ea2] text-white' : 'bg-slate-200 text-slate-700'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// ==========================================
// 8. Filter Bar Component
// ==========================================

export interface ActiveFilterTag {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchClear: () => void;
  searchPlaceholder?: string;
  filtersSlot?: React.ReactNode;
  activeTags?: ActiveFilterTag[];
  onClearAll?: () => void;
  totalCount?: number;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search records...',
  filtersSlot,
  activeTags = [],
  onClearAll,
  totalCount,
  className,
}) => {
  return (
    <div className={clsx('bg-white border border-slate-300 rounded-md p-3 space-y-2.5 shadow-2xs', className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={onSearchClear}
          />
        </div>

        {/* Dropdowns slot */}
        {filtersSlot && <div className="flex items-center gap-2 flex-wrap">{filtersSlot}</div>}

        {/* Total records count */}
        {typeof totalCount === 'number' && (
          <div className="text-xs text-slate-500 font-medium shrink-0 text-right">
            Total records: <span className="font-bold text-slate-900 font-mono">{totalCount}</span>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200 text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Active Filters:</span>
          {activeTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-medium"
            >
              <span>{tag.label}</span>
              <button
                type="button"
                onClick={tag.onRemove}
                className="hover:text-rose-700"
                aria-label={`Remove filter ${tag.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] text-[#005ea2] hover:underline font-bold ml-1"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. Pagination Component
// ==========================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}) => {
  if (totalRecords === 0) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div
      className={clsx(
        'px-4 py-3 bg-white border border-slate-300 rounded-b-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700',
        className
      )}
    >
      <div>
        Showing <span className="font-bold text-slate-900 font-mono">{startRecord}</span> to{' '}
        <span className="font-bold text-slate-900 font-mono">{endRecord}</span> of{' '}
        <span className="font-bold text-slate-900 font-mono">{totalRecords}</span> entries
      </div>

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <div className="flex items-center gap-1 mr-2 text-[11px]">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-slate-300 rounded px-1.5 py-0.5 text-xs bg-white font-medium cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            className="p-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="First Page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 py-0.5 font-bold font-mono text-slate-900 text-xs">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            className="p-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Last Page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. Data Table Component
// ==========================================

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  isLoading,
  emptyState,
  className,
}: DataTableProps<T>) {
  return (
    <div className={clsx('overflow-x-auto border border-slate-300 rounded-t-md bg-white shadow-2xs', className)}>
      <table className="w-full text-left text-xs text-slate-800">
        <thead className="bg-[#0b2545] text-white border-b border-slate-700 text-[11px] font-bold uppercase tracking-wider">
          <tr>
            {columns.map((col) => {
              const isSorted = sortColumn === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={clsx(
                    'px-4 py-3',
                    col.sortable && 'cursor-pointer hover:bg-slate-800 select-none',
                    col.className
                  )}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                          )
                        ) : (
                          <ChevronDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#005ea2]" />
                <p>Loading regulatory records...</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-0">
                {emptyState || (
                  <div className="p-8 text-center text-slate-500">
                    <p className="font-semibold">No records found matching current criteria.</p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr
                key={keyExtractor(item)}
                className={clsx(
                  'hover:bg-blue-50/40 transition-colors',
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-4 py-3 align-middle', col.className)}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// 11. Empty, Error, Loading States
// ==========================================

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}> = ({ title, description, actionText, onAction, className }) => {
  return (
    <div
      data-testid="empty-state"
      className={clsx(
        'p-10 text-center border-2 border-dashed border-slate-300 rounded-lg bg-white my-4',
        className
      )}
    >
      <FolderX className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ title = 'Regulatory Service Interruption', message, onRetry, className }) => {
  return (
    <div
      data-testid="error-state"
      role="alert"
      className={clsx(
        'p-6 border border-rose-200 bg-rose-50/70 rounded-lg text-slate-800 my-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-rose-950 mb-1">{title}</h4>
          <p className="text-xs sm:text-sm text-slate-700 mb-3">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="bg-white text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry Operation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Processing verification request...',
  className,
}) => {
  return (
    <div className={clsx('p-12 text-center text-slate-600', className)}>
      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#005ea2] mb-3" aria-hidden="true" />
      <p className="text-xs font-semibold text-slate-700">{message}</p>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      data-testid="skeleton"
      className={clsx('animate-pulse bg-slate-200 rounded', className)}
    />
  );
};

// ==========================================
// 12. Modal & Confirmation Dialog
// ==========================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={clsx(
          'bg-white rounded-lg border border-slate-300 shadow-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150',
          maxWidths[maxWidth]
        )}
      >
        <div className="px-6 py-3.5 bg-[#0b2545] text-white flex items-center justify-between">
          <h3 id="modal-title" className="text-sm font-bold tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white text-base leading-none p-1 rounded cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        {isDangerous ? (
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <HelpCircle className="w-5 h-5 text-[#005ea2] shrink-0 mt-0.5" />
        )}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
};

// ==========================================
// 13. Official Portal Footer
// ==========================================

export const AppFooter: React.FC = () => {
  return (
    <footer className="bg-[#0b2545] text-slate-300 text-xs mt-auto border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-700/80">
          {/* Institutional Identity */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <img src="/assets/logo2.png" alt="OneCheck" className="h-8 w-auto brightness-110" />
              <div>
                <span className="font-extrabold text-white text-sm tracking-wide">ONECHECK</span>
                <span className="block text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  AICTE Regulatory Verification Division
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
              Official regulatory compliance and automated documentary validation portal conforming to Standard GFR Rule 194 and AICTE Approval Process Handbook norm specifications.
            </p>
          </div>

          {/* Regulatory Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-2.5">
              Portal Governance
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <a href="#terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service & Rules
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy & Data Security
                </a>
              </li>
              <li>
                <a href="#hyperlink" className="hover:text-amber-400 transition-colors">
                  Hyperlinking Policy
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-amber-400 transition-colors">
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Conformance */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-2.5">
              Compliance Standard
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-Trust Cryptographic Ledger</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dual-Source Land & Building Cross-Check</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Real-Time SSE Event Audit Trail</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Advisory Notice */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} OneCheck — Government of India. All rights reserved.
          </div>
          <div className="text-amber-300 font-semibold text-center sm:text-right">
            Automated findings are advisory and are for review by authorized officials.
          </div>
        </div>
      </div>
    </footer>
  );
};
