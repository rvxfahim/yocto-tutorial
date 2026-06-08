"use client";

import { useState } from "react";
import { DiagramMeta } from "@/lib/types";
import { ChartIcon } from "../icons";

interface DiagramViewerProps {
  diagram: DiagramMeta;
}

export default function DiagramViewer({ diagram }: DiagramViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-vscode-text-muted)] inline-flex items-center gap-1.5">
          <ChartIcon size={12} /> {diagram.title}
        </h4>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-[var(--color-vscode-accent)] hover:underline"
        >
          {expanded ? "Collapse" : "View Diagram"}
        </button>
      </div>
      <p className="text-[11px] text-[var(--color-vscode-text-muted)] mb-2">
        {diagram.description}
      </p>
      {expanded && (
        <div className="border border-[var(--color-vscode-border)] rounded overflow-hidden bg-white">
          {imgError ? (
            <div className="p-4 text-center text-[12px] text-[var(--color-vscode-text-muted)]">
              <p>Diagram SVG not found.</p>
              <p className="mt-1 text-[11px]">
                Run the PlantUML generation step to create diagram SVGs.
              </p>
            </div>
          ) : (
            <img
              src={diagram.svgPath}
              alt={diagram.title}
              className="w-full h-auto"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
