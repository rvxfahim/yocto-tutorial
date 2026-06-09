import { TerminalSequence } from "@/lib/types";

// Terminal output sequences keyed by step ID.
// Each is an array of lines that get played back in order.
// "command" lines are typed character-by-character;
// "output" lines print immediately with a delay.

export const terminalOutput: Record<number, TerminalSequence> = {
  // Step 1: Install host dependencies
  1: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "sudo apt-get update",
        delay: 500,
      },
      {
        type: "output",
        text: "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease",
      },
      {
        type: "output",
        text: "Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]",
      },
      {
        type: "output",
        text: "Reading package lists... Done",
        delay: 800,
      },
      {
        type: "command",
        text: "sudo apt-get install -y gawk wget git diffstat unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 python3-subunit zstd liblz4-tool file locales libacl1 device-tree-compiler",
        delay: 600,
      },
      {
        type: "output",
        text: "Reading package lists... Done",
      },
      {
        type: "output",
        text: "Building dependency tree... Done",
      },
      {
        type: "output",
        text: "The following NEW packages will be installed:",
      },
      {
        type: "output",
        text: "  build-essential chrpath cpio debianutils diffstat gawk gcc git",
      },
      {
        type: "output",
        text: "  libacl1 liblz4-tool python3 python3-git python3-jinja2 ...",
      },
      {
        type: "output",
        text: "0 upgraded, 42 newly installed, 0 to remove and 0 not upgraded.",
      },
      {
        type: "output",
        text: "Setting up gawk (1:5.1.0-1) ...",
      },
      {
        type: "output",
        text: "Setting up git (1:2.34.1-1ubuntu1) ...",
      },
      {
        type: "output",
        text: "Processing triggers for libc-bin (2.35-0ubuntu3) ...",
        delay: 600,
      },
      {
        type: "info",
        text: "# Host dependencies installed successfully!",
        delay: 200,
      },
    ],
  },

  // Step 2: Create project directory
  2: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "mkdir -p ~/my_project/sources ~/my_project/downloads ~/my_project/sstate-cache",
      },
      {
        type: "command",
        text: "cd ~/my_project && ls -la",
        delay: 300,
      },
      {
        type: "output",
        text: "total 12",
      },
      {
        type: "output",
        text: "drwxr-xr-x 5 user user 4096 Jun  8 10:00 .",
      },
      {
        type: "output",
        text: "drwxr-x--- 20 user user 4096 Jun  8 09:55 ..",
      },
      {
        type: "output",
        text: "drwxr-xr-x 2 user user 4096 Jun  8 10:00 downloads",
      },
      {
        type: "output",
        text: "drwxr-xr-x 2 user user 4096 Jun  8 10:00 sources",
      },
      {
        type: "output",
        text: "drwxr-xr-x 2 user user 4096 Jun  8 10:00 sstate-cache",
      },
    ],
  },

  // Step 3: Clone poky
  3: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project/sources && git clone -b kirkstone https://git.yoctoproject.org/poky.git",
      },
      {
        type: "output",
        text: "Cloning into 'poky'...",
      },
      {
        type: "output",
        text: "remote: Enumerating objects: 523847, done.",
      },
      {
        type: "output",
        text: "remote: Counting objects: 100% (523847/523847), done.",
      },
      {
        type: "output",
        text: "remote: Compressing objects: 100% (128430/128430), done.",
      },
      {
        type: "output",
        text: "Receiving objects: 100% (523847/523847), 185.62 MiB | 12.34 MiB/s",
      },
      {
        type: "output",
        text: "Resolving deltas: 100% (364512/364512), done.",
      },
      {
        type: "output",
        text: "Updating files: 100% (8923/8923), done.",
        delay: 600,
      },
      {
        type: "info",
        text: "# Poky cloned! This is the Yocto Project reference distribution.",
      },
    ],
  },

  // Step 4-6: Clone remaining layers (condensed — each gets similar output)
  4: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "git clone -b kirkstone https://git.openembedded.org/meta-openembedded",
      },
      {
        type: "output",
        text: "Cloning into 'meta-openembedded'...",
      },
      {
        type: "output",
        text: "remote: Enumerating objects: 89234, done.",
      },
      {
        type: "output",
        text: "Receiving objects: 100% (89234/89234), 42.18 MiB | 8.91 MiB/s",
      },
      {
        type: "output",
        text: "Resolving deltas: 100% (56123/56123), done.",
        delay: 300,
      },
      {
        type: "command",
        text: "git clone -b kirkstone https://git.yoctoproject.org/meta-freescale",
        delay: 400,
      },
      {
        type: "output",
        text: "Cloning into 'meta-freescale'...",
      },
      {
        type: "output",
        text: "Receiving objects: 100% (12345/12345), 8.34 MiB | 5.12 MiB/s",
      },
      {
        type: "output",
        text: "Resolving deltas: 100% (8910/8910), done.",
        delay: 200,
      },
      {
        type: "command",
        text: "git clone -b kirkstone-5.15.71-2.2.2 https://github.com/nxp-imx/meta-imx.git",
        delay: 400,
      },
      {
        type: "output",
        text: "Cloning into 'meta-imx'...",
      },
      {
        type: "output",
        text: "Receiving objects: 100% (9876/9876), 12.56 MiB | 6.23 MiB/s",
      },
      {
        type: "output",
        text: "Resolving deltas: 100% (6543/6543), done.",
        delay: 400,
      },
      {
        type: "info",
        text: "# All Yocto layers cloned successfully!",
      },
    ],
  },

  // Step 5: Source oe-init-build-env
  5: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project/sources/poky && source oe-init-build-env ../../build",
      },
      {
        type: "output",
        text: "### Shell environment set up for builds. ###",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "You can now run 'bitbake <target>'",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "Common targets are:",
      },
      {
        type: "output",
        text: "    core-image-minimal",
      },
      {
        type: "output",
        text: "    core-image-full-cmdline",
      },
      {
        type: "output",
        text: "    core-image-sato",
      },
      {
        type: "output",
        text: "    core-image-minimal-dev",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "You can also run generated qemu images with a command like 'runqemu qemux86-64'",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "Other commonly useful commands are:",
      },
      {
        type: "output",
        text: " - 'devtool' and 'recipetool' handle common recipe tasks",
      },
      {
        type: "output",
        text: " - 'bitbake-layers' handles common layer tasks",
      },
      {
        type: "output",
        text: " - 'oe-pkgdata-util' handles common target package tasks",
        delay: 500,
      },
      {
        type: "info",
        text: "# Build environment is ready! We're now inside the build/ directory.",
      },
    ],
  },

  // Step 6: Examine build/conf
  6: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project/build && ls -la conf/",
        delay: 200,
      },
      {
        type: "output",
        text: "total 24",
      },
      {
        type: "output",
        text: "drwxr-xr-x 2 user user 4096 Jun  8 10:05 .",
      },
      {
        type: "output",
        text: "drwxr-xr-x 3 user user 4096 Jun  8 10:05 ..",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user 14986 Jun  8 10:05 local.conf",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user  1024 Jun  8 10:05 bblayers.conf",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user    85 Jun  8 10:05 templateconf.cfg",
        delay: 400,
      },
      {
        type: "command",
        text: "head -20 conf/local.conf",
        delay: 300,
      },
      {
        type: "output",
        text: "#",
      },
      {
        type: "output",
        text: "# This file is your local configuration file and is where all local user settings",
      },
      {
        type: "output",
        text: "# are placed. The comments in this file give some guide to the options a new user",
      },
      {
        type: "output",
        text: "# to the system might want to change but pretty much any configuration option can",
      },
      {
        type: "output",
        text: "# be set in this file. More adventurous users can look at local.conf.extended.",
      },
      {
        type: "output",
        text: "#",
      },
      {
        type: "output",
        text: "# MACHINE = \"qemux86-64\"",
      },
      {
        type: "output",
        text: "# DISTRO = \"poky\"",
      },
      {
        type: "output",
        text: "# PACKAGE_CLASSES = \"package_rpm\"",
        delay: 400,
      },
      {
        type: "info",
        text: "# These files control your entire Yocto build.",
      },
      {
        type: "info",
        text: "# local.conf: machine, parallelism, cache paths, and variable overrides",
      },
      {
        type: "info",
        text: "# bblayers.conf: which layers BitBake searches for recipes",
      },
    ],
  },

  // Step 7: Configure local.conf
  7: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "nano conf/local.conf",
        delay: 300,
      },
      {
        type: "output",
        text: "# Editing local.conf — adding build configuration...",
        delay: 200,
      },
      {
        type: "command",
        text: "grep -E \"^(MACHINE|BB_NUMBER_THREADS|PARALLEL_MAKE|DL_DIR|SSTATE_DIR|ACCEPT_FSL_EULA)\" conf/local.conf",
        delay: 400,
      },
      {
        type: "output",
        text: "MACHINE = \"imx8mm-lpddr4-evk\"",
      },
      {
        type: "output",
        text: "BB_NUMBER_THREADS = \"32\"",
      },
      {
        type: "output",
        text: "PARALLEL_MAKE = \"-j 32\"",
      },
      {
        type: "output",
        text: "DL_DIR = \"/home/johndoe/my_project/downloads\"",
      },
      {
        type: "output",
        text: "SSTATE_DIR = \"/home/johndoe/my_project/sstate-cache\"",
      },
      {
        type: "output",
        text: "ACCEPT_FSL_EULA = \"1\"",
        delay: 500,
      },
      {
        type: "info",
        text: "# local.conf configured for i.MX8M Mini EVK aarch64 build!",
      },
    ],
  },

  // Step 10: Write Kernel Module source
  10: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "wc -l meta-my_project/recipes-kernel/mock-adxl345/files/mock_adxl345.c",
        delay: 200,
      },
      {
        type: "output",
        text: "257 meta-my_project/recipes-kernel/mock-adxl345/files/mock_adxl345.c",
      },
      {
        type: "command",
        text: "head -12 meta-my_project/recipes-kernel/mock-adxl345/files/mock_adxl345.c",
        delay: 300,
      },
      {
        type: "output",
        text: "// SPDX-License-Identifier: GPL-2.0-only",
      },
      {
        type: "output",
        text: "/*",
      },
      {
        type: "output",
        text: " * mock_adxl345.c — Simulated ADXL345 3-axis accelerometer IIO driver",
      },
      {
        type: "output",
        text: " *",
      },
      {
        type: "output",
        text: " * This is a my_project kernel module that registers with the Linux IIO",
      },
      {
        type: "output",
        text: " * (Industrial I/O) subsystem and provides three acceleration channels",
      },
      {
        type: "output",
        text: " * (X, Y, Z) with time-varying mock data. No real hardware is required.",
        delay: 300,
      },
      {
        type: "info",
        text: "# Kernel module source written — see the editor panel for full code.",
      },
      {
        type: "info",
        text: "# Key concepts: IIO subsystem, platform_driver, sysfs interface, parabolic sine approximation.",
      },
    ],
  },

  // Step 11: Supporting files (header, Makefile, DTS)
  11: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "ls -la meta-my_project/recipes-kernel/mock-adxl345/files/",
        delay: 200,
      },
      {
        type: "output",
        text: "total 32",
      },
      {
        type: "output",
        text: "drwxr-xr-x 2 user user 4096 Jun  8 10:30 .",
      },
      {
        type: "output",
        text: "drwxr-xr-x 3 user user 4096 Jun  8 10:29 ..",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user  412 Jun  8 10:29 Makefile",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user  305 Jun  8 10:28 mock-adxl345.dts",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user 9024 Jun  8 10:25 mock_adxl345.c",
      },
      {
        type: "output",
        text: "-rw-r--r-- 1 user user 1145 Jun  8 10:27 mock_adxl345.h",
        delay: 400,
      },
      {
        type: "info",
        text: "# All 4 files ready: C source, header, Kbuild Makefile, and device tree overlay.",
      },
      {
        type: "info",
        text: "# The compatible string in the DTS MUST match MOCK_ADXL345_COMPATIBLE in the header.",
      },
    ],
  },

  // Step 12: Kernel module recipe
  12: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cat meta-my_project/recipes-kernel/mock-adxl345/mock-adxl345_1.0.bb",
        delay: 400,
      },
      {
        type: "output",
        text: "SUMMARY = \"Mock ADXL345 IIO accelerometer driver\"",
      },
      {
        type: "output",
        text: "LICENSE = \"GPL-2.0-only\"",
      },
      {
        type: "output",
        text: "inherit module",
      },
      {
        type: "output",
        text: "DEPENDS += \"virtual/kernel dtc-native\"",
      },
      {
        type: "output",
        text: "KERNEL_MODULE_AUTOLOAD += \"mock-adxl345\"",
        delay: 300,
      },
      {
        type: "info",
        text: "# Recipe tells BitBake how to fetch, compile, and package the kernel module.",
      },
      {
        type: "info",
        text: "# inherit module sets up cross-compilation against the kernel source tree.",
      },
    ],
  },

  // Step 13: User-space reader application
  13: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "wc -l meta-my_project/recipes-apps/mock-adxl345-app/files/mock-adxl345-reader.c",
        delay: 200,
      },
      {
        type: "output",
        text: "144 meta-my_project/recipes-apps/mock-adxl345-app/files/mock-adxl345-reader.c",
      },
      {
        type: "command",
        text: "head -8 meta-my_project/recipes-apps/mock-adxl345-app/files/mock-adxl345-reader.c",
        delay: 300,
      },
      {
        type: "output",
        text: "// SPDX-License-Identifier: MIT",
      },
      {
        type: "output",
        text: "/*",
      },
      {
        type: "output",
        text: " * mock-adxl345-reader.c — User-space IIO sysfs reader",
      },
      {
        type: "output",
        text: " *",
      },
      {
        type: "output",
        text: " * Reads acceleration data from the mock-adxl345 IIO driver via sysfs",
      },
      {
        type: "output",
        text: " * and prints it to stdout every few seconds.",
        delay: 300,
      },
      {
        type: "info",
        text: "# User-space reader application written in C.",
      },
      {
        type: "info",
        text: "# Reads from /sys/bus/iio/devices/iio:device0/ and converts raw to mg.",
      },
    ],
  },

  // Step 14: Application recipe
  14: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cat meta-my_project/recipes-apps/mock-adxl345-app/mock-adxl345-app.bb",
        delay: 400,
      },
      {
        type: "output",
        text: "SUMMARY = \"Mock ADXL345 IIO reader application\"",
      },
      {
        type: "output",
        text: "LICENSE = \"MIT\"",
      },
      {
        type: "output",
        text: "inherit systemd",
      },
      {
        type: "output",
        text: "RDEPENDS:${PN} += \"mock-adxl345\"",
      },
      {
        type: "output",
        text: "SYSTEMD_SERVICE:${PN} = \"mock-adxl345-reader.service\"",
      },
      {
        type: "output",
        text: "SYSTEMD_AUTO_ENABLE = \"enable\"",
        delay: 300,
      },
      {
        type: "info",
        text: "# Application recipe with systemd service for auto-start at boot.",
      },
      {
        type: "info",
        text: "# RDEPENDS (runtime) vs DEPENDS (build-time) — the app needs the module at runtime.",
      },
    ],
  },

  // Step 15: Image recipe
  15: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cat meta-my_project/recipes-core/images/my-project-image.bb",
        delay: 400,
      },
      {
        type: "output",
        text: "SUMMARY = \"My Project Image with mock-adxl345 driver\"",
      },
      {
        type: "output",
        text: "LICENSE = \"MIT\"",
      },
      {
        type: "output",
        text: "inherit core-image",
      },
      {
        type: "output",
        text: "IMAGE_INSTALL = \"packagegroup-core-boot kernel-modules mock-adxl345 mock-adxl345-app\"",
      },
      {
        type: "output",
        text: "IMAGE_FSTYPES = \"tar.bz2 ext4 wic.bz2\"",
      },
      {
        type: "output",
        text: "IMAGE_ROOTFS_SIZE ?= \"524288\"",
        delay: 300,
      },
      {
        type: "info",
        text: "# Image recipe assembles the final bootable Linux system.",
      },
      {
        type: "info",
        text: "# IMAGE_FSTYPES: tar.bz2 (archive), ext4 (filesystem), wic.bz2 (SD card image).",
      },
    ],
  },

  // Step 17: Build user application
  17: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project/build && bitbake mock-adxl345-app",
      },
      {
        type: "output",
        text: "Loading cache: 100% |########################################| Time: 0:00:01",
      },
      {
        type: "output",
        text: "Loaded 3421 entries from dependency cache.",
      },
      {
        type: "output",
        text: "NOTE: Resolving any missing task queue dependencies",
        delay: 300,
      },
      {
        type: "output",
        text: "NOTE: Executing Tasks",
        delay: 200,
      },
      {
        type: "output",
        text: "Setscene tasks: 342 of 342",
        delay: 150,
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-app-1.0-r0: task do_compile: Started",
        delay: 200,
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-app-1.0-r0: task do_compile: Succeeded",
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-app-1.0-r0: task do_install: Started",
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-app-1.0-r0: task do_install: Succeeded",
        delay: 200,
      },
      {
        type: "output",
        text: "NOTE: Tasks Summary: Attempted 348 tasks of which 345 didn't need to be rerun and all succeeded.",
        delay: 400,
      },
      {
        type: "info",
        text: "# User application built successfully in ~10 seconds!",
      },
      {
        type: "info",
        text: "# sstate-cache skipped 345 of 348 tasks — incremental builds are fast!",
      },
    ],
  },

  // Step 8: Configure bblayers.conf
  8: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project/build && nano conf/bblayers.conf",
        delay: 300,
      },
      {
        type: "output",
        text: "# Editing bblayers.conf — adding all layer paths",
        delay: 200,
      },
      {
        type: "command",
        text: "cat >> conf/bblayers.conf << 'EOF'\nBBLAYERS ?= \" \\\n  /home/johndoe/my_project/sources/poky/meta \\\n  /home/johndoe/my_project/sources/poky/meta-poky \\\n  /home/johndoe/my_project/sources/poky/meta-yocto-bsp \\\n  /home/johndoe/my_project/sources/meta-openembedded/meta-oe \\\n  /home/johndoe/my_project/sources/meta-openembedded/meta-python \\\n  /home/johndoe/my_project/sources/meta-openembedded/meta-networking \\\n  /home/johndoe/my_project/sources/meta-freescale \\\n  /home/johndoe/my_project/sources/meta-imx/meta-imx \\\n  /home/johndoe/my_project/meta-my_project \\\n\"\nEOF",
        delay: 800,
      },
      {
        type: "command",
        text: "bitbake-layers show-layers",
        delay: 500,
      },
      {
        type: "output",
        text: "NOTE: Starting bitbake server...",
      },
      {
        type: "output",
        text: "layer                 path                                      priority",
      },
      {
        type: "output",
        text: "==========================================================================",
      },
      {
        type: "output",
        text: "meta                  /home/johndoe/my_project/sources/poky/meta  5",
      },
      {
        type: "output",
        text: "meta-poky             /home/johndoe/my_project/sources/poky/meta-poky  5",
      },
      {
        type: "output",
        text: "meta-yocto-bsp        /home/johndoe/my_project/sources/poky/meta-yocto-bsp  5",
      },
      {
        type: "output",
        text: "meta-oe               .../sources/meta-openembedded/meta-oe      6",
      },
      {
        type: "output",
        text: "meta-python           .../sources/meta-openembedded/meta-python  7",
      },
      {
        type: "output",
        text: "meta-networking       .../sources/meta-openembedded/meta-networking  5",
      },
      {
        type: "output",
        text: "meta-freescale        .../sources/meta-freescale                 5",
      },
      {
        type: "output",
        text: "meta-imx              .../sources/meta-imx/meta-imx              8",
      },
      {
        type: "output",
        text: "meta-my-project      .../meta-my_project                      5",
        delay: 500,
      },
      {
        type: "info",
        text: "# All 9 layers registered! BitBake can now find recipes in every layer.",
      },
      {
        type: "info",
        text: "# Layer order matters — later layers can override earlier ones.",
      },
    ],
  },

  // Step 9: Create custom layer structure + layer.conf
  9: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project && mkdir -p meta-my_project/conf \\\n  meta-my_project/recipes-kernel/linux/linux-yocto \\\n  meta-my_project/recipes-kernel/mock-adxl345/files \\\n  meta-my_project/recipes-apps/mock-adxl345-app/files \\\n  meta-my_project/recipes-core/images",
      },
      {
        type: "command",
        text: "cat > meta-my_project/conf/layer.conf << 'EOF'\nBBPATH .= \":${LAYERDIR}\"\nBBFILES += \"${LAYERDIR}/recipes-*/*/*.bb \\\n            ${LAYERDIR}/recipes-*/*/*.bbappend\"\nBBFILE_COLLECTIONS += \"my-project\"\nBBFILE_PATTERN_my-project = \"^${LAYERDIR}/\"\nBBFILE_PRIORITY_my-project = \"5\"\nLAYERDEPENDS_my-project = \"core\"\nLAYERSERIES_COMPAT_my-project = \"kirkstone\"\nEOF",
        delay: 800,
      },
      {
        type: "command",
        text: "cat > meta-my_project/recipes-kernel/linux/linux-yocto_%.bbappend << 'EOF'\nFILESEXTRAPATHS:prepend := \"${THISDIR}/${PN}:\"\nSRC_URI += \"file://iio.cfg\"\nEOF",
        delay: 600,
      },
      {
        type: "command",
        text: "cat > meta-my_project/recipes-kernel/linux/linux-yocto/iio.cfg << 'EOF'\nCONFIG_IIO=y\nCONFIG_IIO_BUFFER=y\nCONFIG_IIO_KFIFO_BUF=y\nCONFIG_IIO_TRIGGER=y\nEOF",
        delay: 600,
      },
      {
        type: "command",
        text: "tree meta-my_project",
        delay: 400,
      },
      {
        type: "output",
        text: "meta-my_project/",
      },
      {
        type: "output",
        text: "├── conf",
      },
      {
        type: "output",
        text: "│   └── layer.conf",
      },
      {
        type: "output",
        text: "├── recipes-apps",
      },
      {
        type: "output",
        text: "│   └── mock-adxl345-app",
      },
      {
        type: "output",
        text: "│       └── files",
      },
      {
        type: "output",
        text: "├── recipes-core",
      },
      {
        type: "output",
        text: "│   └── images",
      },
      {
        type: "output",
        text: "└── recipes-kernel",
      },
      {
        type: "output",
        text: "    ├── linux",
      },
      {
        type: "output",
        text: "    │   ├── linux-yocto_%.bbappend",
      },
      {
        type: "output",
        text: "    │   └── linux-yocto",
      },
      {
        type: "output",
        text: "    │       └── iio.cfg",
      },
      {
        type: "output",
        text: "    └── mock-adxl345",
      },
      {
        type: "output",
        text: "        └── files",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "10 directories, 3 files",
        delay: 300,
      },
      {
        type: "info",
        text: "# Custom layer created! This is the standard Yocto layer structure.",
      },
    ],
  },

  // Step 16: bitbake kernel module
  16: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "cd ~/my_project/build && bitbake mock-adxl345",
      },
      {
        type: "output",
        text: "Loading cache: 100% |########################################| Time: 0:00:01",
      },
      {
        type: "output",
        text: "Loaded 3421 entries from dependency cache.",
      },
      {
        type: "output",
        text: "NOTE: Resolving any missing task queue dependencies",
        delay: 400,
      },
      {
        type: "output",
        text: "Build Configuration:",
        delay: 200,
      },
      {
        type: "output",
        text: "BB_VERSION           = \"2.0.0\"",
      },
      {
        type: "output",
        text: "BUILD_SYS            = \"x86_64-linux\"",
      },
      {
        type: "output",
        text: "NATIVELSBSTRING      = \"ubuntu-22.04\"",
      },
      {
        type: "output",
        text: "TARGET_SYS           = \"aarch64-poky-linux\"",
      },
      {
        type: "output",
        text: "MACHINE              = \"imx8mm-lpddr4-evk\"",
      },
      {
        type: "output",
        text: "DISTRO               = \"poky\"",
      },
      {
        type: "output",
        text: "DISTRO_VERSION       = \"4.0\"",
      },
      {
        type: "output",
        text: "TUNE_FEATURES        = \"aarch64 cortexa53\"",
      },
      {
        type: "output",
        text: "",
        delay: 300,
      },
      {
        type: "output",
        text: "NOTE: Executing Tasks",
        delay: 400,
      },
      {
        type: "output",
        text: "Setscene tasks: 12 of 12",
        delay: 200,
      },
      {
        type: "output",
        text: "Currently  1 running, 11 spawned (12 of 12 setscene)",
      },
      {
        type: "output",
        text: "NOTE: Running task 42 of 58 (virtual/kernel:do_compile)",
        delay: 500,
      },
      {
        type: "output",
        text: "NOTE: recipe linux-imx-5.15.71+gitAUTOINC+3f96457df0-r0: task do_compile: Started",
        delay: 600,
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-1.0-r0: task do_compile: Started",
        delay: 300,
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-1.0-r0: task do_compile: Succeeded",
        delay: 200,
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-1.0-r0: task do_install: Started",
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-1.0-r0: task do_install: Succeeded",
        delay: 200,
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-1.0-r0: task do_package: Started",
      },
      {
        type: "output",
        text: "NOTE: recipe mock-adxl345-1.0-r0: task do_package: Succeeded",
        delay: 300,
      },
      {
        type: "output",
        text: "NOTE: Tasks Summary: Attempted 58 tasks of which 55 didn't need to be rerun and all succeeded.",
        delay: 500,
      },
      {
        type: "info",
        text: "# Kernel module built successfully in ~2 minutes!",
      },
    ],
  },

  // Step 18: bitbake full image (short version with skip note)
  18: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "bitbake my-project-image",
      },
      {
        type: "output",
        text: "Loading cache: 100% |########################################| Time: 0:00:01",
      },
      {
        type: "output",
        text: "Loaded 3421 entries from dependency cache.",
      },
      {
        type: "output",
        text: "NOTE: Resolving any missing task queue dependencies",
      },
      {
        type: "output",
        text: "",
        delay: 300,
      },
      {
        type: "output",
        text: "NOTE: Executing Tasks",
      },
      {
        type: "output",
        text: "NOTE: Running task 12 of 4823 (linux-imx:do_fetch)",
      },
      {
        type: "output",
        text: "NOTE: Running task 45 of 4823 (gcc-cross-aarch64:do_configure)",
        delay: 600,
      },
      {
        type: "output",
        text: "...",
        delay: 400,
      },
      {
        type: "info",
        text: "# ⚠️  A full Yocto build takes 2–4 hours on a typical machine.",
        delay: 200,
      },
      {
        type: "info",
        text: "# This is because it compiles: Linux kernel, U-Boot, GCC cross-compiler,",
      },
      {
        type: "info",
        text: "# glibc, OpenSSL, systemd, and hundreds of other packages from source.",
      },
      {
        type: "info",
        text: "# ",
      },
      {
        type: "info",
        text: "# With sstate-cache populated, incremental builds are MUCH faster:",
      },
      {
        type: "info",
        text: "#  - Rebuilding just the kernel module: ~10-30 seconds",
      },
      {
        type: "info",
        text: "#  - Rebuilding the user-space app: ~5-10 seconds",
      },
      {
        type: "info",
        text: "#  - Rebuilding the full image (cached): ~2-5 minutes",
      },
      {
        type: "info",
        text: "# ",
      },
      {
        type: "info",
        text: "# Skipping to the final output...",
        delay: 1000,
      },
      {
        type: "output",
        text: "NOTE: Tasks Summary: Attempted 4823 tasks of which 4780 didn't need to be rerun and all succeeded.",
        delay: 300,
      },
      {
        type: "info",
        text: "# Build completed successfully! 🎉",
      },
    ],
  },

  // Step 19: Verify build artifacts
  19: {
    prompt: "$ ",
    lines: [
      {
        type: "command",
        text: "find tmp -name \"mock_adxl345.ko\" -type f",
      },
      {
        type: "output",
        text: "tmp/work/imx8mm_lpddr4_evk-poky-linux/mock-adxl345/1.0-r0/packages-split/mock-adxl345/lib/modules/5.15.71-lts-next-g3f96457df0/extra/mock_adxl345.ko",
      },
      {
        type: "command",
        text: "file $(find tmp -name \"mock_adxl345.ko\" | head -1)",
        delay: 300,
      },
      {
        type: "output",
        text: "tmp/work/.../extra/mock_adxl345.ko: ELF 64-bit LSB relocatable, ARM aarch64, version 1 (SYSV), BuildID[sha1]=a1b2c3d4e5f6..., not stripped",
      },
      {
        type: "command",
        text: "find tmp -name \"mock-adxl345.dtbo\" -type f",
        delay: 200,
      },
      {
        type: "output",
        text: "tmp/work/imx8mm_lpddr4_evk-poky-linux/mock-adxl345/1.0-r0/packages-split/mock-adxl345/boot/overlays/mock-adxl345.dtbo",
      },
      {
        type: "command",
        text: "ls -lh tmp/deploy/images/imx8mm-lpddr4-evk/ | head -10",
        delay: 200,
      },
      {
        type: "output",
        text: "total 512M",
      },
      {
        type: "output",
        text: "-rw-r--r-- 2 user user  48M Jun  8 12:30 my-project-image-imx8mm-lpddr4-evk.ext4",
      },
      {
        type: "output",
        text: "-rw-r--r-- 2 user user  42M Jun  8 12:30 my-project-image-imx8mm-lpddr4-evk.tar.bz2",
      },
      {
        type: "output",
        text: "-rw-r--r-- 2 user user  44M Jun  8 12:30 my-project-image-imx8mm-lpddr4-evk.wic.bz2",
      },
      {
        type: "output",
        text: "-rw-r--r-- 2 user user  18M Jun  8 12:15 modules-imx8mm-lpddr4-evk.tgz",
        delay: 400,
      },
      {
        type: "info",
        text: "# All build artifacts verified!",
      },
      {
        type: "info",
        text: "#  ✓ kernel module (.ko) — built for ARM aarch64",
      },
      {
        type: "info",
        text: "#  ✓ device tree overlay (.dtbo) — ready for bootloader",
      },
      {
        type: "info",
        text: "#  ✓ disk image (.wic.bz2) — ready to flash to SD card",
      },
    ],
  },
};
