"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AppView } from "@/lib/types";
import { steps, totalSteps } from "@/data/steps";
import { codeFiles } from "@/data/code-files";
import { fileTrees } from "@/data/file-trees";
import { terminalOutput } from "@/data/terminal-output";
import { useProgress } from "@/lib/useProgress";
import { useTerminal } from "@/lib/useTerminal";

import IdeLayout from "./components/ide/IdeLayout";
import FileTree from "./components/ide/FileTree";
import CodeViewer from "./components/ide/CodeViewer";
import Terminal from "./components/ide/Terminal";
import ObjectivePanel from "./components/objective/ObjectivePanel";
import StepIndicator from "./components/navigation/StepIndicator";
import NavControls from "./components/navigation/NavControls";
import TableOfContents from "./components/navigation/TableOfContents";
import WelcomeScreen from "./components/WelcomeScreen";
import CompletionScreen from "./components/CompletionScreen";
import ResumeBanner from "./components/ResumeBanner";
import { BookOpenIcon } from "./components/icons";

export default function Home() {
  const [view, setView] = useState<AppView>("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const [showToc, setShowToc] = useState(false);

  // Use a ref for terminalWriteFn to avoid stale closures caused by
  // React StrictMode double-mounting. The state setter from Terminal's
  // onTerminalReady can be missed by effects if state updates are batched
  // during the StrictMode commit phase.
  const terminalWriteFnRef = useRef<((text: string) => void) | null>(null);
  // terminalReady forces re-renders when the terminal becomes available
  const [terminalReady, setTerminalReady] = useState(false);

  const stepRef = useRef(currentStep);
  stepRef.current = currentStep;

  const {
    progress,
    loaded,
    markStepCompleted,
    setLastVisited,
    resetProgress,
    isStepCompleted,
  } = useProgress();

  // Pass a stable callback that always reads the latest ref
  const { playbackState, play, pause, resume, stop, pausedAtIndex } =
    useTerminal((text: string) => {
      terminalWriteFnRef.current?.(text);
    });

  const step = steps[currentStep];
  const hasProgress =
    loaded && (progress.lastVisitedStep > 0 || progress.completedSteps.length > 0);

  // Refs for stable playback references
  const playRef = useRef(play);
  playRef.current = play;
  const userInteractedRef = useRef(false);

  // Called by Terminal when xterm.js is ready
  const handleTerminalReady = useCallback(
    (writeFn: (text: string) => void) => {
      terminalWriteFnRef.current = writeFn;
      setTerminalReady(true);
    },
    []
  );

  // Navigate to a step
  const goToStep = useCallback(
    (stepId: number) => {
      stop();
      setCurrentStep(stepId);
      setLastVisited(stepId);
    },
    [stop, setLastVisited]
  );

  // Mark current step complete and go to next
  const goNext = useCallback(() => {
    markStepCompleted(currentStep);
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    } else {
      // Last step completed -> completion screen
      markStepCompleted(currentStep);
      setView("completion");
    }
  }, [currentStep, markStepCompleted, goToStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  // Terminal playback handlers
  const handlePlay = useCallback(
    (speed: number = 1) => {
      if (!terminalWriteFnRef.current) return;
      userInteractedRef.current = true;
      const seq = terminalOutput[currentStep];
      if (seq && seq.lines.length > 0) {
        play(seq, speed);
      }
    },
    [currentStep, play]
  );

  const handlePause = useCallback(() => {
    userInteractedRef.current = true;
    pause();
  }, [pause]);

  const handleResume = useCallback(
    (speed: number = 1) => {
      if (!terminalWriteFnRef.current) return;
      userInteractedRef.current = true;
      const seq = terminalOutput[currentStep];
      if (seq && seq.lines.length > 0) {
        resume(seq, pausedAtIndex.current, speed);
      }
    },
    [currentStep, resume, pausedAtIndex]
  );

  const handleStop = useCallback(() => {
    userInteractedRef.current = true;
    stop();
  }, [stop]);

  // Auto-play terminal when step changes
  useEffect(() => {
    if (!terminalReady || view !== "tutorial") return;
    const seq = terminalOutput[currentStep];
    if (seq && seq.lines.length > 0) {
      // Reset user interaction flag when step changes
      userInteractedRef.current = false;
      // Small delay so the UI renders first
      const timer = setTimeout(() => {
        if (!userInteractedRef.current) {
          playRef.current(seq);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, terminalReady, view]);

  // Start tutorial
  const handleStart = useCallback(() => {
    resetProgress();
    setCurrentStep(0);
    setView("tutorial");
  }, [resetProgress]);

  const handleResumeProgress = useCallback(() => {
    const step = progress.lastVisitedStep;
    setCurrentStep(step);
    setView("tutorial");
  }, [progress.lastVisitedStep]);

  const handleRestart = useCallback(() => {
    stop();
    resetProgress();
    setCurrentStep(0);
    setView("tutorial");
  }, [stop, resetProgress]);

  const handleRestartFromCompletion = useCallback(() => {
    resetProgress();
    setCurrentStep(0);
    setView("tutorial");
  }, [resetProgress]);

  // Get current step data
  const currentFiles = codeFiles[currentStep] ?? [];
  const currentFileTree = fileTrees[step?.fileTreeKey ?? ""] ?? fileTrees["empty-project"];
  const currentTerminalSeq = terminalOutput[currentStep];

  // Welcome screen
  if (view === "welcome") {
    return (
      <WelcomeScreen
        onStart={handleStart}
        onResume={handleResumeProgress}
        lastVisitedStep={progress.lastVisitedStep}
        hasProgress={hasProgress}
      />
    );
  }

  // Completion screen
  if (view === "completion") {
    return <CompletionScreen onRestart={handleRestartFromCompletion} />;
  }

  // Tutorial view
  return (
    <main>
      <IdeLayout
        sidebar={
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 text-[12px] text-[var(--color-vscode-text-muted)] select-none">
              <button
                onClick={() => setShowToc(true)}
                aria-label="Open Table of Contents"
                className="hover:text-[var(--color-vscode-text)] transition-colors inline-flex items-center gap-1.5"
              >
                <BookOpenIcon size={12} /> Contents
              </button>
            </div>
            <FileTree root={currentFileTree} />
          </div>
        }
        editor={
          <div className="h-full flex flex-col">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              completedSteps={progress.completedSteps}
              onStepClick={goToStep}
            />
            <div className="flex-1 overflow-hidden">
              <CodeViewer files={currentFiles} />
            </div>
            <NavControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrev={goPrev}
              onNext={goNext}
              onRestart={handleRestart}
              isFirst={currentStep === 0}
              isLast={currentStep === totalSteps - 1}
            />
          </div>
        }
        terminal={
          <Terminal
            onTerminalReady={handleTerminalReady}
            playbackState={playbackState}
            onPlay={handlePlay}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            hasSequence={
              (currentTerminalSeq?.lines.length ?? 0) > 0
            }
          />
        }
        objective={
          <ObjectivePanel
            step={step}
            stepNumber={currentStep}
            totalSteps={totalSteps}
          />
        }
      />

      {/* Resume banner */}
      {hasProgress &&
        progress.lastVisitedStep !== currentStep &&
        progress.lastVisitedStep > 0 && (
          <ResumeBanner
            onResume={() => goToStep(progress.lastVisitedStep)}
            onReset={handleRestart}
            lastVisitedStep={progress.lastVisitedStep}
          />
        )}

      {/* Table of Contents sidebar */}
      {showToc && (
        <TableOfContents
          currentStep={currentStep}
          completedSteps={progress.completedSteps}
          onStepClick={(stepId) => {
            goToStep(stepId);
            setShowToc(false);
          }}
          onClose={() => setShowToc(false)}
        />
      )}
    </main>
  );
}
