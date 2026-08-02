import ClientShell from "./client/_components/ClientShell";

export default function RouteGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ClientShell>{children}</ClientShell>;
}
