"use client";

import { useEffect, useRef, useState } from "react";
import { StepFile } from "@/lib/types";
import { getFileIcon } from "../icons";

interface CodeViewerProps {
  files: StepFile[];
}

// Simple syntax highlighting for code display
function highlightCode(code: string, language: string): string {
  // Escape HTML first
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let result = escaped;

  // Keywords (C, bitbake, makefile, shell)
  const cKeywords =
    /\b(#include|#define|#ifndef|#endif|static|const|struct|enum|int|char|void|long|s64|size_t|ssize_t|unsigned|return|if|else|for|while|switch|case|default|break|continue|sizeof|NULL|true|false)\b/g;
  const cTypes =
    /\b(FILE|size_t|ssize_t|u8|u16|u32|u64|s8|s16|s32|s64|bool)\b/g;
  const bitbakeKeywords =
    /\b(inherit|DEPENDS|RDEPENDS|SRC_URI|LICENSE|LIC_FILES_CHKSUM|SUMMARY|DESCRIPTION|S|do_compile|do_install|FILES|KERNEL_MODULE_AUTOLOAD|IMAGE_INSTALL|IMAGE_FSTYPES|IMAGE_ROOTFS_SIZE|SYSTEMD_SERVICE|SYSTEMD_AUTO_ENABLE|BBPATH|BBFILES|BBFILE_COLLECTIONS|BBFILE_PATTERN|BBFILE_PRIORITY|LAYERDEPENDS|LAYERSERIES_COMPAT)\b/g;
  const strings = /"([^"\\]|\\.)*"/g;
  const comments =
    /(\/\*[\s\S]*?\*\/|\/\/.*$|#.*$)/gm;
  const numbers = /\b(\d+)\b/g;
  const preprocessor = /^(#\s*\w+.*)$/gm;
  const functions = /\b([a-zA-Z_]\w*)\s*\(/g;

  // Refined syntax color palette
  const SYN = {
    comment: "text-[#546e7a] italic",
    string: "text-[#c3e88d]",
    keyword: "text-[#c792ea]",
    function: "text-[#82aaff]",
    type: "text-[#ffcb6b]",
    number: "text-[#f78c6c]",
    preprocessor: "text-[#89ddff]",
    variable: "text-[#eeffff]",
    bitbakeKw: "text-[#7c9ce0]",
  };

  // Apply highlighting layers
  if (language === "c") {
    result = result.replace(comments, `<span class="${SYN.comment}">$1</span>`);
    result = result.replace(preprocessor, `<span class="${SYN.preprocessor}">$1</span>`);
    result = result.replace(strings, `<span class="${SYN.string}">$1</span>`);
    result = result.replace(cKeywords, `<span class="${SYN.keyword}">$1</span>`);
    result = result.replace(cTypes, `<span class="${SYN.type}">$1</span>`);
    result = result.replace(numbers, `<span class="${SYN.number}">$1</span>`);
    result = result.replace(functions, `<span class="${SYN.function}">$1</span>(`);
  } else if (language === "bitbake") {
    result = result.replace(comments, `<span class="${SYN.comment}">$1</span>`);
    result = result.replace(strings, `<span class="${SYN.string}">$1</span>`);
    result = result.replace(bitbakeKeywords, `<span class="${SYN.bitbakeKw} font-semibold">$1</span>`);
    result = result.replace(/\$\{[^}]+\}/g, `<span class="${SYN.variable}">$&</span>`);
  } else if (language === "makefile") {
    result = result.replace(comments, `<span class="${SYN.comment}">$1</span>`);
    result = result.replace(/\$\([^)]+\)/g, `<span class="${SYN.variable}">$&</span>`);
    result = result.replace(
      /\b(obj-m|CC|CFLAGS|TARGET|SRCS|all|clean|\.PHONY)\b/g,
      `<span class="${SYN.keyword}">$1</span>`
    );
  } else if (language === "dts") {
    result = result.replace(comments, `<span class="${SYN.comment}">$1</span>`);
    result = result.replace(strings, `<span class="${SYN.string}">$1</span>`);
    result = result.replace(
      /\b(compatible|status|fragment|target-path|__overlay__|dts-v1|plugin)\b/g,
      `<span class="${SYN.keyword}">$1</span>`
    );
  } else if (language === "ini") {
    result = result.replace(/^\[.*\]$/gm, `<span class="${SYN.keyword}">$&</span>`);
    result = result.replace(/^(\w+)=/gm, `<span class="${SYN.variable}">$1</span>=`);
  }

  return result;
}

export default function CodeViewer({ files }: CodeViewerProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const scrollRef = useRef<HTMLPreElement>(null);

  // Reset to first file when files change
  useEffect(() => {
    const activeIdx = files.findIndex((f) => f.active);
    setActiveFileIndex(activeIdx >= 0 ? activeIdx : 0);
  }, [files]);

  const activeFile = files[activeFileIndex];
  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--color-vscode-text-muted)]">
        <p className="text-sm">No files to display for this step.</p>
      </div>
    );
  }

  const lines = activeFile.content.split("\n");

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      {files.length > 1 && (
        <div className="flex bg-[var(--color-vscode-tab)] border-b border-[var(--color-vscode-border)]">
          {files.map((file, i) => (
            <button
              key={file.path}
              onClick={() => setActiveFileIndex(i)}
              className={`px-4 py-[6px] text-[12px] border-r border-[var(--color-vscode-border)] flex items-center gap-2 ${
                i === activeFileIndex
                  ? "bg-[var(--color-vscode-tab-active)] text-[var(--color-vscode-text)] border-t-2 border-t-[var(--color-vscode-accent)]"
                  : "text-[var(--color-vscode-text-muted)] hover:bg-[var(--color-vscode-sidebar-active)]"
              }`}
            >
              <span className="text-[10px]">
                {getFileIcon(file.path, 12)}
              </span>
              <span className="truncate max-w-[160px]">
                {file.path.split("/").pop()}
              </span>
            </button>
          ))}
        </div>
      )}
      {/* File path bar */}
      <div className="px-4 py-[2px] text-[11px] text-[var(--color-vscode-text-muted)] bg-[var(--color-vscode-tab)] border-b border-[var(--color-vscode-border)]">
        {activeFile.path}
      </div>
      {/* Code */}
      <pre
        ref={scrollRef}
        className="flex-1 overflow-auto code-scrollbar p-0 m-0 text-[13px] leading-[1.6] max-w-full"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, i) => (
              <tr
                key={i}
                className="hover:bg-[#2a2d2e]"
              >
                <td className="text-right pr-4 pl-4 text-[#858585] select-none w-12 align-top border-r border-[var(--color-vscode-border)] text-[12px] leading-[1.6]">
                  {i + 1}
                </td>
                <td className="pl-4 whitespace-pre-wrap [overflow-wrap:anywhere]">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line, activeFile.language),
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </pre>
    </div>
  );
}
