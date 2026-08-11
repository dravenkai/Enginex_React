import EngineerShell from "./engineer/_components/EngineerShell";

export default function RouteGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <EngineerShell>{children}</EngineerShell>;
}
