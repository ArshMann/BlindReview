import type { ReactNode } from 'react';

interface ScrollableListProps {
  children: ReactNode;
  height?: number;
  label: string;
  className?: string;
}

export default function ScrollableList({
  children,
  height = 420,
  label,
  className = '',
}: ScrollableListProps) {
  const combinedClass = ['br-submissions-scroll', className].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClass}
      style={{ height }}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
