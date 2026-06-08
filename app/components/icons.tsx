"use client";

import {
  FolderOpen,
  Folder,
  FileCode,
  FileCog,
  File,
  FileText,
  Settings,
  TreePine,
  Wrench,
  Zap,
  Play,
  Pause,
  Square,
  Trash2,
  Check,
  X,
  Trophy,
  Target,
  Lightbulb,
  RefreshCw,
  BookOpen,
  Book,
  BarChart3,
  MapPin,
  RotateCcw,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// --------------- Icon style tokens ---------------

const SIZE_SM = 14;
const SIZE_MD = 16;
const SIZE_LG = 20;
const SIZE_XL = 24;

type IconProps = {
  size?: number;
  className?: string;
};

// --------------- File type icons (with semantic colors) ---------------

export function CFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <FileCode size={size} className={className ?? "text-[#569cd6]"} />;
}

export function HeaderFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <FileCode size={size} className={className ?? "text-[#c792ea]"} />;
}

export function BitBakeFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <FileCog size={size} className={className ?? "text-[#ce9178]"} />;
}

export function ConfigFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <Settings size={size} className={className ?? "text-[var(--color-text-secondary)]"} />;
}

export function DtsFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <TreePine size={size} className={className ?? "text-[var(--color-success)]"} />;
}

export function MakefileIcon({ size = SIZE_SM, className }: IconProps) {
  return <Wrench size={size} className={className ?? "text-[var(--color-warning)]"} />;
}

export function ServiceFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <Zap size={size} className={className ?? "text-[var(--color-warning)]"} />;
}

export function MarkdownFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <FileText size={size} className={className ?? "text-[var(--color-text-secondary)]"} />;
}

export function DefaultFileIcon({ size = SIZE_SM, className }: IconProps) {
  return <File size={size} className={className ?? "text-[var(--color-text-tertiary)]"} />;
}

// --------------- Folder icons ---------------

export function FolderClosedIcon({ size = SIZE_SM, className }: IconProps) {
  return <Folder size={size} className={className ?? "text-[var(--color-warning)]"} />;
}

export function FolderOpenIcon({ size = SIZE_SM, className }: IconProps) {
  return <FolderOpen size={size} className={className ?? "text-[var(--color-warning)]"} />;
}

// --------------- Action icons ---------------

export function PlayIcon({ size = SIZE_SM, className }: IconProps) {
  return <Play size={size} className={className ?? "text-current"} fill="currentColor" />;
}

export function PauseIcon({ size = SIZE_SM, className }: IconProps) {
  return <Pause size={size} className={className ?? "text-current"} fill="currentColor" />;
}

export function StopIcon({ size = SIZE_SM, className }: IconProps) {
  return <Square size={size} className={className ?? "text-current"} fill="currentColor" />;
}

export function TrashIcon({ size = SIZE_SM, className }: IconProps) {
  return <Trash2 size={size} className={className ?? "text-current"} />;
}

export function CheckIcon({ size = SIZE_SM, className }: IconProps) {
  return <Check size={size} className={className ?? "text-current"} strokeWidth={3} />;
}

export function CloseIcon({ size = SIZE_SM, className }: IconProps) {
  return <X size={size} className={className ?? "text-current"} strokeWidth={2} />;
}

// --------------- Semantic icons ---------------

export function TrophyIcon({ size = SIZE_XL, className }: IconProps) {
  return <Trophy size={size} className={className ?? "text-[var(--color-warning)]"} />;
}

export function TargetIcon({ size = SIZE_SM, className }: IconProps) {
  return <Target size={size} className={className ?? "text-current"} />;
}

export function LightbulbIcon({ size = SIZE_SM, className }: IconProps) {
  return <Lightbulb size={size} className={className ?? "text-[var(--color-warning)]"} />;
}

export function RefreshIcon({ size = SIZE_SM, className }: IconProps) {
  return <RefreshCw size={size} className={className ?? "text-current"} />;
}

export function BookOpenIcon({ size = SIZE_SM, className }: IconProps) {
  return <BookOpen size={size} className={className ?? "text-current"} />;
}

export function BookIcon({ size = SIZE_SM, className }: IconProps) {
  return <Book size={size} className={className ?? "text-current"} />;
}

export function ChartIcon({ size = SIZE_SM, className }: IconProps) {
  return <BarChart3 size={size} className={className ?? "text-current"} />;
}

export function MapPinIcon({ size = SIZE_SM, className }: IconProps) {
  return <MapPin size={size} className={className ?? "text-current"} />;
}

export function RestartIcon({ size = SIZE_SM, className }: IconProps) {
  return <RotateCcw size={size} className={className ?? "text-current"} />;
}

export function ChevronRightIcon({ size = SIZE_SM, className }: IconProps) {
  return <ChevronRight size={size} className={className ?? "text-current"} />;
}

// --------------- File icon resolver ---------------

/**
 * Given a filename, return the appropriate icon component.
 * Used by both FileTreeNode and CodeViewer for consistency.
 */
export function getFileIcon(
  filename: string,
  size?: number,
  className?: string
): React.ReactNode {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "c":
      return <CFileIcon size={size} className={className} />;
    case "h":
      return <HeaderFileIcon size={size} className={className} />;
    case "bb":
    case "bbappend":
      return <BitBakeFileIcon size={size} className={className} />;
    case "conf":
      return <ConfigFileIcon size={size} className={className} />;
    case "dts":
    case "dtb":
      return <DtsFileIcon size={size} className={className} />;
    case "makefile":
    case "mk":
      return <MakefileIcon size={size} className={className} />;
    case "service":
      return <ServiceFileIcon size={size} className={className} />;
    case "md":
      return <MarkdownFileIcon size={size} className={className} />;
    default:
      return <DefaultFileIcon size={size} className={className} />;
  }
}
