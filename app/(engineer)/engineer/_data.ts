export type Category = "Civil" | "Architect" | "Mechanical" | "Electrical";

export interface TechnicalChallenge {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  projectRef: string;
  client: string;
  category: Category;
  year: string;
  tags: string[];
  image: string;
  summary: string;
  brief: string;
  technicalChallenges: TechnicalChallenge[];
  budgetRange: string;
  budgetRange1: string;
  targetTimeline: string;
  deadline: string;
  applicantsCount: number;
  availableNow: boolean;
}

export const projects: Project[] = [
  {
    slug: "bridge-structural-analysis",
    title: "Bridge Structural Analysis",
    projectRef: "Northside Transit Link — Project #772-B",
    client: "Urban Infrastructure Group",
    category: "Mechanical",
    year: "2023",
    tags: ["#Structural", "#Seismic", "#Steel", "#2024_Q3"],
    image: "https://picsum.photos/seed/bridge-structural/900/500",
    summary: "Seismic load calculation and stress testing for the Northside Transit Link.",
    brief:
      "The Northside Transit Link expansion requires a comprehensive structural integrity audit and seismic resilience plan for the historic mid-river pylon systems. This project involves non-destructive testing (NDT), load-bearing calculations for future light-rail integration, and a full material degradation assessment.",
    technicalChallenges: [
      {
        title: "Seismic Load Requirements",
        description:
          "Must withstand Magnitude 7.5 seismic events with less than 0.2% structural deflection.",
      },
      {
        title: "Material Constraints",
        description:
          "Integration with 1940s-era riveted steel plates using modern carbon-fiber reinforcement.",
      },
      {
        title: "Environmental Resistance",
        description:
          "Corrosion mitigation strategy for brackish water exposure on submerged foundations.",
      },
    ],
    budgetRange: "MMK 40,500,000",
    budgetRange1: "MMK 55,000,000",
    targetTimeline: "24 Weeks",
    deadline: "Aug 15th, 2024",
    applicantsCount: 12,
    availableNow: true,
  },
  {
    slug: "industrial-hvac-design",
    title: "Industrial HVAC Design",
    projectRef: "Vertigo Data Centers — Facility Retrofit",
    client: "Vertigo Data Centers",
    category: "Mechanical",
    year: "2022",
    tags: ["#HVAC", "#Thermal", "#Manufacturing"],
    image: "https://picsum.photos/seed/industrial-hvac/900/500",
    summary: "Efficient thermodynamic routing for a 50,000 sq ft manufacturing plant.",
    brief:
      "Vertigo Data Centers requires efficient thermodynamic routing across a 50,000 sq ft manufacturing plant to reduce cooling costs while maintaining strict humidity tolerances for sensitive equipment.",
    technicalChallenges: [
      {
        title: "Thermal Load Balancing",
        description: "Even airflow distribution across mixed-use zones with varying heat output.",
      },
      {
        title: "Energy Efficiency",
        description: "Target a 30% reduction in HVAC energy consumption versus the legacy system.",
      },
      {
        title: "Noise Constraints",
        description: "Duct routing must stay under 45dB in adjacent office areas.",
      },
    ],
    budgetRange: "MMK 28,000,000",
    budgetRange1: "MMK 35,000,000",
    targetTimeline: "16 Weeks",
    deadline: "Jul 30th, 2024",
    applicantsCount: 8,
    availableNow: true,
  },
  {
    slug: "solar-farm-layout-optimization",
    title: "Solar Farm Layout Optimization",
    projectRef: "EcoPower Solutions — Sector 4 Expansion",
    client: "EcoPower Solutions",
    category: "Electrical",
    year: "2023",
    tags: ["#Solar", "#GridDesign", "#Renewable"],
    image: "https://picsum.photos/seed/solar-farm/900/500",
    summary: "Panel layout optimization for uneven terrain across a Sector 4 solar expansion.",
    brief:
      "EcoPower Solutions is expanding its Sector 4 solar array and needs panel layout optimization to maximize yield across uneven terrain while minimizing shading losses between rows.",
    technicalChallenges: [
      {
        title: "Terrain Variance",
        description: "Layout must account for 8% grade changes across the array footprint.",
      },
      {
        title: "Shading Loss",
        description: "Row spacing optimized to keep inter-row shading losses under 3%.",
      },
      {
        title: "Grid Interconnect",
        description: "Design must comply with regional grid interconnection standards.",
      },
    ],
    budgetRange: "MMK 15,000,000",
    budgetRange1: "MMK 20,000,000",
    targetTimeline: "10 Weeks",
    deadline: "Sep 5th, 2024",
    applicantsCount: 5,
    availableNow: false,
  },
  {
    slug: "aerodynamics-simulation-v2",
    title: "Aerodynamics Simulation - V2",
    projectRef: "AeroTech Systems — Drone Airframe Revision",
    client: "AeroTech Systems",
    category: "Mechanical",
    year: "2023",
    tags: ["#CFD", "#Simulation", "#Aerospace"],
    image: "https://picsum.photos/seed/aerodynamics-sim/900/500",
    summary: "Second-pass CFD simulation validating drag reduction on a revised drone airframe.",
    brief:
      "AeroTech Systems needs a second-pass CFD simulation on their revised drone airframe to validate drag reduction estimates ahead of a physical wind-tunnel test.",
    technicalChallenges: [
      {
        title: "Simulation Fidelity",
        description: "Mesh resolution sufficient to resolve boundary-layer separation at cruise speed.",
      },
      {
        title: "Compute Budget",
        description: "Full sweep must complete within a 48-hour cluster allocation.",
      },
      {
        title: "Validation",
        description: "Results must correlate within 5% of prior wind-tunnel baseline data.",
      },
    ],
    budgetRange: "MMK 12,000,000",
    budgetRange1: "MMK 15,000,000",
    targetTimeline: "6 Weeks",
    deadline: "Aug 1st, 2024",
    applicantsCount: 15,
    availableNow: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
