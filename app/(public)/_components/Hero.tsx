"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PenTool,
  Ruler,
  Calculator,
  BookOpen,
  Coffee,
  Feather,
  StickyNote,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DESK_ITEMS = [
  { id: "pencil-holder", Icon: PenTool, className: "top-[8%] left-[3%] sm:left-[8%]", rotate: -8, bg: "bg-[#fef08a]", outX: -70, outY: -30 },
  { id: "ruler", Icon: Ruler, className: "top-[66%] left-[1%] sm:left-[4%]", rotate: -5, bg: "bg-[#93c5fd]", outX: -80, outY: 30 },
  { id: "calculator", Icon: Calculator, className: "bottom-[6%] left-[14%] sm:left-[20%]", rotate: 7, bg: "bg-orange-300", outX: -40, outY: 60 },
  { id: "notebook", Icon: BookOpen, className: "bottom-[4%] right-[14%] sm:right-[20%]", rotate: -4, bg: "bg-white", outX: 40, outY: 60 },
  { id: "coffee-cup", Icon: Coffee, className: "top-[8%] right-[3%] sm:right-[8%]", rotate: 8, bg: "bg-orange-200", outX: 70, outY: -30 },
  { id: "fountain-pen", Icon: Feather, className: "top-[58%] right-[1%] sm:right-[4%]", rotate: 10, bg: "bg-[#93c5fd]", outX: 80, outY: 30 },
  { id: "sticky-note", Icon: StickyNote, className: "top-[0%] left-[38%]", rotate: -12, bg: "bg-[#fef08a]", outX: -20, outY: -70 },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      gsap.set([...items, laptopRef.current], { transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Initial load (0% -> 10%): desk items spring in, headline + CTA slide/fade in.
      tl.from(
        items,
        {
          y: 80,
          opacity: 0,
          scale: 0.4,
          stagger: 0.06,
          duration: 1,
          ease: "back.out(1.7)",
        },
        0
      )
        .from(headlineRef.current, { y: -20, opacity: 0, duration: 1 }, 0)
        .from(ctaRef.current, { y: -20, opacity: 0, duration: 1 }, 0.15)
        .addLabel("zoom", 1);

      // Scroll-driven interaction (10% -> 100%): items push outward + fade,
      // laptop zooms toward the viewer, headline/CTA fade out early.
      tl.to(
        items,
        {
          scale: 0.8,
          opacity: 0.2,
          x: (i: number) => DESK_ITEMS[i].outX,
          y: (i: number) => DESK_ITEMS[i].outY,
          stagger: 0.02,
          duration: 6,
          ease: "power1.inOut",
        },
        "zoom"
      )
        .to(
          bgRef.current,
          { scale: 1.15, opacity: 0.4, duration: 6, ease: "power1.inOut" },
          "zoom"
        )
        .to(
          laptopRef.current,
          { scale: 3, duration: 6, ease: "power2.inOut" },
          "zoom"
        )
        .to(
          headlineRef.current,
          { opacity: 0, y: -30, duration: 2, ease: "power1.in" },
          "zoom"
        )
        .to(
          ctaRef.current,
          { opacity: 0, y: -30, duration: 2, ease: "power1.in" },
          "zoom+=0.3"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#f7f5f0]"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 0%, rgba(255,255,255,0.9), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(0,0,0,0.06), transparent 60%), repeating-linear-gradient(70deg, transparent 0px, transparent 120px, rgba(0,0,0,0.04) 120px, rgba(0,0,0,0.04) 150px)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-[52%] bg-gradient-to-b from-[#d7b98a] to-[#b98f5c]" />

      <div className="relative h-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-6 px-6">
        {DESK_ITEMS.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`absolute ${item.className} ${item.bg} border-4 border-black w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] will-change-transform`}
            style={{ transform: `rotate(${item.rotate}deg)` }}
          >
            <item.Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        ))}

        <div
          ref={headlineRef}
          className="relative z-20 text-center max-w-2xl will-change-transform"
        >
          <h1 className="font-extrabold text-3xl sm:text-5xl leading-tight">
            Hire the best, build with confidence.
          </h1>
          <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">
            A collaborative hub for builders to find teams &amp; for engineers
            to land professional projects.
          </p>
        </div>

        <div
          ref={laptopRef}
          className="relative z-10 will-change-transform"
        >
          <div className="bg-black p-2 pb-6 rounded-2xl shadow-2xl w-[260px] sm:w-[380px]">
            <div className="bg-white border-2 border-black aspect-video flex flex-col items-center justify-center gap-2 px-4">
              <p className="font-extrabold text-xl sm:text-3xl tracking-tight">
                ENGINEX
              </p>
              <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">
                Engineering Community &amp; Construction Platform
              </p>
            </div>
          </div>
          <div className="mx-auto h-2.5 w-2/3 bg-black rounded-b-xl" />
        </div>

        <a
          ref={ctaRef}
          href="#how-it-works"
          className="relative z-20 inline-flex items-center gap-2 bg-orange-400 border-4 border-black px-6 py-3 rounded-full font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform will-change-transform"
        >
          Scroll to enter the hub 💡
        </a>
      </div>
    </section>
  );
}
