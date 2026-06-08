"use client";

import { FileTreeNode as FileTreeNodeType } from "@/lib/types";
import FileTreeNodeComponent from "./FileTreeNode";

interface FileTreeProps {
  root: FileTreeNodeType;
  onFileClick?: (path: string) => void;
  activeFilePath?: string;
}

export default function FileTree({
  root,
  onFileClick,
  activeFilePath,
}: FileTreeProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-vscode-text-muted)] select-none">
        <span>Explorer</span>
      </div>
      {/* Tree */}
      <div className="flex-1 overflow-y-auto tree-scrollbar px-1 pb-4">
        {root.children?.map((child) => (
          <FileTreeNodeComponent
            key={child.name}
            node={child}
            depth={0}
            onFileClick={onFileClick}
            activeFilePath={activeFilePath}
            parentPath=""
          />
        ))}
      </div>
    </div>
  );
}
