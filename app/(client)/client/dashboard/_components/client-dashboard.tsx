import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  icon: "grid" | "market" | "heart" | "profile";
  active?: boolean;
};
export type RequestCard = {
  id: string;
  title: string;
  description: string;
  status: "matching" | "in progress" | "final review";
  action: string;
  engineer?: string;
  assignees?: string[];
};

export type Engineer = {
  name: string;
  role: string;
  tags: string[];
  avatarTone: "amber" | "green" | "blue" | "rose" | "violet";
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/client/dashboard", icon: "grid", active: true },
  { label: "Marketplace", href: "/client/marketplace", icon: "market" },
  { label: "Favorites", href: "/client/home", icon: "heart" },
  { label: "Profile", href: "/client/profile", icon: "profile" },
];

const statusStyles: Record<RequestCard["status"], string> = {
  matching: "bg-[#fee679]",
  "in progress": "bg-[#f1a167]",
  "final review": "bg-[#79a8ff]",
};

const avatarTones: Record<Engineer["avatarTone"], string> = {
  amber: "bg-linear-to-br from-[#ffe17a] to-[#f1a167]",
  green: "bg-linear-to-br from-[#9ee8a1] to-[#5bcebd]",
  blue: "bg-linear-to-br from-[#8fb7ff] to-[#4967ad]",
  rose: "bg-linear-to-br from-[#ffa7b4] to-[#c4a6ff]",
  violet: "bg-linear-to-br from-[#c4a6ff] to-[#7aa7ff]",
};

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#1b1b1b]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar />
        <div className="min-w-0 flex-1">
          <TopBar />
          {children}
        </div>
      </div>
    </main>
  );
}

