export type Category = "Software" | "Mechanical" | "Electrical";

export interface PortfolioProject {
  title: string;
  year: string;
  description: string;
  image: string;
}

export interface Engineer {
  slug: string;
  name: string;
  role: string;
  badge?: "Verified" | "New";
  category: Category;
  tags: string[];
  photo: string;
  location: string;
  experience: string;
  completedProjects: number;
  availableNow: boolean;
  bio: string[];
  primaryFocus: string;
  toolsStack: string[];
  certifications: string[];
  hourlyRate: string;
  responseTime: string;
  portfolio: PortfolioProject[];
}

export const engineers: Engineer[] = [
  {
    slug: "marcus-chen",
    name: "Marcus Chen",
    role: "Structural Systems Designer / Lead Architect",
    badge: "Verified",
    category: "Software",
    tags: ["Rust", "Distributed Systems", "AWS"],
    photo: "https://picsum.photos/seed/marcus-chen/480/480",
    location: "San Francisco, CA",
    experience: "12+ Years",
    completedProjects: 48,
    availableNow: true,
    bio: [
      "Marcus is a results-oriented Structural Engineer specializing in high-performance building systems and industrial infrastructure. With a decade of experience navigating complex urban regulatory environments and technical constraints, he delivers precision-engineered solutions that balance aesthetic vision with structural integrity.",
      "His approach integrates advanced computational modeling with traditional engineering principles to optimize material usage and environmental sustainability. Marcus has led multidisciplinary teams on projects ranging from seismic retrofitting for historic landmarks to large-scale industrial HVAC integration.",
    ],
    primaryFocus: "Structural Engineering",
    toolsStack: ["AutoCAD", "Revit", "SAP2000", "Bluebeam", "Rhino3D"],
    certifications: ["P.E. License #CA-99231", "LEED AP Building Design", "ASCE Senior Member"],
    hourlyRate: "-",
    responseTime: "< 4 Hours",
    portfolio: [
      {
        title: "Bridge Structural Analysis",
        year: "2023",
        description: "Seismic load calculation and stress testing for the Northside Transit Link.",
        image: "https://picsum.photos/seed/bridge-structural/640/420",
      },
      {
        title: "Industrial HVAC Design",
        year: "2022",
        description: "Efficient thermodynamic routing for a 50,000 sq ft manufacturing plant.",
        image: "https://picsum.photos/seed/industrial-hvac/640/420",
      },
    ],
  },
  {
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    role: "Mechatronics Specialist",
    category: "Mechanical",
    tags: ["CAD Design", "Robotics", "Prototyping"],
    photo: "https://picsum.photos/seed/elena-rodriguez/480/480",
    location: "Austin, TX",
    experience: "8 Years",
    completedProjects: 31,
    availableNow: true,
    bio: [
      "Elena designs and prototypes robotic systems for manufacturing automation, bridging mechanical, electrical, and software disciplines. She specializes in translating early-stage concepts into production-ready hardware.",
      "Her recent work focuses on collaborative robot arms and modular fixturing systems used in mid-volume assembly lines, cutting integration time for clients by nearly half.",
    ],
    primaryFocus: "Mechatronics & Robotics",
    toolsStack: ["SolidWorks", "Fusion 360", "ROS", "Arduino"],
    certifications: ["CSWP Certified", "Six Sigma Green Belt"],
    hourlyRate: "$90/hr",
    responseTime: "< 6 Hours",
    portfolio: [
      {
        title: "Collaborative Assembly Arm",
        year: "2023",
        description: "Six-axis cobot fixture design for a mid-volume electronics assembly line.",
        image: "https://picsum.photos/seed/cobot-arm/640/420",
      },
      {
        title: "Modular Fixture System",
        year: "2021",
        description: "Reconfigurable jigs cutting changeover time by 40% across product lines.",
        image: "https://picsum.photos/seed/modular-fixture/640/420",
      },
    ],
  },
  {
    slug: "julian-thorne",
    name: "Julian Thorne",
    role: "Embedded Systems Lead",
    badge: "New",
    category: "Electrical",
    tags: ["PCB Design", "C++", "FPGA"],
    photo: "https://picsum.photos/seed/julian-thorne/480/480",
    location: "Boston, MA",
    experience: "6 Years",
    completedProjects: 19,
    availableNow: false,
    bio: [
      "Julian builds low-level firmware and custom PCBs for sensor-heavy embedded products, from first prototype through FCC-certified production runs.",
      "He's spent the last two years focused on FPGA-accelerated signal processing for industrial monitoring equipment operating in harsh environments.",
    ],
    primaryFocus: "Embedded Systems & PCB Design",
    toolsStack: ["Altium Designer", "KiCad", "Vivado", "STM32"],
    certifications: ["IPC-A-610 Certified"],
    hourlyRate: "$95/hr",
    responseTime: "< 12 Hours",
    portfolio: [
      {
        title: "Industrial Vibration Sensor",
        year: "2023",
        description: "FPGA-accelerated signal processing board for predictive maintenance rigs.",
        image: "https://picsum.photos/seed/vibration-sensor/640/420",
      },
      {
        title: "Custom Motor Controller",
        year: "2022",
        description: "Compact 4-layer PCB driving brushless motors for a robotics startup.",
        image: "https://picsum.photos/seed/motor-controller/640/420",
      },
    ],
  },
  {
    slug: "maya-wu",
    name: "Maya Wu",
    role: "AI Infrastructure Engineer",
    category: "Software",
    tags: ["PyTorch", "Kubernetes", "MLOps"],
    photo: "https://picsum.photos/seed/maya-wu/480/480",
    location: "Seattle, WA",
    experience: "7 Years",
    completedProjects: 26,
    availableNow: true,
    bio: [
      "Maya builds and scales training infrastructure for ML teams, from GPU cluster orchestration to reproducible experiment pipelines.",
      "She's led infrastructure for teams training vision and language models at production scale, cutting training costs through smarter scheduling and mixed-precision pipelines.",
    ],
    primaryFocus: "ML Infrastructure & MLOps",
    toolsStack: ["PyTorch", "Kubernetes", "Terraform", "Ray"],
    certifications: ["CKA Certified Kubernetes Administrator"],
    hourlyRate: "$110/hr",
    responseTime: "< 4 Hours",
    portfolio: [
      {
        title: "GPU Cluster Autoscaler",
        year: "2023",
        description: "Cost-aware autoscaling for multi-tenant training clusters on Kubernetes.",
        image: "https://picsum.photos/seed/gpu-cluster/640/420",
      },
      {
        title: "Experiment Tracking Pipeline",
        year: "2022",
        description: "Reproducible training pipeline adopted across three research teams.",
        image: "https://picsum.photos/seed/experiment-pipeline/640/420",
      },
    ],
  },
];

export function getEngineer(slug: string): Engineer | undefined {
  return engineers.find((engineer) => engineer.slug === slug);
}
