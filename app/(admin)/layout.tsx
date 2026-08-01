import AppShell from "@/components/layout/AppShell";

export default function RouteGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
