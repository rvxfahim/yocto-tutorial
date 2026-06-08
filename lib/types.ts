import { ReactNode } from "react";

// --------------- Terminal types ---------------

export interface TerminalLine {
  type: "command" | "output" | "info" | "error";
  text: string;
  delay?: number; // ms to wait before this line appears
}

export interface TerminalSequence {
  lines: TerminalLine[];
  prompt?: string; // custom prompt, defaults to "$"
}

// --------------- Step types ---------------

export interface StepGlossaryTerm {
  term: string;
  definition: string;
}

export interface StepContent {
  title: string;
  objective: string; // The "what to do" — shown prominently
  why: string; // Expandable "why this matters"
  tips?: string[]; // Gotchas / best practices
  alternatives?: string; // Alternative approaches
  glossaryTerms?: StepGlossaryTerm[]; // Terms to highlight with tooltips
}

export interface StepFile {
  path: string;
  content: string;
  language: string;
  active?: boolean; // Whether this file is open/viewed by default
}

export interface StepDefinition {
  id: number;
  phase: string;
  content: StepContent;
  terminal: TerminalSequence;
  files: StepFile[]; // Code files to show in the viewer
  diagramId?: string; // PlantUML diagram to show at this step
  fileTreeKey: string; // Key into file-trees.ts
}

// --------------- File tree types ---------------

export interface FileTreeNode {
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  language?: string; // For files: the language for syntax highlighting
}

export interface FileTree {
  root: FileTreeNode;
}

// --------------- Glossary types ---------------

export interface GlossaryEntry {
  term: string;
  definition: string;
  aliases?: string[];
  category: string;
}

// --------------- Diagram types ---------------

export interface DiagramMeta {
  id: string;
  title: string;
  description: string;
  svgPath: string; // e.g., "/diagrams/architecture_overview.svg"
  stepId?: number; // Which step it's most relevant to
}

// --------------- Progress types ---------------

export interface TutorialProgress {
  completedSteps: number[];
  lastVisitedStep: number;
  lastVisitedAt: string; // ISO date string
}

// --------------- App state ---------------

export type AppView = "welcome" | "tutorial" | "completion";
