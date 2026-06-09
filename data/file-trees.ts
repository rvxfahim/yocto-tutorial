import { FileTreeNode } from "@/lib/types";

// File tree snapshots keyed by a string ID.
// Each shows the project directory structure as it would appear
// at that point in the tutorial.

// Representative top-level structure of the poky reference distribution
// after git clone. Used across multiple file tree snapshots.
const pokyChildren: FileTreeNode[] = [
  { name: "bitbake", type: "folder", children: [] },
  { name: "meta", type: "folder", children: [] },
  { name: "meta-poky", type: "folder", children: [] },
  { name: "meta-selftest", type: "folder", children: [] },
  { name: "meta-skeleton", type: "folder", children: [] },
  { name: "meta-yocto-bsp", type: "folder", children: [] },
  { name: "documentation", type: "folder", children: [] },
  { name: "scripts", type: "folder", children: [] },
  { name: "oe-init-build-env", type: "file", language: "shell" },
  { name: "LICENSE", type: "file" },
  { name: "README.hardware", type: "file" },
];

export const fileTrees: Record<string, FileTreeNode> = {
  // Before any project setup — nothing created yet
  "pre-project": {
    name: "my_project",
    type: "folder",
    children: [],
  },

  // After creating the project directory
  "empty-project": {
    name: "my_project",
    type: "folder",
    children: [
      { name: "sources", type: "folder", children: [] },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },

  // After cloning poky
  "after-poky": {
    name: "my_project",
    type: "folder",
    children: [
      {
        name: "sources",
        type: "folder",
        children: [
          { name: "poky", type: "folder", children: pokyChildren },
        ],
      },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },

  // After cloning all layers
  "all-sources": {
    name: "my_project",
    type: "folder",
    children: [
      {
        name: "sources",
        type: "folder",
        children: [
          { name: "poky", type: "folder", children: pokyChildren },
          { name: "meta-openembedded", type: "folder", children: [] },
          { name: "meta-freescale", type: "folder", children: [] },
          { name: "meta-imx", type: "folder", children: [] },
        ],
      },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },

  // After sourcing oe-init-build-env
  "after-setup": {
    name: "my_project",
    type: "folder",
    children: [
      {
        name: "build",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "local.conf", type: "file", language: "bitbake" },
              { name: "bblayers.conf", type: "file", language: "bitbake" },
              { name: "templateconf.cfg", type: "file" },
            ],
          },
        ],
      },
      {
        name: "sources",
        type: "folder",
        children: [
          { name: "poky", type: "folder", children: pokyChildren },
          { name: "meta-openembedded", type: "folder", children: [] },
          { name: "meta-freescale", type: "folder", children: [] },
          { name: "meta-imx", type: "folder", children: [] },
        ],
      },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },

  // After creating meta-my_project structure
  "layer-structure": {
    name: "my_project",
    type: "folder",
    children: [
      {
        name: "build",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "local.conf", type: "file", language: "bitbake" },
              { name: "bblayers.conf", type: "file", language: "bitbake" },
            ],
          },
        ],
      },
      {
        name: "meta-my_project",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "layer.conf", type: "file", language: "bitbake" },
            ],
          },
          {
            name: "recipes-kernel",
            type: "folder",
            children: [
              {
                name: "linux",
                type: "folder",
                children: [
                  {
                    name: "linux-yocto",
                    type: "folder",
                    children: [
                      { name: "iio.cfg", type: "file", language: "ini" },
                    ],
                  },
                  { name: "linux-yocto_%.bbappend", type: "file", language: "bitbake" },
                ],
              },
              {
                name: "mock-adxl345",
                type: "folder",
                children: [
                  { name: "files", type: "folder", children: [] },
                ],
              },
            ],
          },
          {
            name: "recipes-apps",
            type: "folder",
            children: [],
          },
          {
            name: "recipes-core",
            type: "folder",
            children: [
              {
                name: "images",
                type: "folder",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "sources",
        type: "folder",
        children: [
          { name: "poky", type: "folder", children: pokyChildren },
          { name: "meta-openembedded", type: "folder", children: [] },
          { name: "meta-freescale", type: "folder", children: [] },
          { name: "meta-imx", type: "folder", children: [] },
        ],
      },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },

  // After writing kernel module source files
  "kernel-source": {
    name: "my_project",
    type: "folder",
    children: [
      {
        name: "build",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "local.conf", type: "file", language: "bitbake" },
              { name: "bblayers.conf", type: "file", language: "bitbake" },
            ],
          },
        ],
      },
      {
        name: "meta-my_project",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "layer.conf", type: "file", language: "bitbake" },
            ],
          },
          {
            name: "recipes-kernel",
            type: "folder",
            children: [
              {
                name: "linux",
                type: "folder",
                children: [
                  {
                    name: "linux-yocto",
                    type: "folder",
                    children: [
                      { name: "iio.cfg", type: "file", language: "ini" },
                    ],
                  },
                  { name: "linux-yocto_%.bbappend", type: "file", language: "bitbake" },
                ],
              },
              {
                name: "mock-adxl345",
                type: "folder",
                children: [
                  {
                    name: "files",
                    type: "folder",
                    children: [
                      { name: "mock_adxl345.c", type: "file", language: "c" },
                      { name: "mock_adxl345.h", type: "file", language: "c" },
                      { name: "Makefile", type: "file", language: "makefile" },
                      { name: "mock-adxl345.dts", type: "file", language: "dts" },
                    ],
                  },
                  { name: "mock-adxl345_1.0.bb", type: "file", language: "bitbake" },
                ],
              },
            ],
          },
          {
            name: "recipes-apps",
            type: "folder",
            children: [],
          },
          {
            name: "recipes-core",
            type: "folder",
            children: [
              {
                name: "images",
                type: "folder",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "sources",
        type: "folder",
        children: [
          { name: "poky", type: "folder", children: pokyChildren },
          { name: "meta-openembedded", type: "folder", children: [] },
          { name: "meta-freescale", type: "folder", children: [] },
          { name: "meta-imx", type: "folder", children: [] },
        ],
      },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },

  // After adding user-space app
  "full-project": {
    name: "my_project",
    type: "folder",
    children: [
      {
        name: "build",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "local.conf", type: "file", language: "bitbake" },
              { name: "bblayers.conf", type: "file", language: "bitbake" },
            ],
          },
        ],
      },
      {
        name: "meta-my_project",
        type: "folder",
        children: [
          {
            name: "conf",
            type: "folder",
            children: [
              { name: "layer.conf", type: "file", language: "bitbake" },
            ],
          },
          {
            name: "recipes-kernel",
            type: "folder",
            children: [
              {
                name: "linux",
                type: "folder",
                children: [
                  {
                    name: "linux-yocto",
                    type: "folder",
                    children: [
                      { name: "iio.cfg", type: "file", language: "ini" },
                    ],
                  },
                  { name: "linux-yocto_%.bbappend", type: "file", language: "bitbake" },
                ],
              },
              {
                name: "mock-adxl345",
                type: "folder",
                children: [
                  {
                    name: "files",
                    type: "folder",
                    children: [
                      { name: "mock_adxl345.c", type: "file", language: "c" },
                      { name: "mock_adxl345.h", type: "file", language: "c" },
                      { name: "Makefile", type: "file", language: "makefile" },
                      { name: "mock-adxl345.dts", type: "file", language: "dts" },
                    ],
                  },
                  { name: "mock-adxl345_1.0.bb", type: "file", language: "bitbake" },
                ],
              },
            ],
          },
          {
            name: "recipes-apps",
            type: "folder",
            children: [
              {
                name: "mock-adxl345-app",
                type: "folder",
                children: [
                  {
                    name: "files",
                    type: "folder",
                    children: [
                      { name: "mock-adxl345-reader.c", type: "file", language: "c" },
                      { name: "Makefile", type: "file", language: "makefile" },
                      { name: "mock-adxl345-reader.service", type: "file", language: "ini" },
                    ],
                  },
                  { name: "mock-adxl345-app.bb", type: "file", language: "bitbake" },
                ],
              },
            ],
          },
          {
            name: "recipes-core",
            type: "folder",
            children: [
              {
                name: "images",
                type: "folder",
                children: [
                  { name: "my-project-image.bb", type: "file", language: "bitbake" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "sources",
        type: "folder",
        children: [
          { name: "poky", type: "folder", children: pokyChildren },
          { name: "meta-openembedded", type: "folder", children: [] },
          { name: "meta-freescale", type: "folder", children: [] },
          { name: "meta-imx", type: "folder", children: [] },
        ],
      },
      { name: "downloads", type: "folder", children: [] },
      { name: "sstate-cache", type: "folder", children: [] },
    ],
  },
};
