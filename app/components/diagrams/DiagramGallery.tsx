"use client";

import { useState } from "react";
import { diagrams } from "@/data/diagrams";
import { ChartIcon } from "../icons";

export default function DiagramGallery() {
  const [activeDiagram, setActiveDiagram] = useState(diagrams[0]?.id ?? "");
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const handleImgError = (id: string) => {
    setImgErrors((prev) => new Set([...prev, id]));
  };

  const active = diagrams.find((d) => d.id === activeDiagram) ?? diagrams[0];

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-[var(--color-vscode-text)] mb-3 inline-flex items-center gap-2">
        <ChartIcon size={14} /> Architecture Diagrams
      </h3>

      {/* Diagram tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {diagrams.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDiagram(d.id)}
            className={`px-3 py-[4px] text-[11px] rounded transition-colors ${
              d.id === activeDiagram
                ? "bg-[var(--color-vscode-accent)] text-white"
                : "bg-[var(--color-vscode-sidebar-active)] text-[var(--color-vscode-text-muted)] hover:text-[var(--color-vscode-text)]"
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {/* Active diagram */}
      {active && (
        <div className="border border-[var(--color-vscode-border)] rounded-lg overflow-hidden bg-white">
          {imgErrors.has(active.id) ? (
            <div className="p-6 text-center text-sm text-[var(--color-vscode-text-muted)]">
              <p>SVG not found for &quot;{active.title}&quot;.</p>
              <p className="mt-2 text-xs">
                Copy SVGs from{" "}
                <code className="text-[var(--color-vscode-accent)]">
                  /home/nafis/yuhesen_ugv/meta-yuhesen_ugv/docs/diagrams/
                </code>{" "}
                to{" "}
                <code className="text-[var(--color-vscode-accent)]">
                  public/diagrams/
                </code>
              </p>
            </div>
          ) : (
            <img
              src={active.svgPath}
              alt={active.title}
              className="w-full h-auto"
              onError={() => handleImgError(active.id)}
            />
          )}
        </div>
      )}

      {/* Description */}
      {active && (
        <p className="mt-2 text-xs text-[var(--color-vscode-text-muted)] leading-relaxed">
          <strong className="text-[var(--color-vscode-text)]">
            {active.title}:
          </strong>{" "}
          {active.description}
        </p>
      )}
    </div>
  );
}
