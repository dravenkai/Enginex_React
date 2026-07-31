import {
  ActiveRequests,
  ClientShell,
  DashboardHero,
  RecommendedEngineers,
  type Engineer,
  type RequestCard,
} from "./_components/client-dashboard";

const activeRequests: RequestCard[] = [
  {
    id: "#REQ-4021",
    title: "Cloud Migration Strategy",
    description: "Azure to AWS transition for high-traffic e-commerce platform.",
    status: "matching",
    action: "Manage",
    assignees: ["KT", "NN", "PM", "CC", "TH", "ZH"],
  },
  {
    id: "#REQ-3892",
    title: "Python Security Audit",
    description: "Pentesting core API endpoints and SQL optimization.",
    status: "in progress",
    action: "Message",
    engineer: "Sarah L.",
  },
  {
    id: "#REQ-3770",
    title: "React Frontend Refactor",
    description: "Implementing new design system tokens and hooks.",
    status: "final review",
    action: "Approve",
    engineer: "Mike T.",
  },
];

const recommendedEngineers: Engineer[] = [
  {
    name: "Kaung Myat Thant",
    role: "Civil Engineer",
    tags: ["Kubernetes", "Terraform", "Go"],
    avatarTone: "amber",
  },
  {
    name: "Chaint Chaint Chan",
    role: "Architect",
    tags: ["Archi", "Draw", "Build"],
    avatarTone: "green",
  },
  {
    name: "Than Tun",
    role: "Cloud Engineer",
    tags: ["AWS", "K8s", "CI/CD"],
    avatarTone: "blue",
  },
  {
    name: "May Myat Hmue Naing",
    role: "UI/UX Engineer",
    tags: ["React", "Figma", "A11y"],
    avatarTone: "rose",
  },
  {
    name: "Pai Min Thway",
    role: "Security Engineer",
    tags: ["Audit", "Python", "SQL"],
    avatarTone: "violet",
  },
];

export default function ClientDashboardPage() {
  return (
    <ClientShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHero />
        <ActiveRequests requests={activeRequests} />
        <RecommendedEngineers engineers={recommendedEngineers} />
      </div>
    </ClientShell>
  );
}
