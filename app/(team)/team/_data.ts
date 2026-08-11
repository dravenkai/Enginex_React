export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  experienceYears: number;
  location: string;
  status: "Available" | "Deployed";
  tags: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: "ENG-2921",
    name: "Sarah Jenkins",
    role: "Civil Eng.",
    photo: "https://picsum.photos/seed/sarah-jenkins-team/300/300",
    experienceYears: 6,
    location: "Vancouver",
    status: "Available",
    tags: ["LVL 4"],
  },
  {
    id: "ENG-3810",
    name: "Marc-Andre L.",
    role: "Structural Spec.",
    photo: "https://picsum.photos/seed/marc-andre-team/300/300",
    experienceYears: 12,
    location: "Montreal",
    status: "Deployed",
    tags: ["HIGH-RISE", "STEEL", "LVL 5"],
  },
];
