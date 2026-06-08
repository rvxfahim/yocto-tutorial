"use client";

import { useCallback, useRef, useState } from "react";
import { TerminalSequence } from "@/lib/types";

export type PlaybackState = "idle" | "playing" | "paused" | "done";

export function useTerminal(onWrite: (text: string) => void) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const abortRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLineIndexRef = useRef(0);
  const pausedAtIndexRef = useRef(0);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const play = useCallback(
    async (sequence: TerminalSequence, speedMultiplier = 1) => {
      // Abort any in-progress playback
      abortRef.current = true;
      clearTimeouts();
      // Give time for the abort to flush
      await new Promise((r) => setTimeout(r, 50));

      abortRef.current = false;
      setPlaybackState("playing");

      const prompt = sequence.prompt ?? "$ ";
      let lineIndex = 0;

      for (const line of sequence.lines) {
        if (abortRef.current) {
          setPlaybackState("idle");
          return;
        }

        currentLineIndexRef.current = lineIndex;
        const delay = (line.delay ?? 300) / speedMultiplier;

        if (line.type === "command") {
          // Type out the command character by character
          onWrite(prompt);
          for (const ch of line.text) {
            if (abortRef.current) {
              setPlaybackState("idle");
              return;
            }
            onWrite(ch);
            await new Promise((r) => {
              timeoutRef.current = setTimeout(r, 20 / speedMultiplier);
            });
          }
          onWrite("\r\n");
          await new Promise((r) => {
            timeoutRef.current = setTimeout(r, 100 / speedMultiplier);
          });
        } else {
          // Output lines — print with a short delay between lines for realism
          onWrite(line.text + "\r\n");
          await new Promise((r) => {
            timeoutRef.current = setTimeout(r, delay);
          });
        }
        lineIndex++;
      }

      if (!abortRef.current) {
        setPlaybackState("done");
      }
    },
    [onWrite, clearTimeouts]
  );

  const pause = useCallback(() => {
    abortRef.current = true;
    clearTimeouts();
    pausedAtIndexRef.current = currentLineIndexRef.current;
    setPlaybackState("paused");
  }, [clearTimeouts]);

  const resume = useCallback(
    async (sequence: TerminalSequence, fromLineIndex: number, speedMultiplier = 1) => {
      abortRef.current = false;
      setPlaybackState("playing");

      const prompt = sequence.prompt ?? "$ ";
      let lineIndex = fromLineIndex;

      for (let i = fromLineIndex; i < sequence.lines.length; i++) {
        if (abortRef.current) {
          setPlaybackState("idle");
          return;
        }

        const line = sequence.lines[i];
        currentLineIndexRef.current = lineIndex;
        const delay = (line.delay ?? 300) / speedMultiplier;

        if (line.type === "command") {
          onWrite(prompt);
          for (const ch of line.text) {
            if (abortRef.current) {
              setPlaybackState("idle");
              return;
            }
            onWrite(ch);
            await new Promise((r) => {
              timeoutRef.current = setTimeout(r, 20 / speedMultiplier);
            });
          }
          onWrite("\r\n");
          await new Promise((r) => {
            timeoutRef.current = setTimeout(r, 100 / speedMultiplier);
          });
        } else {
          onWrite(line.text + "\r\n");
          await new Promise((r) => {
            timeoutRef.current = setTimeout(r, delay);
          });
        }
        lineIndex++;
      }

      if (!abortRef.current) {
        setPlaybackState("done");
      }
    },
    [onWrite]
  );

  const stop = useCallback(() => {
    abortRef.current = true;
    clearTimeouts();
    setPlaybackState("idle");
  }, [clearTimeouts]);

  return { playbackState, play, pause, resume, stop, pausedAtIndex: pausedAtIndexRef };
}
