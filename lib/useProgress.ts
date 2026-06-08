"use client";

import { useState, useEffect, useCallback } from "react";
import { TutorialProgress } from "@/lib/types";

const STORAGE_KEY = "yocto-tutorial-progress";

function getDefaultProgress(): TutorialProgress {
  return {
    completedSteps: [],
    lastVisitedStep: 0,
    lastVisitedAt: new Date().toISOString(),
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<TutorialProgress>(getDefaultProgress());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TutorialProgress;
        setProgress(parsed);
      }
    } catch {
      // Corrupted data — use defaults
    }
    setLoaded(true);
  }, []);

  const save = useCallback((updater: (prev: TutorialProgress) => TutorialProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage full or unavailable
      }
      return next;
    });
  }, []);

  const markStepCompleted = useCallback(
    (stepId: number) => {
      save((prev) => ({
        ...prev,
        completedSteps: prev.completedSteps.includes(stepId)
          ? prev.completedSteps
          : [...prev.completedSteps, stepId],
        lastVisitedStep: stepId,
        lastVisitedAt: new Date().toISOString(),
      }));
    },
    [save]
  );

  const setLastVisited = useCallback(
    (stepId: number) => {
      save((prev) => ({
        ...prev,
        lastVisitedStep: stepId,
        lastVisitedAt: new Date().toISOString(),
      }));
    },
    [save]
  );

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setProgress(getDefaultProgress());
  }, []);

  const isStepCompleted = useCallback(
    (stepId: number) => progress.completedSteps.includes(stepId),
    [progress.completedSteps]
  );

  return {
    progress,
    loaded,
    markStepCompleted,
    setLastVisited,
    resetProgress,
    isStepCompleted,
  };
}
