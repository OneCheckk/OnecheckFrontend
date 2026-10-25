import React from 'react';
import clsx from 'clsx';
import type { BBox } from '@contracts';

export interface BBoxPercentageStyle {
  left: string;
  top: string;
  width: string;
  height: string;
}

/**
 * Calculates percentage-based position and dimensions for bounding box overlays.
 * Coordinates are normalized from 0 to 1 with origin at top-left.
 * bbox: [x0, y0, x1, y1]
 */
export function calculateBBoxPercentages(bbox: BBox): BBoxPercentageStyle {
  const [x0, y0, x1, y1] = bbox;
  return {
    left: `${Math.max(0, Math.min(1, x0)) * 100}%`,
    top: `${Math.max(0, Math.min(1, y0)) * 100}%`,
    width: `${Math.max(0, Math.min(1, x1 - x0)) * 100}%`,
    height: `${Math.max(0, Math.min(1, y1 - y0)) * 100}%`,
  };
}

interface BBoxOverlayProps {
  bbox: BBox;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BBoxOverlay: React.FC<BBoxOverlayProps> = ({
  bbox,
  title,
  isSelected = false,
  onClick,
  className,
}) => {
  const style = calculateBBoxPercentages(bbox);

  return (
    <button
      type="button"
      data-testid="evidence-bbox-overlay"
      aria-label={`Cited evidence: ${title}`}
      title={title}
      onClick={onClick}
      style={style}
      className={clsx(
        'absolute z-20 cursor-pointer transition-all rounded-[2px]',
        'border-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1',
        isSelected
          ? 'border-red-600 bg-red-500/25 animate-evidence-pulse'
          : 'border-amber-500 bg-amber-400/15 hover:bg-amber-400/30',
        className
      )}
    >
      <span className="sr-only">{title}</span>
    </button>
  );
};
