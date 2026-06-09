# Getting Started with Yocto — Interactive Tutorial

An interactive, VS Code-style tutorial that walks you through building a custom embedded Linux image using the Yocto Project. Learn by doing — in a simulated IDE, right in your browser.

## What You'll Learn

This tutorial covers a complete Yocto workflow from start to finish: setting up a build host, cloning layers, writing a custom kernel module and user-space application, creating recipes, and assembling a bootable image for the **NXP i.MX8M Mini EVK**.

Along the way you'll write real Yocto configuration files, a Linux IIO kernel driver in C, device tree overlays, and BitBake recipes — all within the tutorial's code viewer and simulated terminal.

## How the Tutorial Works

The tutorial is designed to feel like working in a real development environment. Here's what makes it tick.

### The IDE Layout

The screen is split into three panels, modeled after VS Code:

| Panel            | What It Shows                                                                |
|------------------|------------------------------------------------------------------------------|
| **Left sidebar** | An evolving file tree that reflects the project structure at each step       |
| **Center**       | A code viewer (top) and a simulated terminal (bottom)                        |
| **Right panel**  | The objective — what you're doing in this step, why it matters, and pro tips |

This layout isn't cosmetic. Every element changes as you progress — the file tree grows, new files appear in the code viewer, and the terminal plays back commands for the current step.

### 20 Steps Across 7 Phases

The content is organized into a linear sequence of 20 steps:

| Phase                            | Steps      | What It Covers                                                                                    |
|----------------------------------|----------- |---------------------------------------------------------------------------------------------------|
| **Welcome**                      | Step 0     | Overview, prerequisites, architecture diagram                                                     |
| **Host Setup**                   | Step 1     | Installing build dependencies on Ubuntu                                                           |
| **Project Setup**                | Steps 2–4  | Directory structure, cloning Poky and BSP layers                                                  |
| **Build Environment**            | Steps 5–8  | `oe-init-build-env`, configuring `local.conf` and `bblayers.conf`                                 |
| **Custom Layer & Kernel Module** | Steps 9–12 | Layer structure, writing the IIO driver, Makefile, device tree, and kernel recipe                 |
| **User-Space Application**       | Steps 13–14| Writing the sysfs reader app and its recipe with systemd integration                              |
| **Image & Build**                | Steps 15–18| Image recipe, building the kernel module, app, and full image                                     |
| **Verify & Next Steps**          | Step 19    | Checking build artifacts, flashing to hardware, what to do next                                   |

Each step includes:
- An **objective** — what you're there to learn or do
- A **"Why This Matters"** section — the context and reasoning, expandable so it doesn't clutter the screen
- **Tips and gotchas** — real-world advice from embedded Linux practitioners
- **Alternative approaches** — where relevant, explaining other ways to solve the same problem
- **Glossary terms** — Yocto jargon highlighted inline with hover tooltips

### Simulated Terminal

