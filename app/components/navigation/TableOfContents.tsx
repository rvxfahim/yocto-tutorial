"use client";

import { useEffect, useRef } from "react";
import { steps } from "@/data/steps";
import { glossary } from "@/data/glossary";
import { BookOpenIcon, BookIcon, CloseIcon, CheckIcon } from "../icons";

interface TableOfContentsProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  onClose: () => void;
}

export default function TableOfContents({
  currentStep,
  completedSteps,
  onStepClick,
  onClose,
}: TableOfContentsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Group steps by phase
  const phases = new Map<string, typeof steps>();
  for (const step of steps) {
    const existing = phases.get(step.phase);
    if (existing) {
      existing.push(step);
    } else {
      phases.set(step.phase, [step]);
    }
  }

  // Auto-focus close button and handle Escape key
  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Table of Contents"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Panel */}
      <div
        className="relative w-80 max-w-[90vw] h-full bg-[var(--color-vscode-sidebar)] border-l border-[var(--color-vscode-border)] overflow-y-auto code-scrollbar shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-vscode-border)]">
          <h2 className="text-[13px] font-semibold text-[var(--color-vscode-text)] inline-flex items-center gap-2">
            <BookOpenIcon size={14} className="text-[var(--color-accent)]" /> Table of Contents
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close table of contents"
            className="text-[var(--color-vscode-text-muted)] hover:text-[var(--color-vscode-text)] transition-colors"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Steps */}
        <div className="py-2">
          {Array.from(phases.entries()).map(([phase, phaseSteps]) => (
            <div key={phase} className="mb-2">
              <div className="px-4 py-1 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-text-muted)]">
                {phase}
              </div>
              {phaseSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => onStepClick(step.id)}
                  className={`w-full text-left px-4 py-1.5 text-[12px] flex items-center gap-2 transition-colors ${
                    step.id === currentStep
                      ? "bg-[var(--color-vscode-accent)] text-white"
                      : completedSteps.includes(step.id)
                      ? "text-[var(--color-vscode-green)] hover:bg-[var(--color-vscode-sidebar-active)]"
                      : "text-[var(--color-vscode-text-muted)] hover:bg-[var(--color-vscode-sidebar-active)] hover:text-[var(--color-vscode-text)]"
                  }`}
                >
                  <span className="w-5 text-center flex-shrink-0 text-[12px]">
                    {completedSteps.includes(step.id) ? (
                      <CheckIcon size={12} className="inline" />
                    ) : (
                      step.id + 1
                    )}
                  </span>
                  <span className="truncate">{step.content.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Glossary section */}
        <div className="border-t border-[var(--color-vscode-border)] px-4 py-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-text-muted)] mb-2 inline-flex items-center gap-1.5">
            <BookIcon size={12} /> Glossary ({glossary.length} terms)
          </h3>
          <div className="grid grid-cols-1 gap-[2px]">
            {glossary.map((entry) => (
              <details key={entry.term} className="group">
                <summary className="text-[12px] text-[var(--color-vscode-accent)] cursor-pointer hover:underline">
                  {entry.term}
                </summary>
                <p className="text-[12px] text-[var(--color-vscode-text-muted)] ml-4 mt-0.5 leading-relaxed">
                  {entry.definition}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
