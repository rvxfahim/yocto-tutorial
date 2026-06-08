"use client";

import { ReactNode } from "react";

interface IdeLayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
  terminal: ReactNode;
  objective: ReactNode;
  sidebarCollapsed?: boolean;
}

export default function IdeLayout({
  sidebar,
  editor,
  terminal,
  objective,
  sidebarCollapsed = false,
}: IdeLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--color-vscode-bg)] text-[var(--color-vscode-text)] overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — File Tree */}
        {!sidebarCollapsed && (
          <aside className="w-48 lg:w-64 min-w-[160px] lg:min-w-[200px] max-w-[400px] border-r border-[var(--color-vscode-border)] bg-[var(--color-vscode-sidebar)] flex-shrink-0 overflow-hidden panel-transition">
            {sidebar}
          </aside>
        )}

        {/* Center — Editor + Terminal stacked */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Editor area */}
          <div className="flex-1 overflow-hidden">{editor}</div>
          {/* Terminal */}
          <div className="h-[35%] min-h-[100px] border-t border-[var(--color-vscode-border)] overflow-hidden">
            {terminal}
          </div>
        </div>

        {/* Right — Objective Panel */}
        <aside className="w-64 lg:w-80 min-w-[220px] lg:min-w-[280px] max-w-[450px] border-l border-[var(--color-vscode-border)] bg-[var(--color-panel-bg)] backdrop-blur-sm flex-shrink-0 overflow-hidden panel-transition">
          {objective}
        </aside>
      </div>
    </div>
  );
}
