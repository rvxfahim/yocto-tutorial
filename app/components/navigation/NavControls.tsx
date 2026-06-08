"use client";

import { RestartIcon } from "../icons";

interface NavControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function NavControls({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onRestart,
  isFirst,
  isLast,
}: NavControlsProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-vscode-tab)] border-t border-[var(--color-vscode-border)]">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Previous step"
          className="px-3 py-2 text-[12px] bg-[var(--color-vscode-sidebar-active)] text-[var(--color-vscode-text)] rounded hover:bg-[var(--color-vscode-border)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          aria-label="Next step"
          className="px-3 py-2 text-[12px] bg-[var(--color-vscode-accent)] text-white rounded hover:bg-[var(--color-vscode-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-[var(--color-vscode-text-muted)]" aria-live="polite">
          {currentStep + 1} / {totalSteps}
        </span>
        <button
          onClick={onRestart}
          aria-label="Restart tutorial"
          className="text-[12px] text-[var(--color-vscode-text-muted)] hover:text-[var(--color-vscode-red)] transition-colors inline-flex items-center gap-1"
        >
          <RestartIcon size={12} /> Restart
        </button>
      </div>
    </div>
  );
}
