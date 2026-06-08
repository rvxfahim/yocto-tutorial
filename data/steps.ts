import { StepDefinition } from "@/lib/types";

export const totalSteps = 20;

export const steps: StepDefinition[] = [
  // ==================== PHASE 1: Welcome & Prerequisites ====================
  {
    id: 0,
    phase: "Welcome",
    content: {
      title: "Welcome to Yocto",
      objective:
        "In this interactive tutorial, you'll learn how to build a custom embedded Linux image using the Yocto Project. We'll create a working build for the NXP i.MX8M Mini EVK with a custom kernel module and user-space application.",
      why: "Yocto is the industry-standard tool for building custom embedded Linux distributions. Unlike desktop Linux where you install pre-built packages, embedded systems need a tailored OS built from source for your exact hardware. Yocto gives you reproducible, cross-compiled, and production-ready images.",
      tips: [
        "This tutorial mirrors a real project. By the end, you'll have seen every step needed to go from zero to a bootable embedded Linux image.",
        "Estimated reading time: 20–30 minutes (real builds take 2-4 hours, but we'll fast-forward those).",
        "Prerequisites: basic familiarity with Linux command line, git, and C programming concepts.",
      ],
      glossaryTerms: [
        { term: "Yocto", definition: "See glossary — the Yocto Project" },
        { term: "Machine", definition: "See glossary — target hardware" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "empty-project",
    diagramId: "architecture_overview",
  },

  // ==================== PHASE 2: Host Setup ====================
  {
    id: 1,
    phase: "Host Setup",
    content: {
      title: "Install Host Dependencies",
      objective:
        "Install the required host packages on your Ubuntu 22.04 build machine. Yocto needs a specific set of development tools to cross-compile an entire Linux system.",
      why: "Yocto builds everything from source — kernel, toolchain, libraries, and applications. This requires standard build tools (gcc, make), source control (git), archive tools (tar, unzip), and Python utilities. The `chrpath` and `socat` packages are particularly Yocto-specific.",
      tips: [
        "You need at least 100 GB of free disk space for a full Yocto build.",
        "Ubuntu 22.04 LTS is the recommended host. Other distros work but may need different package names.",
        "Run `sudo locale-gen en_US.UTF-8` — Yocto is strict about locale settings.",
      ],
      alternatives:
        "On Fedora: `sudo dnf install gawk make wget tar bzip2 gzip python3 unzip perl patch diffutils diffstat git cpp gcc gcc-c++ glibc-devel texinfo chrpath ccache perl-Data-Dumper perl-Text-ParseWords perl-Thread-Queue perl-bignum socat python3-pexpect findutils which file cpio python3-pip xz python3-GitPython python3-jinja2 SDL-devel xterm rpcgen`",
      glossaryTerms: [
        { term: "Yocto", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "empty-project",
  },

  {
    id: 2,
    phase: "Project Setup",
    content: {
      title: "Create Project Directory",
      objective:
        "Create the top-level project directory structure: `~/yuhesen_ugv/` with `sources/`, `downloads/`, and `sstate-cache/` subdirectories.",
      why: "Keeping sources, downloads, and sstate-cache in separate directories is a Yocto best practice. `sources/` holds all layer repositories (cloned git repos). `downloads/` is a shared cache for source tarballs so you don't re-download them. `sstate-cache/` stores shared state cache for dramatically faster incremental builds.",
      tips: [
        "Put `downloads/` and `sstate-cache/` on a fast SSD with plenty of space.",
        "You can share these directories across multiple build directories and even between team members (via NFS or a shared server).",
      ],
      glossaryTerms: [
        { term: "sstate-cache", definition: "See glossary — Shared State Cache" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "empty-project",
  },

  {
    id: 3,
    phase: "Cloning Layers",
    content: {
      title: "Clone Poky",
      objective:
        "Clone the Poky reference distribution from the Yocto Project git server. We're using the `kirkstone` branch, which is the LTS (Long Term Support) release.",
      why: "Poky is the Yocto Project's reference distribution. It contains BitBake (the build engine), OpenEmbedded Core (base recipes for GCC, glibc, coreutils, etc.), and reference BSP layers. Think of it as the 'standard library' for embedded Linux builds. We use Kirkstone LTS because it's stable, well-tested, and supported for several years.",
      tips: [
        "Kirkstone = Yocto 4.0 LTS. Released May 2022, supported until May 2026.",
        "The poky repo is ~500 MB. A fast internet connection helps!",
        "Other LTS releases: Dunfell (3.1), Scarthgap (5.0). We use Kirkstone for i.MX8 compatibility.",
      ],
      glossaryTerms: [
        { term: "Poky", definition: "See glossary" },
        { term: "BitBake", definition: "See glossary" },
        { term: "Layer", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "after-poky",
  },

  {
    id: 4,
    phase: "Cloning Layers",
    content: {
      title: "Clone Supporting Layers",
      objective:
        "Clone three additional layers: `meta-openembedded` (extra application recipes), `meta-freescale` (i.MX community BSP), and `meta-imx` (NXP official i.MX BSP).",
      why: "A Yocto build is composed of multiple layers stacked together:\n\n• **meta-openembedded** — Community layer with recipes for thousands of packages (Python, networking, filesystems, etc.) that aren't in OE-Core.\n\n• **meta-freescale** — Community-maintained i.MX hardware support layer. Provides the machine definitions and GPU/VPU driver recipes.\n\n• **meta-imx** — NXP's official BSP layer with kernel, U-Boot, and firmware optimized for i.MX8M Mini.",
      tips: [
        "Layer ordering in bblayers.conf matters! meta-imx must come after meta-freescale because it overrides some recipes.",
        "The `kirkstone-5.15.71-2.2.2` branch for meta-imx is NXP's specific release tag — it matches the kernel version in their BSP.",
      ],
      glossaryTerms: [
        { term: "BSP", definition: "See glossary — Board Support Package" },
        { term: "i.MX", definition: "See glossary" },
        { term: "Layer", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "all-sources",
  },

  // ==================== PHASE 3: Build Environment ====================
  {
    id: 5,
    phase: "Build Environment",
    content: {
      title: "Source oe-init-build-env",
      objective:
        "Source the `oe-init-build-env` script to initialize the Yocto build environment. This creates the `build/` directory, sets up environment variables, and drops you into the build directory.",
      why: "`oe-init-build-env` is the entry point for every Yocto build. It does several things:\n\n1. Creates `build/conf/local.conf` and `build/conf/bblayers.conf` from templates.\n2. Sets `BUILDDIR`, `BBPATH`, and other critical environment variables.\n3. Adds `bitbake` and other Yocto tools to your PATH.\n4. Changes your working directory to the build directory.\n\nWithout sourcing this script, BitBake won't know where your layers are or what machine you're building for.",
      tips: [
        "Always use `source` (or `.`), never execute it as `./oe-init-build-env` — it needs to modify your current shell environment.",
        "You can have multiple build directories for different machines or configurations.",
        "If you close your terminal, you need to source it again to continue working.",
      ],
      glossaryTerms: [
        { term: "BBPATH", definition: "See glossary" },
        { term: "BitBake", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "after-setup",
  },

  {
    id: 6,
    phase: "Build Environment",
    content: {
      title: "Examine build/conf",
      objective:
        "Take a look at the generated configuration files. The `build/conf/` directory now contains `local.conf` (build settings) and `bblayers.conf` (layer configuration).",
      why: "These two files are the control center of your Yocto build:\n\n• **local.conf** — Your personal build settings: target machine, parallelism, download paths, image features, and any variable overrides.\n\n• **bblayers.conf** — Lists all the layers BitBake should search for recipes. Each layer is a path to a directory containing a `conf/layer.conf`.\n\nThey are generated from templates in `poky/meta-poky/conf/templates/default/`.",
      tips: [
        "local.conf can be thousands of lines — most are commented-out examples. The actual active settings are at the bottom.",
        "Don't edit the template files. Always edit the copies in build/conf/.",
      ],
      glossaryTerms: [
        { term: "local.conf", definition: "See glossary" },
        { term: "bblayers.conf", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "after-setup",
  },

  {
    id: 7,
    phase: "Build Environment",
    content: {
      title: "Configure local.conf",
      objective:
        "Edit `build/conf/local.conf` to set the target machine, build parallelism, cache paths, and accept the NXP EULA.",
      why: "Each setting serves a purpose:\n\n• **MACHINE** — Tells Yocto which hardware you're building for. This selects the right kernel, bootloader, and device tree.\n\n• **BB_NUMBER_THREADS / PARALLEL_MAKE** — Controls build parallelism. Set to your CPU core count.\n\n• **DL_DIR / SSTATE_DIR** — Shared cache directories that persist across builds and save enormous amounts of time.\n\n• **ACCEPT_FSL_EULA** — Required by NXP for GPU/VPU firmware. Without this, the build fails.",
      tips: [
        "Set BB_NUMBER_THREADS to your CPU core count, not higher — oversubscribing slows builds down.",
        "DL_DIR and SSTATE_DIR can be shared across multiple build directories and even between machines.",
      ],
      glossaryTerms: [
        { term: "Machine", definition: "See glossary" },
        { term: "sstate-cache", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "after-setup",
  },

  {
    id: 8,
    phase: "Build Environment",
    content: {
      title: "Configure bblayers.conf",
      objective:
        "Edit `build/conf/bblayers.conf` to add all the layers we cloned. BitBake needs to know about every layer before it can find recipes in them.",
      why: "bblayers.conf is how you tell BitBake 'look in these directories for recipes.' The order matters: layers listed later can override recipes from earlier layers via .bbappend files or higher BBFILE_PRIORITY. We add:\n\n1. poky/meta (OE-Core — always first)\n2. poky/meta-poky (Poky distro layer)\n3. poky/meta-yocto-bsp (reference BSPs)\n4. meta-openembedded/meta-oe (core OE recipes)\n5. meta-openembedded/meta-python, meta-networking\n6. meta-freescale (community i.MX)\n7. meta-imx/meta-imx (NXP official BSP)\n8. meta-yuhesen_ugv (our custom layer)",
      tips: [
        "If a recipe isn't found, check that its layer is listed in bblayers.conf.",
        "Use `bitbake-layers show-layers` to verify all layers are detected.",
      ],
      glossaryTerms: [
        { term: "bblayers.conf", definition: "See glossary" },
        { term: "BBFILES", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "after-setup",
  },

  // ==================== PHASE 4: Custom Layer & Kernel Module ====================
  {
    id: 9,
    phase: "Custom Layer",
    content: {
      title: "Create Custom Layer Structure",
      objective:
        "Create the `meta-yuhesen_ugv` layer with the standard Yocto layer directory layout and write `conf/layer.conf`.",
      why: "Custom layers are how you extend Yocto without modifying upstream code. The directory structure follows a convention:\n\n• `conf/layer.conf` — Layer metadata (name, priority, dependencies, recipe search paths)\n• `recipes-kernel/` — Kernel-related recipes (modules, kernel configs)\n• `recipes-apps/` — Application recipes\n• `recipes-core/` — Core system recipes (images, base packages)\n\nThe layer.conf tells BitBake: 'Here are my recipes, here's my priority, and I depend on the core layer.' BBFILE_PRIORITY of 5 means our layer overrides upstream layers with lower priority.",
      tips: [
        "Layer naming convention: always `meta-<name>`. This is a strong Yocto community convention.",
        "BBFILE_PRIORITY defaults to 5 if not set. Higher numbers = higher priority.",
        "LAYERSERIES_COMPAT must match the Yocto release codename ('kirkstone', 'mickledore', etc.).",
      ],
      glossaryTerms: [
        { term: "Layer", definition: "See glossary" },
        { term: "BBFILES", definition: "See glossary" },
        { term: "BBPATH", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "layer-structure",
  },

  {
    id: 10,
    phase: "Kernel Module",
    content: {
      title: "Write the Kernel Module",
      objective:
        "Write `mock_adxl345.c` — an out-of-tree Linux kernel module that registers as an IIO (Industrial I/O) accelerometer driver. It simulates a 3-axis ADXL345 sensor with time-varying mock data.",
      why: "Kernel modules are how you add hardware support without recompiling the entire kernel. Our mock-adxl345 driver demonstrates several important kernel concepts:\n\n• **IIO Subsystem** — The standard Linux framework for sensors. Using IIO means any application that speaks IIO sysfs can read our data without custom code.\n\n• **Platform Driver** — A driver model for non-discoverable (non-PCI, non-USB) devices. The device is instantiated via device tree.\n\n• **Sysfs Interface** — The driver creates files in `/sys/bus/iio/devices/iio:device0/` that user-space can read to get sensor values.\n\n• **Parabolic Sine Approximation** — We avoid floating-point math in the kernel by using a parabola approximation for the sine wave. This is a real embedded technique!",
      tips: [
        "Kernel code cannot use standard C libraries (no printf, no math.h). Use kernel APIs: printk, ktime_get_ns, etc.",
        "The IIO subsystem expects specific sysfs attributes: `_raw` for raw values, `_scale` for conversion factors.",
        "MODULE_LICENSE(\"GPL\") is important — non-GPL modules can't use GPL-only kernel symbols.",
      ],
      alternatives:
        "You could write a simpler character device driver (miscdevice) instead of IIO, but then standard tools like `iio_info` and `iio_readdev` wouldn't work with your sensor.",
      glossaryTerms: [
        { term: "IIO", definition: "See glossary" },
        { term: "Kernel Module", definition: "See glossary" },
        { term: "sysfs", definition: "See glossary" },
        { term: "Device Tree", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "kernel-source",
  },

  {
    id: 11,
    phase: "Kernel Module",
    content: {
      title: "Write Header, Makefile & Device Tree",
      objective:
        "Create the supporting files: `mock_adxl345.h` (constants and channel definitions), `Makefile` (Kbuild-based kernel module build), and `mock-adxl345.dts` (device tree overlay).",
      why: "Three supporting files complete the kernel module:\n\n• **Header (.h)** — Channel enum, compatible string constant, default sampling frequency, and scale value. Keeps the magic numbers in one place.\n\n• **Makefile** — Uses the Kbuild system (`obj-m += mock_adxl345.o`) which integrates with the Linux kernel build infrastructure. In Yocto, `module.bbclass` invokes this automatically against the kernel source tree.\n\n• **Device Tree Overlay (.dts)** — Creates a virtual device node with `compatible = \"yuhesen_ugv,mock-adxl345\"`. The kernel matches this string against the driver's `of_match_table` to call the probe function. Without the overlay, the driver would never be instantiated.",
      tips: [
        "The compatible string in the DTS must EXACTLY match MOCK_ADXL345_COMPATIBLE in the driver header.",
        "Device tree overlays are compiled with `dtc -@` (the -@ flag enables overlay syntax).",
      ],
      glossaryTerms: [
        { term: "DTS / DTBO", definition: "See glossary" },
        { term: "Device Tree", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "kernel-source",
    diagramId: "device_tree_binding",
  },

  {
    id: 12,
    phase: "Kernel Module",
    content: {
      title: "Write Kernel Module Recipe",
      objective:
        "Write `mock-adxl345_1.0.bb` — the BitBake recipe that tells Yocto how to build the kernel module.",
      why: "The recipe is the bridge between your source code and Yocto's build system:\n\n• **inherit module** — Pulls in the kernel module build class. This sets up the cross-compilation environment, points Kbuild at the correct kernel source tree, and packages the .ko file correctly.\n\n• **DEPENDS += \"virtual/kernel dtc-native\"** — `virtual/kernel` ensures the kernel is built first (we need its headers). `dtc-native` gives us the device tree compiler for the host.\n\n• **do_compile:append()** — We add a step after the normal module compilation to also compile the device tree overlay with `dtc`.\n\n• **KERNEL_MODULE_AUTOLOAD** — Tells Yocto to add 'mock-adxl345' to /etc/modules-load.d/ so it auto-loads at boot.",
      tips: [
        "The recipe version (1.0) is part of the filename: `mock-adxl345_1.0.bb`. Use `PV` in the recipe to reference the version.",
        "`inherit module` automatically handles: setting KERNEL_PATH, cross-compiling with ARCH=arm64 CROSS_COMPILE=aarch64-poky-linux-",
      ],
      glossaryTerms: [
        { term: "Recipe", definition: "See glossary" },
        { term: "DEPENDS", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "kernel-source",
  },

  // ==================== PHASE 5: User-Space Application ====================
  {
    id: 13,
    phase: "User App",
    content: {
      title: "Write User-Space Reader Application",
      objective:
        "Write `mock-adxl345-reader.c` — a C program that reads acceleration data from the IIO sysfs interface and prints formatted output to the terminal every 2 seconds.",
      why: "The kernel driver exposes data via sysfs, but raw sysfs reads aren't user-friendly. This application:\n\n1. Verifies the IIO device exists\n2. Reads the sensor name and scale attribute\n3. Enters a loop reading X, Y, Z raw values\n4. Converts raw values to milli-g using the scale factor\n5. Prints a formatted table to stdout\n\nIt also includes a systemd service file so it auto-starts at boot — this is production embedded behavior! The service depends on `multi-user.target`, meaning it starts after the system is fully up.",
      tips: [
        "Always check return values from sysfs reads — the device might not be ready yet at boot.",
        "The scale conversion: `value_mg = raw * scale / 1000`. For our mock driver, raw = mg and scale = 4000 ug/LSB.",
      ],
      glossaryTerms: [
        { term: "sysfs", definition: "See glossary" },
        { term: "systemd", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
    diagramId: "runtime_data_flow",
  },

  {
    id: 14,
    phase: "User App",
    content: {
      title: "Write Application Recipe",
      objective:
        "Write `mock-adxl345-app.bb` — the recipe for the user-space reader application, including systemd service integration.",
      why: "This recipe differs from the kernel module recipe:\n\n• **inherit systemd** — Instead of `inherit module`, we inherit `systemd` which provides macros for installing and enabling systemd service files.\n\n• **RDEPENDS (not DEPENDS)** — We use RDEPENDS (runtime dependency) on `mock-adxl345`, not DEPENDS (build-time). The app doesn't need the kernel module to compile — it just needs it at runtime.\n\n• **SYSTEMD_SERVICE** — Declares which service file to install and enable at boot.\n\n• **do_compile()** — A plain C application, so we just call `oe_runmake` (which runs make with cross-compiler variables set).",
      tips: [
        "RDEPENDS vs DEPENDS is a common confusion: DEPENDS = build-time (headers, libs to link); RDEPENDS = runtime (packages needed on the target).",
        "The systemd class automatically handles `systemctl enable` at image creation time.",
      ],
      glossaryTerms: [
        { term: "RDEPENDS", definition: "See glossary" },
        { term: "Recipe", definition: "See glossary" },
        { term: "systemd", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
  },

  // ==================== PHASE 6: Image & Build ====================
  {
    id: 15,
    phase: "Image Recipe",
    content: {
      title: "Write Image Recipe",
      objective:
        "Write `yuhesen-ugv-image.bb` — the image recipe that assembles the final bootable Linux system by pulling together the kernel, our modules, and the user-space application.",
      why: "The image recipe is the final piece of the puzzle:\n\n• **inherit core-image** — Gets you a working base image (init system, shell, core utilities, package manager).\n\n• **IMAGE_INSTALL** — The list of packages to include. We add:\n  - `packagegroup-core-boot` — Essential boot packages\n  - `kernel-modules` — All built kernel modules\n  - `mock-adxl345` — Our custom kernel module\n  - `mock-adxl345-app` — Our user-space reader\n\n• **IMAGE_FSTYPES** — Output formats: tar.bz2 (archive), ext4 (filesystem), wic.bz2 (bootable SD card image).\n\n• **IMAGE_ROOTFS_SIZE** — 512 MB rootfs with room for our additions.",
      tips: [
        "WIC images (.wic.bz2) are what you actually write to an SD card. They include partition tables, bootloader, and rootfs.",
        "You can add packages temporarily with `CORE_IMAGE_EXTRA_INSTALL` in local.conf without modifying the image recipe.",
      ],
      glossaryTerms: [
        { term: "IMAGE_INSTALL", definition: "See glossary" },
        { term: "WIC", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
    diagramId: "recipe_dependency_graph",
  },

  {
    id: 16,
    phase: "Build",
    content: {
      title: "Build Kernel Module",
      objective:
        "Run `bitbake mock-adxl345` to build just the kernel module. This is a quick test build (~2-5 minutes on a decent machine) to verify the recipe works before committing to a full image build.",
      why: "Building individual recipes is the Yocto way to iterate quickly:\n\n1. **Test the recipe** — Does it fetch? Compile? Package? Without waiting 4 hours for a full image.\n2. **Check the output** — Find the .ko file and verify it's a valid aarch64 kernel module.\n3. **Fix and repeat** — If something's wrong, fix the recipe or source, clean (`bitbake -c cleansstate mock-adxl345`), and rebuild.\n\nBitBake shows you exactly what tasks run: do_fetch → do_unpack → do_patch → do_configure → do_compile → do_install → do_package → do_package_write_rpm.",
      tips: [
        "Use `bitbake -c listtasks <recipe>` to see all available tasks.",
        "`bitbake -c devshell <recipe>` drops you into an interactive shell with all the cross-compilation environment variables set — great for debugging.",
      ],
      glossaryTerms: [
        { term: "BitBake", definition: "See glossary" },
        { term: "Recipe", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
    diagramId: "build_flow_sequence",
  },

  {
    id: 17,
    phase: "Build",
    content: {
      title: "Build User Application",
      objective:
        "Run `bitbake mock-adxl345-app` to build the user-space reader. This should be fast since the kernel and toolchain are already built.",
      why: "With the shared state cache populated from the previous build, this step should take only ~10-30 seconds. Yocto's sstate-cache identifies which tasks haven't changed and skips them. Since the cross-compiler and sysroot are already populated, only the actual compilation of our small .c file runs.\n\nThis is where you really appreciate sstate-cache — your first build takes hours, but every subsequent build takes seconds to minutes.",
      tips: [
        "If you only change the source file (not the recipe), Yocto detects the change and rebuilds only the compile step.",
        "Use `bitbake -c cleansstate <recipe>` to force a full rebuild if something gets stuck.",
      ],
      glossaryTerms: [
        { term: "sstate-cache", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
  },

  {
    id: 18,
    phase: "Build",
    content: {
      title: "Build Full Image",
      objective:
        "Run `bitbake yuhesen-ugv-image` to build the complete bootable image. This is the big one — the first build takes 2-4 hours.",
      why: "This builds EVERYTHING from source: the ARM cross-compiler (gcc, binutils, glibc), Linux kernel, U-Boot bootloader, hundreds of system packages (OpenSSL, systemd, util-linux, etc.), our custom recipes, and finally assembles the root filesystem and WIC disk image.\n\nTask count: ~4,823 tasks for a typical i.MX8 build.\n\nBut this is also why Yocto is so powerful — you get a complete, reproducible, production-ready embedded Linux image where every component is built specifically for your hardware, with exactly the configuration you specified.",
      tips: [
        "Run overnight or over lunch! First builds are slow.",
        "After the first build, incremental builds are fast thanks to sstate-cache.",
        "Consider setting up a shared sstate mirror for team use.",
        "Use `bitbake -k` (continue on error) during development to see all failures at once.",
      ],
      glossaryTerms: [
        { term: "WIC", definition: "See glossary" },
        { term: "sstate-cache", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
  },

  // ==================== PHASE 7: Verify & Next Steps ====================
  {
    id: 19,
    phase: "Verify",
    content: {
      title: "Verify Build Artifacts & Next Steps",
      objective:
        "Verify that the build produced everything we need: the kernel module (.ko), device tree overlay (.dtbo), and the bootable disk image (.wic.bz2). Then learn what comes next.",
      why: "Always verify your build output before flashing to hardware:\n\n• **file <module>.ko** — Should say 'ARM aarch64', confirming cross-compilation worked.\n• **.wic.bz2** — This is what you `dd` to an SD card to boot the board.\n\nNext steps for a real project:\n• Flash to SD: `sudo dd if=<image>.wic of=/dev/sdX bs=1M`\n• Boot the board, check kernel log: `dmesg | grep mock-adxl345`\n• Read sensor data: `cat /sys/bus/iio/devices/iio:device0/in_accel_x_raw`\n• Run the reader: `mock-adxl345-reader`\n• Iterate: fix bugs, add features, rebuild (now fast thanks to sstate!)",
      tips: [
        "Always double-check the device name before dd — writing to the wrong /dev/sdX can wipe your host system.",
        "The .wic.bz2 image is compressed; uncompress with `bunzip2` first, or use `bzip2 -dc image.wic.bz2 | dd of=/dev/sdX`.",
      ],
      glossaryTerms: [
        { term: "WIC", definition: "See glossary" },
      ],
    },
    terminal: { prompt: "$ ", lines: [] },
    files: [],
    fileTreeKey: "full-project",
  },
];
