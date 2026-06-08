"use client";

import { MapPinIcon } from "./icons";

interface ResumeBannerProps {
  onResume: () => void;
  onReset: () => void;
  lastVisitedStep: number;
}

export default function ResumeBanner({
  onResume,
  onReset,
  lastVisitedStep,
}: ResumeBannerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-[var(--color-vscode-sidebar)] border border-[var(--color-vscode-accent)] rounded-lg shadow-2xl px-4 py-3 max-w-sm animate-fade-in-up">
      <div className="flex items-start gap-3">
        <MapPinIcon size={18} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[var(--color-vscode-text)]">
            Resume from Step {lastVisitedStep + 1}?
          </p>
          <p className="text-[12px] text-[var(--color-vscode-text-muted)] mt-0.5">
            You were last here. Pick up where you left off.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onResume}
          className="flex-1 px-3 py-2 text-[12px] bg-[var(--color-vscode-accent)] text-white rounded hover:bg-[var(--color-vscode-accent-hover)] transition-colors"
        >
          Resume
        </button>
        <button
          onClick={onReset}
          className="px-3 py-2 text-[12px] bg-[var(--color-vscode-sidebar-active)] text-[var(--color-vscode-text-muted)] rounded hover:text-[var(--color-vscode-text)] transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
