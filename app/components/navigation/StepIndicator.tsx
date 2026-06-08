"use client";

import { CheckIcon } from "../icons";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-vscode-tab)] border-b border-[var(--color-vscode-border)] overflow-x-auto" role="tablist" aria-label="Tutorial steps">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = completedSteps.includes(i);
        const isCurrent = i === currentStep;
        const label = `Step ${i + 1}${isCurrent ? " (current)" : isCompleted ? " (completed)" : ""}`;
        return (
          <button
            key={i}
            onClick={() => onStepClick(i)}
            role="tab"
            aria-selected={isCurrent}
            aria-label={label}
            className={`flex-shrink-0 min-w-[28px] min-h-[28px] rounded-full text-[12px] font-semibold flex items-center justify-center transition-all ${
              isCurrent
                ? "bg-[var(--color-vscode-accent)] text-white step-active"
                : isCompleted
                ? "bg-[var(--color-vscode-green)] text-[#1e1e1e]"
                : "bg-[var(--color-vscode-sidebar-active)] text-[var(--color-vscode-text-muted)]"
            } hover:opacity-80`}
            title={label}
          >
            {isCompleted ? (
              <CheckIcon size={12} />
            ) : (
              i + 1
            )}
          </button>
        );
      })}
    </div>
  );
}
