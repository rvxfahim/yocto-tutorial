"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { PlaybackState } from "@/lib/useTerminal";
import { PlayIcon, PauseIcon, StopIcon, TrashIcon, CheckIcon } from "../icons";

interface TerminalProps {
  onTerminalReady: (writeFn: (text: string) => void) => void;
  playbackState: PlaybackState;
  onPlay: (speed: number) => void;
  onPause: () => void;
  onResume: (speed: number) => void;
  onStop: () => void;
  hasSequence: boolean;
}

export default function Terminal({
  onTerminalReady,
  playbackState,
  onPlay,
  onPause,
  onResume,
  onStop,
  hasSequence,
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: "bar",
      fontSize: 13,
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      theme: {
        background: "#0d0e10",
        foreground: "#d4d6da",
        cursor: "#d4d6da",
        selectionBackground: "#264f78",
        black: "#0d0e10",
        red: "#f85149",
        green: "#3fb950",
        yellow: "#d29922",
        blue: "#3399ff",
        magenta: "#c792ea",
        cyan: "#58a6ff",
        white: "#d4d6da",
        brightBlack: "#6b6e77",
        brightRed: "#f85149",
        brightGreen: "#3fb950",
        brightYellow: "#d29922",
        brightBlue: "#3399ff",
        brightMagenta: "#c792ea",
        brightCyan: "#58a6ff",
        brightWhite: "#eeffff",
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Expose write function to parent
    const writeFn = (text: string) => {
      if (text != null && xtermRef.current) {
        try {
          xtermRef.current.write(text);
        } catch {
          // Terminal may be disposed during StrictMode remount
        }
      }
    };
    onTerminalReady(writeFn);

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch {
        // Fit may fail during layout transitions
      }
    };
    window.addEventListener("resize", handleResize);

    // ResizeObserver for panel resizes that don't trigger window resize
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // Fit may fail during transitions
      }
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      term.dispose();
      xtermRef.current = null;
    };
  }, [onTerminalReady]);

  // Clear terminal
  const handleClear = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Terminal toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-vscode-tab)] border-b border-[var(--color-vscode-border)] text-[12px]">
        <span className="text-[var(--color-vscode-text-muted)] uppercase tracking-wider font-semibold">
          Terminal
        </span>
        <div className="flex items-center gap-2">
          {/* Speed control */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Playback speed"
            className="bg-[var(--color-vscode-sidebar)] text-[var(--color-vscode-text)] text-[12px] px-1.5 py-1 border border-[var(--color-vscode-border)] rounded"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
          </select>
          {/* Playback controls */}
          {hasSequence && (
            <>
              {playbackState === "idle" && (
                <button
                  onClick={() => onPlay(speed)}
                  aria-label="Play terminal output"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--color-vscode-accent)] text-white rounded text-[12px] hover:bg-[var(--color-vscode-accent-hover)] transition-colors"
                >
                  <PlayIcon size={12} /> Play
                </button>
              )}
              {playbackState === "playing" && (
                <button
                  onClick={onPause}
                  aria-label="Pause terminal output"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--color-vscode-yellow)] text-[#1e1e1e] rounded text-[12px]"
                >
                  <PauseIcon size={12} /> Pause
                </button>
              )}
              {playbackState === "paused" && (
                <button
                  onClick={() => onResume(speed)}
                  aria-label="Resume terminal output"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--color-vscode-accent)] text-white rounded text-[12px]"
                >
                  <PlayIcon size={12} /> Resume
                </button>
              )}
              {(playbackState === "playing" || playbackState === "paused") && (
                <button
                  onClick={onStop}
                  aria-label="Stop terminal output"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--color-vscode-red)] text-white rounded text-[12px]"
                >
                  <StopIcon size={12} /> Stop
                </button>
              )}
            </>
          )}
          {playbackState === "done" && (
            <span className="text-[var(--color-vscode-green)] text-[12px] inline-flex items-center gap-1">
              <CheckIcon size={12} /> Done
            </span>
          )}
          <button
            onClick={handleClear}
            aria-label="Clear terminal"
            className="inline-flex items-center px-2 py-1.5 text-[var(--color-vscode-text-muted)] hover:text-[var(--color-vscode-text)] text-[12px] transition-colors"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
      {/* xterm.js container */}
      <div ref={terminalRef} className="flex-1 overflow-hidden" />
    </div>
  );
}
