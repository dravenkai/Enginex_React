<<<<<<< HEAD
﻿﻿import Sidebar from "./client/_components/Sidebar";
import Header from "./client/_components/Header";

export default function RouteGroupLayout({
=======
export default function ClientLayout({
>>>>>>> origin/Sandakue
  children,
}: {
  children: React.ReactNode;
<<<<<<< HEAD
}>) {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
=======
}) {
  return children;
>>>>>>> origin/Sandakue
}
