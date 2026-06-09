import { DiagramMeta } from "@/lib/types";

export const diagrams: DiagramMeta[] = [
  {
    id: "architecture_overview",
    title: "Overall Architecture",
    description:
      "High-level view of the My Project Yocto project: sources, custom layer, and build output.",
    svgPath: "/diagrams/architecture_overview.svg",
    stepId: 0, // Show on welcome screen
  },
  {
    id: "build_flow_sequence",
    title: "Build Flow Sequence",
    description:
      "Sequence diagram showing the Yocto build process: fetch, configure, compile, package, and assemble the final image.",
    svgPath: "/diagrams/build_flow_sequence.svg",
    stepId: 16, // Show during build step
  },
  {
    id: "deployment_diagram",
    title: "Deployment Diagram",
    description:
      "How the built image is deployed to the i.MX8M Mini EVK: SD card layout, boot flow, and partition structure.",
    svgPath: "/diagrams/deployment_diagram.svg",
    stepId: 20, // Show at completion
  },
  {
    id: "recipe_dependency_graph",
    title: "Recipe Dependency Graph",
    description:
      "Dependency relationships between our custom recipes (mock-adxl345, mock-adxl345-app, my-project-image) and upstream layers.",
    svgPath: "/diagrams/recipe_dependency_graph.svg",
    stepId: 15, // During image recipe writing
  },
  {
    id: "runtime_data_flow",
    title: "Runtime Data Flow",
    description:
      "How sensor data flows at runtime: kernel module → IIO sysfs → user-space reader → terminal output.",
    svgPath: "/diagrams/runtime_data_flow.svg",
    stepId: 13, // During user-space reader writing
  },
  {
    id: "device_tree_binding",
    title: "Device Tree + Driver Binding",
    description:
      "How the device tree overlay binds to the mock-adxl345 platform driver at boot time, showing the compatible string matching mechanism.",
    svgPath: "/diagrams/device_tree_binding.svg",
    stepId: 11, // During device tree overlay writing
  },
];
