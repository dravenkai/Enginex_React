import Link from "next/link";
import {
  ChevronsDown,
  MousePointerClick,
  Users,
  ShieldCheck,
  Hammer,
  Search,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import ScrollReveal from "./_components/ScrollReveal";
import HeroMockup from "./_components/HeroMockup";

const builderSteps = [
  {
    icon: Search,
    title: "Post a Request",
    description: "Describe your project scope, budget, and timeline in minutes.",
  },
  {
    icon: Users,
    title: "Match with Engineers",
    description: "Review vetted engineers matched to your project's requirements.",
  },
  {
    icon: MessageSquare,
    title: "Collaborate & Build",
    description: "Track progress, message, and approve milestones in one hub.",
  },
];

const engineerSteps = [
  {
    icon: Hammer,
    title: "Build Your Profile",
    description: "Showcase your skills, portfolio, and specialties to stand out.",
  },
  {
    icon: ShieldCheck,
    title: "Get Verified",
    description: "Pass our vetting process to unlock access to premium requests.",
  },
  {
    icon: CheckCircle2,
    title: "Land Projects",
    description: "Apply to requests that fit your expertise and get hired.",
  },
];

const stats = [
  { value: "1,200+", label: "Verified Engineers" },
  { value: "480+", label: "Projects Completed" },
  { value: "97%", label: "Client Satisfaction" },
  { value: "24hr", label: "Avg. Match Time" },
];

export default function Page() {
  return (
    <main className="bg-white text-black">
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        <ScrollReveal>
          <h1 className="text-center font-extrabold text-4xl sm:text-6xl leading-tight max-w-4xl mx-auto">
            Hire the best, build with confidence.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="text-center text-lg sm:text-xl font-medium text-gray-600 max-w-2xl mx-auto mt-6">
            A collaborative hub for builders to find teams &amp; for engineers
            to land professional projects.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <a
            href="#how-it-works"
            className="mt-10 inline-flex items-center gap-3 bg-orange-400 border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Scroll to enter the hub.
            <ChevronsDown className="w-5 h-5 animate-bounce" />
          </a>
        </ScrollReveal>

        <ScrollReveal delay={300} className="mt-16 w-full">
          <HeroMockup />
        </ScrollReveal>
      </section>

      <section id="how-it-works" className="px-6 py-24 max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-center font-extrabold text-3xl sm:text-4xl">
            How Enginex works
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          <div>
            <ScrollReveal direction="left">
              <h3 className="font-bold text-xl uppercase tracking-wide text-blue-700 mb-6">
                For Builders
              </h3>
            </ScrollReveal>
            <div className="space-y-6">
              {builderSteps.map((step, i) => (
                <ScrollReveal key={step.title} direction="left" delay={i * 100}>
                  <div className="flex gap-4 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-10 h-10 shrink-0 border-2 border-black bg-[#93c5fd] flex items-center justify-center">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div>
            <ScrollReveal direction="right">
              <h3 className="font-bold text-xl uppercase tracking-wide text-orange-500 mb-6">
                For Engineers
              </h3>
            </ScrollReveal>
            <div className="space-y-6">
              {engineerSteps.map((step, i) => (
                <ScrollReveal key={step.title} direction="right" delay={i * 100}>
                  <div className="flex gap-4 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-10 h-10 shrink-0 border-2 border-black bg-orange-300 flex items-center justify-center">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div className="text-center">
                <p className="font-extrabold text-3xl sm:text-4xl">{stat.value}</p>
                <p className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 mt-2">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-extrabold text-3xl sm:text-4xl">
            Ready to build with confidence?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-gray-600 font-medium mt-4">
            Join the hub and connect with builders and engineers today.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#93c5fd] border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <MousePointerClick className="w-5 h-5" />
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Sign In
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