function ClientSidebar() {
  return (
    <aside className="border-b-4 border-black bg-[#f7f7f7] lg:sticky lg:top-0 lg:h-screen lg:w-56 lg:border-r-4 lg:border-b-0">
      <div className="flex h-full flex-col gap-5 p-4">
        <Link href="/client/dashboard" className="flex items-center gap-3 px-1">
          <div className="grid size-9 place-items-center border-2 border-black bg-white shadow-[3px_3px_0_#111]">
            <EnginexMark />
          </div>
          <div>
            <p className="text-lg font-black leading-none tracking-wide">Enginex</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              Client Site
            </p>
          </div>
        </Link>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-max items-center gap-3 border-2 border-transparent px-4 py-3 font-mono text-xs font-bold uppercase transition ${
                item.active
                  ? "border-black bg-[#7aa7ff] shadow-[4px_4px_0_#111]"
                  : "hover:border-black hover:bg-white"
              }`}
            >
              <DashboardIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/client/marketplace"
          className="mt-auto hidden border-2 border-black bg-[#fee679] px-5 py-3 text-center font-mono text-xs font-black uppercase shadow-[4px_4px_0_#111] transition hover:-translate-y-0.5 lg:block"
        >
          New Request
        </Link>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b-4 border-black bg-[#f7f7f7]">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <label className="relative flex w-full max-w-sm items-center">
          <span className="absolute left-4">
            <DashboardIcon name="search" />
          </span>
          <input
            aria-label="Search projects"
            placeholder="Search projects..."
            className="h-10 w-full border-2 border-black bg-white pl-12 pr-4 font-mono text-sm outline-none placeholder:text-neutral-500 focus:shadow-[4px_4px_0_#111]"
          />
        </label>
        <button
          type="button"
          aria-label="Notifications"
          className="ml-auto grid size-10 place-items-center border-2 border-transparent hover:border-black hover:bg-white"
        >
          <DashboardIcon name="bell" />
        </button>
        <button
          type="button"
          aria-label="Open profile"
          className="grid size-10 place-items-center border-2 border-black bg-linear-to-br from-[#8fb7ff] to-[#4967ad] shadow-[3px_3px_0_#111]"
        >
          <span className="font-mono text-sm font-black">KN</span>
        </button>
      </div>
    </header>
  );
}

export function DashboardHero() {
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="border-4 border-black bg-white p-6 shadow-[7px_7px_0_#111] sm:p-9">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Welcome back, Khant Nyar.
        </h1>
        <p className="mt-4 max-w-xl font-mono text-sm leading-7 text-neutral-700">
          You have 3 active requests and 12 engineers are currently reviewing
          your latest post. Everything is running smoothly.
        </p>
      </div>
      <div className="grid place-items-center border-4 border-black bg-[#fee679] p-6 text-center shadow-[7px_7px_0_#111]">
        <div>
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#161616] text-[#fee679]">
            <DashboardIcon name="gauge" />
          </div>
          <p className="mt-5 font-mono text-sm font-black uppercase leading-6">
            System Status
            <br />
            Optimized
          </p>
        </div>
      </div>
    </section>
  );
}

export function ActiveRequests({ requests }: { requests: RequestCard[] }) {
  return (
    <section>
      <SectionTitle icon="list" title="Active Requests" />
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {requests.map((request) => (
          <article
            key={request.id}
            className="flex min-h-56 flex-col border-2 border-black bg-white p-5 shadow-[5px_5px_0_#111]"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`border border-black px-2 py-1 font-mono text-[10px] font-black uppercase ${statusStyles[request.status]}`}
              >
                {request.status}
              </span>
              <span className="font-mono text-[10px] font-black uppercase text-neutral-400">
                {request.id}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-black">{request.title}</h2>
            <p className="mt-4 font-mono text-xs leading-6 text-neutral-700">
              {request.description}
            </p>
            <div className="mt-auto border-t-2 border-black pt-4">
              <div className="flex items-center justify-between gap-4">
                <AssigneeCluster request={request} />
                <button
                  type="button"
                  className="font-mono text-[10px] font-black uppercase text-[#4967ad] hover:text-black"
                >
                  {request.action}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AssigneeCluster({ request }: { request: RequestCard }) {
  if (request.assignees) {
    const visible = request.assignees.slice(0, 1);
    const extra = request.assignees.length - visible.length;

    return (
      <div className="flex items-center -space-x-2">
        {visible.map((assignee) => (
          <span
            key={assignee}
            className="grid size-8 place-items-center rounded-full border-2 border-black bg-[#1d3440] font-mono text-[10px] font-black text-white"
          >
            {assignee}
          </span>
        ))}
        {extra > 0 ? (
          <span className="grid size-8 place-items-center rounded-full border-2 border-black bg-white font-mono text-[10px] font-black">
            +{extra}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-full border-2 border-black bg-[#1d3440] font-mono text-[10px] font-black text-white">
        {request.engineer?.slice(0, 1)}
      </span>
      <span className="font-mono text-xs font-black">{request.engineer}</span>
    </div>
  );
}

export function RecommendedEngineers({ engineers }: { engineers: Engineer[] }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <SectionTitle icon="star" title="Recommended Engineers" />
        <div className="hidden gap-2 sm:flex">
          <ArrowButton direction="left" />
          <ArrowButton direction="right" />
        </div>
      </div>
      <div className="mt-5 flex gap-5 overflow-x-auto pb-2">
        {engineers.map((engineer) => (
          <article
            key={`${engineer.name}-${engineer.role}`}
            className="w-[min(82vw,270px)] shrink-0 border-2 border-black bg-white p-5 shadow-[5px_5px_0_#111]"
          >
            <div className="flex items-start gap-4">
              <EngineerAvatar engineer={engineer} />
              <div className="min-w-0">
                <h3 className="truncate font-mono text-base font-black">
                  {engineer.name}
                </h3>
                <p className="font-mono text-[10px] font-black uppercase text-[#4967ad]">
                  {engineer.role}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {engineer.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-black bg-[#f2f2f2] px-1.5 py-1 font-mono text-[9px] font-black uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/client/profile"
              className="mt-5 block border-2 border-black bg-[#7aa7ff] px-4 py-2.5 text-center font-mono text-xs font-black uppercase shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5"
            >
              View Profile
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function EngineerAvatar({ engineer }: { engineer: Engineer }) {
  return (
    <div
      className={`grid size-14 shrink-0 place-items-center border-2 border-black ${avatarTones[engineer.avatarTone]}`}
    >
      <span className="font-mono text-lg font-black">
        {engineer.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)}
      </span>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: "list" | "star";
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-5 place-items-center bg-[#4967ad] text-white">
        <DashboardIcon name={icon} />
      </span>
      <h2 className="font-mono text-sm font-black">{title}</h2>
    </div>
  );
}

function ArrowButton({ direction }: { direction: "left" | "right" }) {
  return (
    <button
      type="button"
      aria-label={`${direction === "left" ? "Previous" : "Next"} engineers`}
      className="grid size-9 place-items-center border-2 border-black bg-white font-black transition hover:bg-[#fee679]"
    >
      {direction === "left" ? "<" : ">"}
    </button>
  );
}

function EnginexMark() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" fill="#8fb7ff" stroke="#111" strokeWidth="1.2" />
      <path d="M12 2v20M3 7l9 5 9-5" stroke="#111" strokeWidth="1.2" />
      <path d="M12 7v10" stroke="#fee679" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="2.1" fill="#5bcebd" stroke="#111" strokeWidth="1.2" />
    </svg>
  );
}

function DashboardIcon({
  name,
}: {
  name:
    | NavItem["icon"]
    | "search"
    | "bell"
    | "gauge"
    | "list"
    | "star";
}) {
  const common = "h-4 w-4";

  if (name === "search") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 9a6 6 0 1 1 12 0v5l2 3H4l2-3V9Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M10 20h4" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "gauge") {
    return (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 15a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="2" />
        <path d="m12 14 5-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20s-7-4-9-9a5 5 0 0 1 8-5 5 5 0 0 1 8 5c-2 5-9 9-9 9Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M5 21a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "market") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8h16l-2-4H6L4 8Z" stroke="currentColor" strokeWidth="2" />
        <path d="M6 8v12h12V8" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "star") {
    return (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m12 2 2.7 6.2 6.7.6-5.1 4.4 1.5 6.6-5.8-3.4-5.8 3.4 1.5-6.6-5.1-4.4 6.7-.6L12 2Z" />
      </svg>
    );
  }

  if (name === "list") {
    return (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="2" />
        <path d="M4 6h1M4 12h1M4 18h1" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
