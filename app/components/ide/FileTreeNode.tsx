"use client";

import { useState, useCallback } from "react";
import { FileTreeNode as FileTreeNodeType } from "@/lib/types";
import {
  FolderClosedIcon,
  FolderOpenIcon,
  getFileIcon,
  ChevronRightIcon,
} from "../icons";

interface FileTreeNodeProps {
  node: FileTreeNodeType;
  depth: number;
  parentPath: string;
  onFileClick?: (path: string) => void;
  activeFilePath?: string;
}

export default function FileTreeNodeComponent({
  node,
  depth,
  parentPath,
  onFileClick,
  activeFilePath,
}: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 3);
  const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;

  const handleClick = useCallback(() => {
    if (node.type === "folder") {
      setExpanded(!expanded);
    } else {
      onFileClick?.(fullPath);
    }
  }, [node.type, expanded, fullPath, onFileClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const isActive = node.type === "file" && activeFilePath === fullPath;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={`${node.name}${node.type === "folder" ? (expanded ? ", expanded" : ", collapsed") : ""}`}
        aria-expanded={node.type === "folder" ? expanded : undefined}
        className={`flex items-center py-1 cursor-pointer select-none text-[13px] leading-[22px] hover:bg-[var(--color-vscode-sidebar-active)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] ${
          isActive ? "bg-[var(--color-vscode-sidebar-active)]" : ""
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px`, paddingRight: "8px" }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <span className="mr-1 w-4 text-center flex-shrink-0 text-[var(--color-text-tertiary)]">
          {node.type === "folder" ? (
            <ChevronRightIcon
              size={10}
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          ) : null}
        </span>
        <span className="mr-1.5 flex-shrink-0 flex items-center">
          {node.type === "folder" ? (
            expanded ? (
              <FolderOpenIcon size={14} />
            ) : (
              <FolderClosedIcon size={14} />
            )
          ) : (
            getFileIcon(node.name, 14)
          )}
        </span>
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "folder" && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNodeComponent
              key={child.name}
              node={child}
              depth={depth + 1}
              parentPath={fullPath}
              onFileClick={onFileClick}
              activeFilePath={activeFilePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
