import { GlossaryEntry } from "@/lib/types";

export const glossary: GlossaryEntry[] = [
  {
    term: "Yocto",
    definition:
      "The Yocto Project — an open-source collaboration project that provides templates, tools, and methods to create custom Linux-based systems for embedded devices, regardless of the hardware architecture.",
    aliases: ["Yocto Project", "YP"],
    category: "Core",
  },
  {
    term: "Poky",
    definition:
      "The Yocto Project reference distribution. Poky includes BitBake, OpenEmbedded Core (OE-Core), and a set of metadata to build a working Linux image. It serves as the starting point for most Yocto builds.",
    aliases: [],
    category: "Core",
  },
  {
    term: "BitBake",
    definition:
      "The task executor and scheduler used by Yocto. It parses recipes, resolves dependencies, and executes build tasks (fetch, configure, compile, package, etc.) in the correct order. Think of it as 'make' on steroids for embedded Linux.",
    aliases: ["bitbake"],
    category: "Tools",
  },
  {
    term: "Recipe",
    definition:
      "A .bb file that tells BitBake how to build a piece of software. It specifies where to get the source code, what dependencies it needs, how to compile it, and how to package the resulting binaries.",
    aliases: [".bb", "recipe file"],
    category: "Metadata",
  },
  {
    term: "Layer",
    definition:
      "A collection of related recipes, configuration files, and classes. Layers are how Yocto organizes code — you can think of them as 'plugins' that add functionality. Each layer focuses on a specific purpose (BSP support, application recipes, etc.).",
    aliases: ["meta layer", "meta-layer"],
    category: "Metadata",
  },
  {
    term: "Machine",
    definition:
      'A MACHINE configuration that describes the target hardware: CPU architecture, kernel, bootloader, device tree, and hardware-specific features. In this tutorial, we target the "imx8mm-lpddr4-evk" machine (NXP i.MX8M Mini EVK).',
    aliases: ["MACHINE", "target machine"],
    category: "Configuration",
  },
  {
    term: "OpenEmbedded",
    definition:
      "The build framework that Yocto uses. OpenEmbedded Core (OE-Core) provides the foundational metadata — base recipes for compilers, C library, core utilities, and the class system that recipes inherit from.",
    aliases: ["OE", "OE-Core", "OpenEmbedded Core"],
    category: "Core",
  },
  {
    term: "BSP",
    definition:
      "Board Support Package — a layer that provides hardware-specific recipes and configurations: kernel, bootloader, device trees, GPU drivers, and firmware for a particular board or SoC family.",
    aliases: ["Board Support Package"],
    category: "Hardware",
  },
  {
    term: "i.MX",
    definition:
      "NXP's family of ARM-based application processors widely used in embedded and industrial systems. The i.MX8M Mini is a popular mid-range SoC with Cortex-A53 cores, used in the EVK board targeted by this tutorial.",
    aliases: ["i.MX8", "i.MX8M", "i.MX8M Mini"],
    category: "Hardware",
  },
  {
    term: "Device Tree",
    definition:
      "A data structure that describes the hardware to the Linux kernel. Device tree source (.dts) files define which devices are present, their addresses, interrupts, and configuration. Overlays (.dtbo) allow runtime hardware description changes.",
    aliases: ["DT", "DTS", "DTB", "device tree overlay"],
    category: "Kernel",
  },
  {
    term: "IIO",
    definition:
      "Industrial I/O — the Linux kernel subsystem for sensors, ADCs, DACs, and other data acquisition devices. It provides a standardized sysfs and character device interface for reading sensor data from user-space.",
    aliases: ["Industrial I/O", "IIO subsystem"],
    category: "Kernel",
  },
  {
    term: "Kernel Module",
    definition:
      "A piece of code that can be loaded into the Linux kernel at runtime to extend its functionality. Out-of-tree kernel modules (like our mock-adxl345) are built separately from the kernel source tree.",
    aliases: ["LKM", "module", "out-of-tree module", ".ko"],
    category: "Kernel",
  },
  {
    term: "local.conf",
    definition:
      "The primary Yocto build configuration file. It sets the target MACHINE, parallelism options, download/sstate cache paths, image features, and any custom variable overrides for the build.",
    aliases: ["conf/local.conf"],
    category: "Configuration",
  },
  {
    term: "bblayers.conf",
    definition:
      "The layer configuration file that lists which layers BitBake should search for recipes. Each layer path and its priority are declared here. Without adding a layer to bblayers.conf, BitBake won't find its recipes.",
    aliases: ["conf/bblayers.conf", "layer configuration"],
    category: "Configuration",
  },
  {
    term: "BBPATH",
    definition:
      "The search path BitBake uses to find .bbclass files, configuration fragments, and include files. Layers append their directory to BBPATH in their layer.conf so BitBake can discover their classes and configs.",
    aliases: [],
    category: "Metadata",
  },
  {
    term: "BBFILES",
    definition:
      "A variable defining which .bb and .bbappend files BitBake should parse. Layers add patterns like `${LAYERDIR}/recipes-*/*/*.bb` to BBFILES so their recipes are discovered.",
    aliases: [],
    category: "Metadata",
  },
  {
    term: "sysfs",
    definition:
      "A virtual filesystem (`/sys`) that exposes kernel objects and their attributes to user-space. Device drivers create entries under /sys that user-space programs can read/write to interact with hardware.",
    aliases: ["/sys", "sys filesystem"],
    category: "Kernel",
  },
  {
    term: "WIC",
    definition:
      "A Yocto tool that creates partitioned disk images. `wic.bz2` images can be written directly to an SD card or eMMC and boot on the target hardware. WIC handles partitioning, bootloader placement, and filesystem creation.",
    aliases: ["wic image", ".wic", ".wic.bz2"],
    category: "Tools",
  },
  {
    term: "systemd",
    definition:
      "The init system and service manager used in most modern Linux distributions. systemd service units (.service files) define how daemons and applications are started, stopped, and monitored at boot time.",
    aliases: ["systemd service", ".service"],
    category: "System",
  },
  {
    term: "DEPENDS",
    definition:
      "A recipe variable listing build-time dependencies — packages that must be built and available in the sysroot before this recipe can compile. For kernel modules, `virtual/kernel` is a common DEPENDS.",
    aliases: ["build dependency"],
    category: "Metadata",
  },
  {
    term: "RDEPENDS",
    definition:
      "A recipe variable listing runtime dependencies — packages that must be installed on the target for this package to work. Unlike DEPENDS (build-time), RDEPENDS affects the final image contents.",
    aliases: ["runtime dependency"],
    category: "Metadata",
  },
  {
    term: "IMAGE_INSTALL",
    definition:
      "The image recipe variable that specifies which packages to include in the final root filesystem image. It pulls in the named packages and all their runtime dependencies.",
    aliases: [],
    category: "Configuration",
  },
  {
    term: "DTS / DTBO",
    definition:
      "Device Tree Source (.dts) is compiled to Device Tree Blob (.dtb) or overlay (.dtbo). The `.dtbo` is applied at boot to describe non-discoverable hardware (like our mock-adxl345) that the kernel wouldn't otherwise know about.",
    aliases: [".dts", ".dtbo", "dtc"],
    category: "Kernel",
  },
  {
    term: "sstate-cache",
    definition:
      "Shared State Cache — Yocto's mechanism for caching build outputs. By sharing sstate between builds (and between developers), you avoid recompiling tasks whose inputs haven't changed. Dramatically speeds up incremental builds.",
    aliases: ["SSTATE_DIR", "shared state cache", "sstate"],
    category: "Tools",
  },
];
