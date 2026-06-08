"use client";

import { useState, useRef } from "react";

interface GlossaryTooltipProps {
  term: string;
  definition: string;
}

export default function GlossaryTooltip({ term, definition }: GlossaryTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 150);
  };

  return (
    <span
      className="relative inline"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span className="border-b border-dotted border-[var(--color-vscode-accent)] cursor-help text-[var(--color-vscode-text)] hover:text-[var(--color-vscode-blue)] transition-colors">
        {term}
      </span>
      {visible && (
        <span className="absolute z-50 bottom-full left-0 mb-2 w-64 px-3 py-2 bg-[#252526] border border-[var(--color-vscode-border)] rounded-md shadow-2xl text-[12px] leading-relaxed text-[var(--color-vscode-text)] pointer-events-none">
          {definition}
          <span className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[var(--color-vscode-border)]" />
        </span>
      )}
    </span>
  );
}
