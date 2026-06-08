"use client";

import { useState } from "react";
import DiagramGallery from "./diagrams/DiagramGallery";
import { totalSteps } from "@/data/steps";
import { TrophyIcon, TargetIcon, CheckIcon, ChartIcon, RestartIcon } from "./icons";

interface CompletionScreenProps {
  onRestart: () => void;
}

export default function CompletionScreen({ onRestart }: CompletionScreenProps) {
  const [showDiagrams, setShowDiagrams] = useState(false);

  const achievements = [
    "Cloned Yocto layers and set up a build environment",
    "Configured MACHINE, parallelism, and cache directories",
    "Created a custom meta layer with proper layer.conf",
    "Wrote an out-of-tree IIO kernel module in C",
    "Authored a device tree overlay for platform binding",
    "Built a user-space sysfs reader with systemd service",
    "Wrote BitBake recipes (kernel module, app, image)",
    "Ran bitbake and verified ARM aarch64 build artifacts",
  ];

  return (
    <div className="min-h-screen bg-yocto-gradient bg-yocto-pattern text-[var(--color-text-primary)] flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16 text-center animate-fade-in-scale max-w-full overflow-hidden">
        {/* Trophy */}
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-[var(--color-surface-3)] border-2 border-[var(--color-success)] shadow-[0_0_40px_rgba(63,185,80,0.15)]">
          <TrophyIcon size={40} className="text-[var(--color-warning)]" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold mb-2 sm:mb-3 tracking-tight leading-tight">
          Build Complete
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-2 sm:mb-3">
          You&apos;ve finished all {totalSteps} steps.
        </p>

        <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] max-w-md mx-auto leading-relaxed mb-6 md:mb-10">
          From zero to a cross-compiled embedded Linux image. You now understand
          the core Yocto workflow that powers millions of embedded devices worldwide.
        </p>

        {/* Achievements grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto mb-6 md:mb-10 stagger-children list-none">
          {achievements.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-left text-[13px] text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] rounded-xl p-3.5 border border-[var(--color-border)] hover:border-[var(--color-border-active)] transition-colors group"
            >
              <span className="w-5 h-5 rounded-md bg-[var(--color-success)]/15 border border-[var(--color-success)]/30 flex items-center justify-center flex-shrink-0 mt-px">
                <CheckIcon size={12} className="text-[var(--color-success)]" />
              </span>
              <span className="group-hover:text-[var(--color-text-primary)] transition-colors leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* What's Next */}
        <div className="text-left bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)] overflow-hidden mb-8 shadow-lg">
          <div className="px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-3)] flex items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)] inline-flex items-center gap-1.5">
              <TargetIcon size={12} /> What&apos;s Next?
            </span>
          </div>
          <div className="p-5 space-y-2">
            {[
              "Flash the .wic image to an SD card and boot on real i.MX8 hardware",
              "Explore the Yocto Project Mega-Manual for deep dives into every topic",
              "Try building for a different MACHINE (Raspberry Pi, BeagleBone, QEMU)",
              "Add more custom recipes: networking, web server, CAN bus, SPI/I2C",
              "Set up a shared sstate-cache mirror for team-based Yocto development",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-[13px] text-[var(--color-text-secondary)] py-1">
                <span className="text-[var(--color-accent)] flex-shrink-0 font-mono text-xs mt-px">
                  ›
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagram toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowDiagrams(!showDiagrams)}
            className="px-6 py-3 bg-[var(--color-surface-3)] text-[var(--color-text-primary)] font-semibold rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-active)] hover:bg-[var(--color-surface-4)] transition-all duration-200 inline-flex items-center gap-2"
          >
            {showDiagrams ? "Hide" : (
              <>
                <ChartIcon size={14} /> View
              </>
            )}{" "}
            Architecture Diagrams
          </button>
        </div>

        {showDiagrams && (
          <div className="mb-8 animate-fade-in-up">
            <DiagramGallery />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 inline-flex items-center justify-center gap-2"
          >
            <RestartIcon size={16} className="text-white" />
            Restart Tutorial
          </button>
        </div>

        <p className="mt-10 text-xs text-[var(--color-text-disabled)] font-mono">
          Yocto Project 4.0 Kirkstone · NXP i.MX8M Mini EVK · Built with ❤️
        </p>
      </div>
    </div>
  );
}
