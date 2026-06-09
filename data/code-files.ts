// Code file content keyed by step ID.
// Each step has an array of files that are visible at that step,
// which get displayed in the code viewer.

import { StepFile } from "@/lib/types";

export const codeFiles: Record<number, StepFile[]> = {
  // ---------- Step 8: bblayers.conf ----------
  8: [
    {
      path: "build/conf/bblayers.conf",
      language: "bitbake",
      content: `# POKY_BBLAYERS_CONF_VERSION — bump if bblayers.conf changes incompatibly
POKY_BBLAYERS_CONF_VERSION = "2"

BBPATH = "\${TOPDIR}"
BBFILES ?= ""

# BBLAYERS lists all layers BitBake searches for recipes, classes, and configs.
# Order matters — layers later in the list can override recipes from earlier
# layers via .bbappend files or higher BBFILE_PRIORITY.
BBLAYERS ?= " \\
  /home/johndoe/my_project/sources/poky/meta \\
  /home/johndoe/my_project/sources/poky/meta-poky \\
  /home/johndoe/my_project/sources/poky/meta-yocto-bsp \\
  /home/johndoe/my_project/sources/meta-openembedded/meta-oe \\
  /home/johndoe/my_project/sources/meta-openembedded/meta-python \\
  /home/johndoe/my_project/sources/meta-openembedded/meta-networking \\
  /home/johndoe/my_project/sources/meta-freescale \\
  /home/johndoe/my_project/sources/meta-imx/meta-bsp \\
  /home/johndoe/my_project/meta-my_project \\
"`,
      active: true,
    },
  ],

  // ---------- Step 9: Custom layer structure + layer.conf ----------
  9: [
    {
      path: "meta-my_project/conf/layer.conf",
      language: "bitbake",
      content: `# We have a conf and classes directory, add to BBPATH
BBPATH .= ":\${LAYERDIR}"

# We have recipes-* directories, add to BBFILES
BBFILES += "\${LAYERDIR}/recipes-*/*/*.bb \\
            \${LAYERDIR}/recipes-*/*/*.bbappend"

BBFILE_COLLECTIONS += "my-project"
BBFILE_PATTERN_my-project = "^\${LAYERDIR}/"
BBFILE_PRIORITY_my-project = "5"

LAYERDEPENDS_my-project = "core"
LAYERSERIES_COMPAT_my-project = "kirkstone"`,
      active: true,
    },
    {
      path: "meta-my_project/recipes-kernel/linux/linux-yocto_%.bbappend",
      language: "bitbake",
      content: `# linux-yocto bbappend for My Project — enable IIO subsystem
# for mock-adxl345 driver testing

FILESEXTRAPATHS:prepend := "\${THISDIR}/\${PN}:"

SRC_URI += "file://iio.cfg"`,
    },
    {
      path: "meta-my_project/recipes-kernel/linux/linux-yocto/iio.cfg",
      language: "ini",
      content: `# Enable IIO subsystem for mock-adxl345 driver testing
CONFIG_IIO=y
CONFIG_IIO_BUFFER=y
CONFIG_IIO_KFIFO_BUF=y
CONFIG_IIO_TRIGGER=y`,
    },
  ],

  // ---------- Step 10: Kernel module source ----------
  10: [
    {
      path: "meta-my_project/recipes-kernel/mock-adxl345/files/mock_adxl345.c",
      language: "c",
      content: `// SPDX-License-Identifier: GPL-2.0-only
/*
 * mock_adxl345.c — Simulated ADXL345 3-axis accelerometer IIO driver
 *
 * This is a my_project kernel module that registers with the Linux IIO
 * (Industrial I/O) subsystem and provides three acceleration channels
 * (X, Y, Z) with time-varying mock data. No real hardware is required.
 *
 * The driver uses the platform_driver framework and is instantiated
 * via a device tree overlay with compatible = "my_project,mock-adxl345".
 *
 * Sysfs interface:
 *   /sys/bus/iio/devices/iio:device0/name          -> "mock-adxl345"
 *   /sys/bus/iio/devices/iio:device0/in_accel_x_raw -> simulated X (mg)
 *   /sys/bus/iio/devices/iio:device0/in_accel_y_raw -> simulated Y (mg)
 *   /sys/bus/iio/devices/iio:device0/in_accel_z_raw -> simulated Z (mg)
 *   /sys/bus/iio/devices/iio:device0/in_accel_scale -> 4000 (ug/LSB)
 *
 * Data pattern: X and Y oscillate ±1000 mg with a 60-second period,
 * Z hovers around 980 mg (≈1g) with a small variation.
 */

#include <linux/module.h>
#include <linux/platform_device.h>
#include <linux/iio/iio.h>
#include <linux/iio/sysfs.h>
#include <linux/timekeeping.h>
#include <linux/of.h>

#include "mock_adxl345.h"

struct mock_adxl345_data {
\tstruct device *dev;
\ts64 base_time_ns;\t/* ktime at driver probe — phase reference */
\tint sampling_freq;\t/* Hz */
};

/*
 * Generate a parabolic sine approximation for a given phase angle.
 * phase_deg: angle in degrees [0, 360)
 * Returns: sine * 1000 (range [-1000, 1000])
 *
 * Uses the parabola approximation: sin(x) ≈ 4*x*(PI-x) / PI^2
 * mapped to integer arithmetic. This avoids floating-point and
 * external math library dependencies while producing a smooth
 * waveform suitable for a mock sensor.
 */
static int sine_milli(int phase_deg)
{
\tint deg = phase_deg % 360;

\tif (deg < 180) {
\t\t/* 0..180°: positive half-wave */
\t\treturn (4 * 1000 * deg * (180 - deg)) / (180 * 180);
\t} else {
\t\t/* 180..360°: negative half-wave */
\t\tdeg -= 180;
\t\treturn -(4 * 1000 * deg * (180 - deg)) / (180 * 180);
\t}
}

/*
 * Generate the simulated acceleration value for a given channel.
 * Returns the value in milli-g (mg).
 *
 * X channel: 60-second sine wave, ±1000 mg
 * Y channel: same but 90° phase-shifted (cosine), ±1000 mg
 * Z channel: ~980 mg (≈1g) with a small periodic variation
 */
static int mock_adxl345_get_sample(struct mock_adxl345_data *data, int chan)
{
\ts64 now_ns, elapsed_ns;
\ts64 period_ns = 60LL * NSEC_PER_SEC;
\tint phase_deg;

\tnow_ns = ktime_get_ns();
\telapsed_ns = now_ns - data->base_time_ns;

\t/* Map elapsed time to a phase angle [0, 360) */
\tphase_deg = (int)((elapsed_ns % period_ns) * 360 / period_ns);

\tswitch (chan) {
\tcase MOCK_ADXL345_CHAN_X:
\t\treturn sine_milli(phase_deg);
\tcase MOCK_ADXL345_CHAN_Y:
\t\t/* Cosine = sine shifted by 90 degrees */
\t\treturn sine_milli(phase_deg + 90);
\tcase MOCK_ADXL345_CHAN_Z:
\t\t/* ~1g constant plus a small wobble */
\t\treturn 980 + sine_milli(phase_deg) / 50;
\tdefault:
\t\treturn 0;
\t}
}

static int mock_adxl345_read_raw(struct iio_dev *indio_dev,
\t\t\t\t struct iio_chan_spec const *chan,
\t\t\t\t int *val, int *val2, long mask)
{
\tstruct mock_adxl345_data *data = iio_priv(indio_dev);

\tswitch (mask) {
\tcase IIO_CHAN_INFO_RAW:
\t\t*val = mock_adxl345_get_sample(data, chan->channel);
\t\treturn IIO_VAL_INT;

\tcase IIO_CHAN_INFO_SCALE:
\t\t/* Scale in micro-g per LSB */
\t\t*val = MOCK_ADXL345_SCALE;
\t\treturn IIO_VAL_INT;

\tcase IIO_CHAN_INFO_SAMP_FREQ:
\t\t*val = data->sampling_freq;
\t\treturn IIO_VAL_INT;

\tdefault:
\t\treturn -EINVAL;
\t}
}

static const struct iio_info mock_adxl345_iio_info = {
\t.read_raw = mock_adxl345_read_raw,
};

/*
 * IIO channel specification for a 3-axis accelerometer.
 * Each channel reports RAW values (the simulated sample) and
 * shares a SCALE attribute and SAMP_FREQ across all axes.
 */
static const struct iio_chan_spec mock_adxl345_channels[] = {
\t{
\t\t.type = IIO_ACCEL,
\t\t.modified = 1,
\t\t.channel2 = IIO_MOD_X,
\t\t.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
\t\t.info_mask_shared_by_type = BIT(IIO_CHAN_INFO_SCALE) |
\t\t\t\t\t    BIT(IIO_CHAN_INFO_SAMP_FREQ),
\t\t.scan_index = MOCK_ADXL345_CHAN_X,
\t\t.scan_type = {
\t\t\t.sign = 's',
\t\t\t.realbits = 16,
\t\t\t.storagebits = 16,
\t\t\t.endianness = IIO_CPU,
\t\t},
\t},
\t{
\t\t.type = IIO_ACCEL,
\t\t.modified = 1,
\t\t.channel2 = IIO_MOD_Y,
\t\t.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
\t\t.info_mask_shared_by_type = BIT(IIO_CHAN_INFO_SCALE) |
\t\t\t\t\t    BIT(IIO_CHAN_INFO_SAMP_FREQ),
\t\t.scan_index = MOCK_ADXL345_CHAN_Y,
\t\t.scan_type = {
\t\t\t.sign = 's',
\t\t\t.realbits = 16,
\t\t\t.storagebits = 16,
\t\t\t.endianness = IIO_CPU,
\t\t},
\t},
\t{
\t\t.type = IIO_ACCEL,
\t\t.modified = 1,
\t\t.channel2 = IIO_MOD_Z,
\t\t.info_mask_separate = BIT(IIO_CHAN_INFO_RAW),
\t\t.info_mask_shared_by_type = BIT(IIO_CHAN_INFO_SCALE) |
\t\t\t\t\t    BIT(IIO_CHAN_INFO_SAMP_FREQ),
\t\t.scan_index = MOCK_ADXL345_CHAN_Z,
\t\t.scan_type = {
\t\t\t.sign = 's',
\t\t\t.realbits = 16,
\t\t\t.storagebits = 16,
\t\t\t.endianness = IIO_CPU,
\t\t},
\t},
};

static int mock_adxl345_probe(struct platform_device *pdev)
{
\tstruct device *dev = &pdev->dev;
\tstruct iio_dev *indio_dev;
\tstruct mock_adxl345_data *data;

\tindio_dev = devm_iio_device_alloc(dev, sizeof(*data));
\tif (!indio_dev)
\t\treturn -ENOMEM;

\tdata = iio_priv(indio_dev);
\tdata->dev = dev;
\tdata->base_time_ns = ktime_get_ns();
\tdata->sampling_freq = MOCK_ADXL345_DEFAULT_SAMPLING_FREQ;

\tindio_dev->name = MOCK_ADXL345_IIO_NAME;
\tindio_dev->modes = INDIO_DIRECT_MODE;
\tindio_dev->channels = mock_adxl345_channels;
\tindio_dev->num_channels = ARRAY_SIZE(mock_adxl345_channels);
\tindio_dev->info = &mock_adxl345_iio_info;

\tplatform_set_drvdata(pdev, indio_dev);

\tdev_info(dev, "mock-adxl345 probed successfully\\n");
\treturn devm_iio_device_register(dev, indio_dev);
}

static const struct of_device_id mock_adxl345_of_match[] = {
\t{ .compatible = MOCK_ADXL345_COMPATIBLE },
\t{ /* sentinel */ }
};
MODULE_DEVICE_TABLE(of, mock_adxl345_of_match);

static struct platform_driver mock_adxl345_driver = {
\t.driver = {
\t\t.name = "mock-adxl345",
\t\t.of_match_table = mock_adxl345_of_match,
\t},
\t.probe = mock_adxl345_probe,
};

module_platform_driver(mock_adxl345_driver);

MODULE_AUTHOR("My Project");
MODULE_DESCRIPTION("Mock ADXL345 3-axis accelerometer IIO driver");
MODULE_LICENSE("GPL");`,
      active: true,
    },
    {
      path: "meta-my_project/recipes-kernel/mock-adxl345/files/mock_adxl345.h",
      language: "c",
      content: `/* SPDX-License-Identifier: GPL-2.0-only */
/*
 * mock_adxl345.h — Constants and channel definitions for the mock
 * ADXL345 IIO accelerometer driver.
 */

#ifndef _MOCK_ADXL345_H_
#define _MOCK_ADXL345_H_

/* IIO device name — appears in /sys/bus/iio/devices/iio:device0/name */
#define MOCK_ADXL345_IIO_NAME          "mock-adxl345"

/* Device tree compatible string */
#define MOCK_ADXL345_COMPATIBLE        "my_project,mock-adxl345"

/* Default sampling frequency in Hz */
#define MOCK_ADXL345_DEFAULT_SAMPLING_FREQ  100

/* Scale value in micro-g per LSB (4000 ug/LSB = 4 mg/LSB) */
#define MOCK_ADXL345_SCALE             4000

/* Channel indices */
enum {
\tMOCK_ADXL345_CHAN_X = 0,
\tMOCK_ADXL345_CHAN_Y,
\tMOCK_ADXL345_CHAN_Z,
};

#endif /* _MOCK_ADXL345_H_ */`,
    },
  ],

  // ---------- Step 11: Makefile + DTS ----------
  11: [
    {
      path: "meta-my_project/recipes-kernel/mock-adxl345/files/Makefile",
      language: "makefile",
      content: `# SPDX-License-Identifier: GPL-2.0-only
#
# Out-of-tree kernel module Makefile for mock_adxl345
#
# KERNEL_SRC is provided by Yocto's module.bbclass and points to the
# kernel build tree. The kernel's kbuild system handles the rest.

obj-m := mock_adxl345.o

SRC := $(shell pwd)

all:
\t$(MAKE) -C $(KERNEL_SRC) M=$(SRC) modules

modules_install:
\t$(MAKE) -C $(KERNEL_SRC) M=$(SRC) modules_install

clean:
\t$(MAKE) -C $(KERNEL_SRC) M=$(SRC) clean`,
      active: true,
    },
    {
      path: "meta-my_project/recipes-kernel/mock-adxl345/files/mock-adxl345.dts",
      language: "dts",
      content: `// Device tree overlay for the mock-adxl345 platform device
// This creates a virtual device that our driver binds to.
// Applied at boot via the bootloader or kernel DT overlay mechanism.
//
// Compatible string MUST match MOCK_ADXL345_COMPATIBLE in the driver.

/dts-v1/;
/plugin/;

/ {
\tcompatible = "my_project,mock-adxl345";

\tfragment@0 {
\t\ttarget-path = "/";
\t\t__overlay__ {
\t\t\tmock_adxl345: mock-adxl345 {
\t\t\t\tcompatible = "my_project,mock-adxl345";
\t\t\t\tstatus = "okay";
\t\t\t};
\t\t};
\t};
};`,
    },
  ],

  // ---------- Step 12: Kernel module recipe ----------
  12: [
    {
      path: "meta-my_project/recipes-kernel/mock-adxl345/mock-adxl345_1.0.bb",
      language: "bitbake",
      content: `SUMMARY = "Mock ADXL345 IIO accelerometer driver"
DESCRIPTION = "An out-of-tree Linux kernel module that simulates an ADXL345 \\
3-axis accelerometer using the IIO (Industrial I/O) subsystem. \\
Generates time-varying mock data on X, Y, and Z channels."
LICENSE = "GPL-2.0-only"
LIC_FILES_CHKSUM = "file://\${COMMON_LICENSE_DIR}/GPL-2.0-only;md5=801f80980d171dd6425610833a22dbe6"

inherit module

SRC_URI = " \\
    file://mock_adxl345.c \\
    file://mock_adxl345.h \\
    file://Makefile \\
    file://mock-adxl345.dts \\
"

S = "\${WORKDIR}"

# Ensure the kernel is built first (provides the headers and build system)
# dtc-native needed for device tree overlay compilation in do_compile:append
DEPENDS += "virtual/kernel dtc-native"

# Auto-load the module at boot time
KERNEL_MODULE_AUTOLOAD += "mock-adxl345"

# Compile the device tree overlay alongside the module
do_compile:append() {
    dtc -@ -I dts -O dtb -o \${S}/mock-adxl345.dtbo \${S}/mock-adxl345.dts
}

# Install the compiled overlay into the boot partition
do_install:append() {
    install -d \${D}/boot/overlays
    install -m 0644 \${S}/mock-adxl345.dtbo \${D}/boot/overlays/
}

# Package the overlay as part of the kernel-module package
FILES:\${PN} += "/boot/overlays/mock-adxl345.dtbo"`,
      active: true,
    },
  ],

  // ---------- Step 13: User-space reader ----------
  13: [
    {
      path: "meta-my_project/recipes-apps/mock-adxl345-app/files/mock-adxl345-reader.c",
      language: "c",
      content: `// SPDX-License-Identifier: MIT
/*
 * mock-adxl345-reader.c — User-space IIO sysfs reader
 *
 * Reads acceleration data from the mock-adxl345 IIO driver via sysfs
 * and prints it to stdout every few seconds.
 *
 * The IIO sysfs interface used:
 *   /sys/bus/iio/devices/iio:device0/in_accel_x_raw
 *   /sys/bus/iio/devices/iio:device0/in_accel_y_raw
 *   /sys/bus/iio/devices/iio:device0/in_accel_z_raw
 *   /sys/bus/iio/devices/iio:device0/in_accel_scale
 *
 * Physical value (micro-g) = raw * scale
 * Physical value (mg)      = raw * scale / 1000
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>

/* Paths to the IIO sysfs attributes created by our mock-adxl345 driver */
#define IIO_DEVICE_DIR   "/sys/bus/iio/devices/iio:device0"
#define ACCEL_X_RAW      IIO_DEVICE_DIR "/in_accel_x_raw"
#define ACCEL_Y_RAW      IIO_DEVICE_DIR "/in_accel_y_raw"
#define ACCEL_Z_RAW      IIO_DEVICE_DIR "/in_accel_z_raw"
#define ACCEL_SCALE      IIO_DEVICE_DIR "/in_accel_scale"
#define DEVICE_NAME      IIO_DEVICE_DIR "/name"

/* How long to sleep between readings (seconds) */
#define INTERVAL_SEC     2

/*
 * Read an integer from a sysfs file.
 * Returns 0 on success, -1 on error.
 */
static int read_sysfs_int(const char *path, int *value)
{
\tFILE *fp;
\tint ret;

\tfp = fopen(path, "r");
\tif (!fp) {
\t\tperror(path);
\t\treturn -1;
\t}

\tret = fscanf(fp, "%d", value);
\tfclose(fp);

\tif (ret != 1) {
\t\tfprintf(stderr, "Failed to parse integer from %s\\n", path);
\t\treturn -1;
\t}

\treturn 0;
}

/*
 * Read a string from a sysfs file into buf (size bytes).
 * Returns 0 on success, -1 on error. Strips trailing newline.
 */
static int read_sysfs_str(const char *path, char *buf, size_t size)
{
\tFILE *fp;

\tfp = fopen(path, "r");
\tif (!fp) {
\t\tperror(path);
\t\treturn -1;
\t}

\tif (!fgets(buf, (int)size, fp)) {
\t\tfclose(fp);
\t\treturn -1;
\t}

\t/* Strip trailing newline */
\tsize_t len = strlen(buf);
\tif (len > 0 && buf[len - 1] == '\\n')
\t\tbuf[len - 1] = '\\0';

\tfclose(fp);
\treturn 0;
}

int main(void)
{
\tchar name[64];
\tint x_raw, y_raw, z_raw, scale;
\tint x_mg, y_mg, z_mg;

\tprintf("=== mock-adxl345-reader ===\\n");
\tprintf("Reading IIO acceleration data every %d seconds\\n", INTERVAL_SEC);
\tprintf("Press Ctrl+C to stop.\\n\\n");

\t/* Verify the device exists and print its name */
\tif (read_sysfs_str(DEVICE_NAME, name, sizeof(name)) != 0) {
\t\tfprintf(stderr, "Error: IIO device not found at %s\\n",
\t\t\tIIO_DEVICE_DIR);
\t\tfprintf(stderr, "Is the mock-adxl345 driver loaded and the "
\t\t\t"device tree overlay applied?\\n");
\t\treturn EXIT_FAILURE;
\t}
\tprintf("Device: %s\\n", name);

\t/* Read scale once — it doesn't change at runtime */
\tif (read_sysfs_int(ACCEL_SCALE, &scale) != 0) {
\t\tfprintf(stderr, "Error: Cannot read scale attribute\\n");
\t\treturn EXIT_FAILURE;
\t}
\tprintf("Scale:  %d micro-g/LSB\\n\\n", scale);

\t/* Main loop: read raw values, convert, print */
\tprintf("%-8s %8s %8s %8s | %8s %8s %8s\\n",
\t       "Time", "X_raw", "Y_raw", "Z_raw", "X(mg)", "Y(mg)", "Z(mg)");
\tprintf("-------- -------- -------- -------- | -------- -------- --------\\n");

\tfor (int tick = 0; ; tick++) {
\t\tif (read_sysfs_int(ACCEL_X_RAW, &x_raw) != 0 ||
\t\t    read_sysfs_int(ACCEL_Y_RAW, &y_raw) != 0 ||
\t\t    read_sysfs_int(ACCEL_Z_RAW, &z_raw) != 0) {
\t\t\t/* Device might have disappeared — wait and retry */
\t\t\tfprintf(stderr, "Read error, retrying...\\n");
\t\t\tsleep(INTERVAL_SEC);
\t\t\tcontinue;
\t\t}

\t\t/*
\t\t * Convert raw ADC counts to milli-g:
\t\t *   value_mg = raw * scale / 1000
\t\t *
\t\t * For our mock driver, raw values ARE already in mg
\t\t * (the driver's read_raw returns mg directly), and
\t\t * scale is 4000 micro-g/LSB. For a real ADXL345 the
\t\t * raw would be ADC counts and scale would convert them.
\t\t */
\t\tx_mg = x_raw * scale / 1000;
\t\ty_mg = y_raw * scale / 1000;
\t\tz_mg = z_raw * scale / 1000;

\t\tprintf("%-8d %8d %8d %8d | %8d %8d %8d\\n",
\t\t       tick * INTERVAL_SEC, x_raw, y_raw, z_raw,
\t\t       x_mg, y_mg, z_mg);

\t\tfflush(stdout);
\t\tsleep(INTERVAL_SEC);
\t}

\treturn EXIT_SUCCESS;
}`,
      active: true,
    },
  ],

  // ---------- Step 14: User-space app recipe ----------
  14: [
    {
      path: "meta-my_project/recipes-apps/mock-adxl345-app/mock-adxl345-app.bb",
      language: "bitbake",
      content: `SUMMARY = "Mock ADXL345 IIO reader application"
DESCRIPTION = "A simple terminal application that reads acceleration data \\
from the mock-adxl345 IIO kernel driver via sysfs and prints it to stdout \\
every few seconds. Includes a systemd service for auto-start at boot."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://\${COMMON_LICENSE_DIR}/MIT;md5=0835ade698e0bcf8506ecda2f7b4f302"

SRC_URI = " \\
    file://mock-adxl345-reader.c \\
    file://Makefile \\
    file://mock-adxl345-reader.service \\
"

S = "\${WORKDIR}"

# Standard C application — no autotools/cmake needed
inherit systemd

# Ensure the kernel module is installed first (RDEPENDS, not DEPENDS —
# this is a runtime dependency, not a build-time one)
RDEPENDS:\${PN} += "mock-adxl345"

# systemd service configuration
SYSTEMD_SERVICE:\${PN} = "mock-adxl345-reader.service"
SYSTEMD_AUTO_ENABLE = "enable"

do_compile() {
    oe_runmake
}

do_install() {
    # Install the binary
    install -d \${D}/usr/bin
    install -m 0755 \${S}/mock-adxl345-reader \${D}/usr/bin/

    # Install the systemd service unit
    install -d \${D}\${systemd_system_unitdir}
    install -m 0644 \${S}/mock-adxl345-reader.service \${D}\${systemd_system_unitdir}/
}

# Package the systemd service unit
FILES:\${PN} += "\${systemd_system_unitdir}/mock-adxl345-reader.service"`,
      active: true,
    },
    {
      path: "meta-my_project/recipes-apps/mock-adxl345-app/files/mock-adxl345-reader.service",
      language: "ini",
      content: `[Unit]
Description=Mock ADXL345 IIO Reader
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/mock-adxl345-reader
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`,
    },
    {
      path: "meta-my_project/recipes-apps/mock-adxl345-app/files/Makefile",
      language: "makefile",
      content: `# User-space Makefile for mock-adxl345-reader
# A simple C application — just compile and link.

CC ?= gcc
CFLAGS ?= -O2 -Wall -Wextra

TARGET = mock-adxl345-reader
SRCS = mock-adxl345-reader.c

all: \$(TARGET)

\$(TARGET): \$(SRCS)
\t\$(CC) \$(CFLAGS) -o \$@ \$^

clean:
\trm -f \$(TARGET)

.PHONY: all clean`,
    },
  ],

  // ---------- Step 15: Image recipe ----------
  15: [
    {
      path: "meta-my_project/recipes-core/images/my-project-image.bb",
      language: "bitbake",
      content: `SUMMARY = "My Project Image with mock-adxl345 driver"
DESCRIPTION = "Minimal bootable image for the i.MX8M Mini EVK that includes \\
the mock-adxl345 out-of-tree kernel module and its device tree overlay."
LICENSE = "MIT"

inherit core-image

IMAGE_INSTALL = " \\
    packagegroup-core-boot \\
    kernel-modules \\
    mock-adxl345 \\
    mock-adxl345-app \\
    \${CORE_IMAGE_EXTRA_INSTALL} \\
"

# Enough space for the rootfs plus headroom
IMAGE_ROOTFS_SIZE ?= "524288"

# The i.MX8M Mini EVK boots from microSD; produce a WIC image
IMAGE_FSTYPES = "tar.bz2 ext4 wic.bz2"`,
      active: true,
    },
  ],

  // ---------- Step 7: local.conf (snippet shown during config step) ----------
  7: [
    {
      path: "build/conf/local.conf",
      language: "bitbake",
      content: `# ... (hundreds of lines of defaults omitted) ...

# Target machine — NXP i.MX8M Mini EVK
MACHINE = "imx8mm-lpddr4-evk"

# Build parallelism (adjust to your CPU core count)
BB_NUMBER_THREADS = "32"
PARALLEL_MAKE = "-j 32"

# Shared download and sstate caches (saves time across rebuilds)
DL_DIR = "/home/johndoe/my_project/downloads"
SSTATE_DIR = "/home/johndoe/my_project/sstate-cache"

# Accept NXP/Freescale EULA (required for GPU, VPU firmware)
ACCEPT_FSL_EULA = "1"

# Remove work directories after packaging (saves disk space)
INHERIT += "rm_work"`,
      active: true,
    },
    {
      path: "build/conf/bblayers.conf",
      language: "bitbake",
      content: `# POKY_BBLAYERS_CONF_VERSION is increased each time build/conf/bblayers.conf
# changes incompatibly
POKY_BBLAYERS_CONF_VERSION = "2"

BBPATH = "\${TOPDIR}"
BBFILES ?= ""

BBLAYERS ?= " \\
  /home/johndoe/my_project/sources/poky/meta \\
  /home/johndoe/my_project/sources/poky/meta-poky \\
  /home/johndoe/my_project/sources/poky/meta-yocto-bsp \\
  /home/johndoe/my_project/sources/meta-openembedded/meta-oe \\
  /home/johndoe/my_project/sources/meta-openembedded/meta-python \\
  /home/johndoe/my_project/sources/meta-openembedded/meta-networking \\
  /home/johndoe/my_project/sources/meta-freescale \\
  /home/johndoe/my_project/sources/meta-imx/meta-imx \\
  /home/johndoe/my_project/meta-my_project \\
"`,
    },
  ],
};
