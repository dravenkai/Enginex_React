import TeamShell from "./team/_components/TeamShell";

export default function RouteGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <TeamShell>{children}</TeamShell>;
}
