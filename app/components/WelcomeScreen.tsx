"use client";

import { totalSteps } from "@/data/steps";
import { PlayIcon, MapPinIcon, CheckIcon } from "./icons";

interface WelcomeScreenProps {
  onStart: () => void;
  onResume: () => void;
  lastVisitedStep: number;
  hasProgress: boolean;
}

export default function WelcomeScreen({
  onStart,
  onResume,
  lastVisitedStep,
  hasProgress,
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-yocto-gradient bg-yocto-pattern text-[var(--color-text-primary)] flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16 text-center animate-fade-in-scale max-w-full overflow-hidden">
        {/* Icon — terminal cursor */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border)] shadow-lg">
          <span className="text-2xl sm:text-3xl font-mono text-[var(--color-accent)] cursor-blink">
            &gt;_
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold mb-2 sm:mb-3 tracking-tight leading-tight">
          Getting Started with{" "}
          <span className="text-[var(--color-accent)]">Yocto</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-2 sm:mb-3 font-medium">
          An Interactive Terminal Tutorial
        </p>

        <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] max-w-lg mx-auto leading-relaxed mb-6 md:mb-10">
          Learn embedded Linux the hands-on way. Clone layers, write kernel
          modules, author BitBake recipes, and cross-compile a bootable ARM
          image — all inside a VS Code-inspired interactive environment.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6 md:mb-10 stagger-children">
          <div className="flex items-center gap-3 bg-[var(--color-surface-3)] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 border border-[var(--color-border)] hover-lift">
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-accent)] font-mono">
              {totalSteps}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] font-semibold">
              Steps
            </span>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface-3)] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 border border-[var(--color-border)] hover-lift">
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-success)] font-mono">
              ~30
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] font-semibold">
              Minutes
            </span>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface-3)] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 border border-[var(--color-border)] hover-lift">
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-warning)] font-mono">
              ARM
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] font-semibold">
              aarch64
            </span>
          </div>
        </div>

        {/* What you'll build */}
        <div className="text-left bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)] overflow-hidden mb-6 md:mb-10 shadow-lg">
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-3)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)] ml-2">
              Tutorial Roadmap
            </span>
          </div>
          <ol className="p-3 sm:p-4 md:p-5 stagger-children list-none" aria-label="Tutorial roadmap steps">
            {[
              "Clone 4 Yocto layers — Poky, OpenEmbedded, Freescale, NXP i.MX BSP",
              "Configure the build environment for aarch64 cross-compilation",
              "Write an out-of-tree IIO kernel module (mock ADXL345 accelerometer)",
              "Create a device tree overlay for platform device binding",
              "Build a user-space sysfs reader with systemd auto-start service",
              "Author BitBake recipes and assemble a bootable WIC disk image",
              "Verify ARM build artifacts and learn deployment to real hardware",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 py-[7px] group"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-[var(--color-surface-4)] border border-[var(--color-border)] flex items-center justify-center text-[11px] font-mono text-[var(--color-text-secondary)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors mt-px">
                  {i + 1}
                </span>
                <span className="text-[13px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Prerequisites */}
        <p className="text-[10px] sm:text-xs text-[var(--color-text-tertiary)] mb-5 md:mb-8 space-x-2 sm:space-x-4">
          <span>
            <strong className="text-[var(--color-text-secondary)] font-semibold">
              Requires:
            </strong>{" "}
            Linux CLI · git · C basics
          </span>
          <span className="text-[var(--color-text-disabled)] hidden sm:inline">|</span>
          <span className="block sm:inline mt-1 sm:mt-0">
            <strong className="text-[var(--color-text-secondary)] font-semibold">
              Stack:
            </strong>{" "}
            Yocto 4.0 Kirkstone · NXP i.MX8M Mini EVK · IIO subsystem
          </span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-3.5 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 inline-flex items-center justify-center gap-2"
          >
            <PlayIcon size={16} className="text-white" />
            Start Tutorial
          </button>
          {hasProgress && lastVisitedStep > 0 && (
            <button
              onClick={onResume}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-[var(--color-surface-3)] text-[var(--color-text-primary)] font-semibold rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-active)] hover:bg-[var(--color-surface-4)] transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              <MapPinIcon size={16} />
              Resume Step {lastVisitedStep + 1}
            </button>
          )}
        </div>

        <p className="mt-8 text-[12px] text-[var(--color-text-disabled)] font-mono">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded text-[11px] inline-flex items-center gap-0.5">
            <PlayIcon size={10} className="text-[var(--color-accent)]" /> Play
          </kbd>{" "}
          at each step to watch terminal output in real time
        </p>
      </div>
    </div>
  );
}
