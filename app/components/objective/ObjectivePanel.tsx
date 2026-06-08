"use client";

import { StepDefinition } from "@/lib/types";
import { glossary } from "@/data/glossary";
import GlossaryTooltip from "../glossary/GlossaryTooltip";
import DiagramViewer from "../diagrams/DiagramViewer";
import { diagrams } from "@/data/diagrams";
import { TargetIcon, LightbulbIcon, RefreshIcon } from "../icons";

interface ObjectivePanelProps {
  step: StepDefinition;
  stepNumber: number;
  totalSteps: number;
}

export default function ObjectivePanel({
  step,
  stepNumber,
  totalSteps,
}: ObjectivePanelProps) {
  const diagram = step.diagramId
    ? diagrams.find((d) => d.id === step.diagramId)
    : null;

  // Process content text to add glossary tooltips
  const renderWithGlossary = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;

    // Find glossary terms in the text and wrap them
        const allTerms = [...glossary, ...(step.content.glossaryTerms?.map((gt) => ({
      term: gt.term,
      definition: gt.definition,
      aliases: [] as string[],
      category: "Step",
    })) ?? [])];

    // Sort by length (longest first) to avoid partial matches
    const sorted = allTerms.sort((a, b) => b.term.length - a.term.length);
    const seen = new Set<string>();

    let i = 0;
    while (remaining.length > 0 && i < 100) {
      i++;
      let matched = false;
      for (const entry of sorted) {
        const idx = remaining.indexOf(entry.term);
        if (idx >= 0 && !seen.has(entry.term + idx)) {
          // Add text before the match
          if (idx > 0) {
            parts.push(remaining.slice(0, idx));
          }
          // Add the tooltip-wrapped term
          parts.push(
            <GlossaryTooltip
              key={`${entry.term}-${idx}`}
              term={entry.term}
              definition={entry.definition}
            />
          );
          seen.add(entry.term + idx);
          remaining = remaining.slice(idx + entry.term.length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        parts.push(remaining);
        break;
      }
    }

    return parts;
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto code-scrollbar">
      {/* Step header */}
      <div className="px-5 pt-5 pb-3 border-b border-[var(--color-vscode-border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-accent)]">
            {step.phase}
          </span>
          <span className="text-[12px] text-[var(--color-vscode-text-muted)]">
            Step {stepNumber + 1} of {totalSteps}
          </span>
        </div>
        <h2
          className="text-[16px] font-semibold text-[var(--color-vscode-text)] leading-tight"
          aria-live="polite"
          aria-atomic="true"
        >
          {step.content.title}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 space-y-4">
        {/* Objective */}
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-text-muted)] mb-1 inline-flex items-center gap-1.5">
            <TargetIcon size={12} className="text-[var(--color-accent)]" /> Objective
          </h3>
          <p className="text-[13px] leading-relaxed text-[var(--color-vscode-text)]">
            {renderWithGlossary(step.content.objective)}
          </p>
        </div>

        {/* Why */}
        <details className="group">
          <summary className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-text-muted)] cursor-pointer hover:text-[var(--color-vscode-text)] select-none inline-flex items-center gap-1.5">
            <LightbulbIcon size={12} className="text-[var(--color-warning)]" /> Why this matters
          </summary>
          <div className="mt-2 text-[12px] leading-relaxed text-[var(--color-vscode-text-muted)] space-y-2">
            {step.content.why.split("\n\n").map((para, i) => (
              <p key={i}>{renderWithGlossary(para)}</p>
            ))}
          </div>
        </details>

        {/* Tips */}
        {step.content.tips && step.content.tips.length > 0 && (
          <details className="group" open>
            <summary className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-yellow)] cursor-pointer hover:opacity-80 select-none inline-flex items-center gap-1.5">
              <LightbulbIcon size={12} /> Tips &amp; Gotchas
            </summary>
            <ul className="mt-2 space-y-1.5">
              {step.content.tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-[12px] text-[var(--color-vscode-text-muted)] leading-relaxed flex gap-2"
                >
                  <span className="text-[var(--color-vscode-yellow)] flex-shrink-0">
                    ▸
                  </span>
                  <span>{renderWithGlossary(tip)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Alternatives */}
        {step.content.alternatives && (
          <details className="group">
            <summary className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-purple)] cursor-pointer hover:opacity-80 select-none inline-flex items-center gap-1.5">
              <RefreshIcon size={12} /> Alternative Approaches
            </summary>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-vscode-text-muted)]">
              {renderWithGlossary(step.content.alternatives)}
            </p>
          </details>
        )}

        {/* Diagram */}
        {diagram && (
          <div className="border-t border-[var(--color-vscode-border)] pt-4">
            <DiagramViewer diagram={diagram} />
          </div>
        )}
      </div>
    </div>
  );
}