The bottom half of the center panel is a fully functional terminal built with [xterm.js](https://xtermjs.org/). At relevant steps, it plays back terminal sessions:

- **Commands are typed character-by-character** with realistic timing
- **Output appears with natural delays** — you see what you'd see in a real terminal
- **Playback controls** let you play, pause, resume, or stop at any time
- **Auto-play** kicks in when you navigate to a step that has terminal content

This gives you the experience of running commands without needing a 100 GB Ubuntu machine and 4 hours of build time.

Not every step has terminal output. Steps that are purely explanatory (reading config files, understanding concepts) let the code viewer carry the weight.

### Evolving File Tree

The left sidebar shows the project's directory structure — and it **changes as you progress**:

1. **empty-project** — just an empty `~/my_project/` skeleton
2. **pre-project** — `sources/`, `downloads/`, `sstate-cache/` directories created
3. **after-poky** — poky cloned into `sources/`
4. **all-sources** — all layers cloned (poky, meta-openembedded, meta-freescale, meta-imx)
5. **after-setup** — `build/conf/` appears with `local.conf` and `bblayers.conf`
6. **layer-structure** — `meta-my_project/` with `conf/layer.conf` and recipe directories
7. **kernel-source** — kernel module source files appear
8. **full-project** — the complete project tree with all recipes, source files, and configuration

Each tree node has proper VS Code-style icons (folders, files with language-specific indicators), and you can collapse or expand folders.

### Code Viewer

When a step involves writing or editing files, the code viewer shows the relevant content with syntax highlighting:

- **BitBake** — `.conf` and `.bb` files (`local.conf`, `bblayers.conf`, `layer.conf`, recipes)
- **C** — kernel module source (`mock_adxl345.c`, `mock_adxl345.h`) and user-space app (`mock-adxl345-reader.c`)
- **Makefile** — Kbuild and regular Makefiles
- **Device Tree** — `.dts` overlay source

Files can be marked as "active" — the one you should focus on first. Click any tab to switch between files in the current step.

### PlantUML Diagrams

Key concepts are illustrated with diagrams rendered as SVG from PlantUML source:

| Diagram                  | Appears At           | What It Shows                                                  |
|--------------------------|----------------------|----------------------------------------------------------------|
| Architecture Overview    | Welcome (step 0)     | High-level view of the Yocto project structure                 |
| Device Tree Binding      | Step 11              | How the compatible string matches driver to device             |
| Runtime Data Flow        | Step 13              | Sensor data path: kernel → IIO → sysfs → user app              |
| Recipe Dependency Graph  | Step 15              | How custom recipes depend on each other and upstream           |
| Build Flow Sequence      | Step 16              | The full BitBake task pipeline                                 |
| Deployment Diagram       | Completion           | SD card layout and boot flow on the target hardware            |

Diagrams open in a zoomable lightbox viewer from within the tutorial.

### Progress That Persists

Your progress is saved to your browser's [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). This means:

- **Completed steps** are tracked and shown with checkmarks in the step indicator and table of contents
- **Your last position** is remembered — close the tab and come back later
- **The welcome screen** adapts: first visit shows "Start Tutorial," returning visits offer "Continue from Step N"
- **A resume banner** appears if you jump around — one click takes you back to where you left off
- **Restart anytime** from the navigation controls or completion screen

No accounts, no backend, no data leaves your browser.

### Built-in Glossary

Yocto has a steep vocabulary: *BitBake, Poky, recipe, layer, BBFILES, BBPATH, sstate-cache, bbappend, WIC, IIO, device tree, sysfs, systemd...*

The tutorial includes a glossary of 25+ terms across five categories:
- **Core** — Yocto Project, Poky, OpenEmbedded, i.MX
- **Tools** — BitBake, dtc, runqemu
- **Metadata** — Recipe, Layer, bbappend, BBPATH, BBFILES, local.conf, bblayers.conf
- **Build** — DEPENDS, RDEPENDS, IMAGE_INSTALL, sstate-cache, WIC, Toolchain
- **Kernel** — Kernel Module, IIO, Device Tree, DTS/DTBO, Kernel Config Fragment, sysfs

Terms are highlighted inline in the objective panel. Hover or tap to see the definition without leaving the current step.

### Mobile Responsive

The layout adapts for smaller screens. While the full three-panel IDE experience is best on desktop, the tutorial remains usable on tablets and phones with stacked panels and collapsible sections.

---

## Tech Stack

| Layer     | Technology                                                                 |
|-----------|----------------------------------------------------------------------------|
| Framework | [Next.js](https://nextjs.org/) 16 (static HTML export)                     |
| UI        | [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4 |
| Terminal  | [xterm.js](https://xtermjs.org/) 6                                         |
| Icons     | [Lucide React](https://lucide.dev/)                                        |
| Diagrams  | [PlantUML](https://plantuml.com/) (pre-rendered to SVG)                    |
| Language  | [TypeScript](https://www.typescriptlang.org/)                              |

The entire app is compiled to static HTML/CSS/JS in `out/` — serve it from any web server or open it directly.

## Running Locally

**Prerequisites:** Node.js 18 or later.

```bash
git clone https://github.com/rvxfahim/yocto-tutorial
cd yocto-tutorial
npm install
npm run dev        # Development server at http://localhost:3000
```

To build a static export:

```bash
npm run build      # Output in out/
```

No environment variables or backend services required.

## Project Layout

```
yocto-tutorial/
├── app/                  # Next.js app router pages and components
│   ├── page.tsx          # Main page — app state, navigation, step orchestration
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── globals.css       # Global styles and CSS custom properties
│   └── components/       # UI components
│       ├── ide/          #   IDE layout, file tree, code viewer, terminal
│       ├── objective/    #   Step objective and content panel
│       ├── navigation/   #   Step indicator, nav controls, table of contents
│       ├── glossary/     #   Inline glossary tooltips
│       ├── diagrams/     #   Diagram gallery and viewer
│       ├── WelcomeScreen.tsx
│       ├── CompletionScreen.tsx
│       └── ResumeBanner.tsx
├── data/                 # Tutorial content (not code — the curriculum)
│   ├── steps.ts          #   20 step definitions (title, objective, why, tips)
│   ├── code-files.ts     #   Source code displayed in the code viewer per step
│   ├── file-trees.ts     #   File tree structures for each stage of the project
│   ├── terminal-output.ts#   Terminal playback sequences per step
│   ├── diagrams.ts       #   Diagram metadata (title, description, SVG path)
│   └── glossary.ts       #   25+ Yocto terms with definitions
├── lib/                  # Shared TypeScript utilities
│   ├── types.ts          #   Type definitions (Step, TerminalLine, GlossaryEntry, etc.)
│   ├── useProgress.ts    #   localStorage-backed progress tracking hook
│   └── useTerminal.ts    #   Terminal playback state machine hook
├── public/
│   └── diagrams/         # Pre-rendered PlantUML SVGs
└── out/                  # Static export output (after npm run build)
```

### Content vs. Code

A key design choice: all tutorial content lives in `data/` as plain TypeScript objects. The UI components in `app/` are generic — they render whatever step data they receive. This means:

- **Adding or editing steps** is done by editing `data/steps.ts` — no component changes needed
- **Adding code samples** is done in `data/code-files.ts`
- **Adding terminal sequences** is done in `data/terminal-output.ts`
- **The glossary** is a standalone data file — add terms without touching any component

The separation keeps the tutorial *content* and *presentation* independent.

## License

ISC — see [LICENSE](./LICENSE)
