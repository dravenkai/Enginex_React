"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mouse } from "lucide-react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"] });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface DeskItem {
  id: string;
  src: string;
  className: string;
  // Real width/height of the source PNG, so each item's box matches its
  // actual shape instead of being squeezed/letterboxed into a square.
  ratio: number;
  rotate: number;
  outX: number;
  outY: number;
}

// Two ground clusters sitting on the desk, either side of the laptop —
// left: lamp / pencil holder / calculator / notepad, right: coffee cup / pen / book.
const DESK_ITEMS: DeskItem[] = [
  {
    id: "lamp",
    src: "/hero/lamp.png",
    className: "bottom-[18%] left-[-8%] sm:left-[-18%] w-34 sm:w-46 z-10",
    ratio: 231 / 478,
    rotate: 0,
    outX: -80,
    outY: 30,
  },
  {
    id: "pencil-holder",
    src: "/hero/pencil-holder.png",
    className: "bottom-[20%] left-[2%] sm:left-[-4%] w-32 sm:w-40 z-10",
    ratio: 273 / 422,
    rotate: 0,
    outX: -50,
    outY: 55,
  },
  {
    id: "calculator",
    src: "/hero/calculator.png",
    className: "bottom-[4%] left-[-2%] sm:left-[-8%] w-34 sm:w-42 z-20",
    ratio: 299 / 208,
    rotate: 6,
    outX: -25,
    outY: 70,
  },
  {
    id: "notepad",
    src: "/hero/notepad.png",
    className: "bottom-[2%] left-[-8%] sm:left-[-18%] w-33 sm:w-40 z-20",
    ratio: 268 / 370,
    rotate: -4,
    outX: -60,
    outY: 65,
  },
  {
    id: "coffee-cup",
    src: "/hero/coffee-cup.png",
    className: "top-[50%] right-[-4%] sm:right-[-16%] w-32 sm:w-40",
    ratio: 226 / 212,
    rotate: 0,
    outX: 65,
    outY: -40,
  },
  {
    id: "pen",
    src: "/hero/pen.png",
    className: "top-[62%] right-[-8%] sm:right-[-10%] w-44 sm:w-56",
    ratio: 260 / 154,
    rotate: -5,
    outX: 85,
    outY: 15,
  },
  {
    id: "book",
    src: "/hero/book.png",
    className: "bottom-[4%] right-[-8%] sm:right-[-20%] w-54 sm:w-74",
    ratio: 350 / 289,
    rotate: 5,
    outX: 55,
    outY: 60,
  },
];

// The laptop screen sits roughly centered in its own image — used as the
// transform-origin so scaling reads as "zooming into the laptop screen".
const LAPTOP_ORIGIN = { xPct: 50, yPct: 42 };
const LAPTOP_RATIO = 929 / 584;

export default function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const laptop = laptopRef.current;
    if (!section || !laptop) return;

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      gsap.set(items, { transformOrigin: "50% 50%" });
      gsap.set(laptop, { transformOrigin: `${LAPTOP_ORIGIN.xPct}% ${LAPTOP_ORIGIN.yPct}%` });

      let navigating = false;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          // Once the zoom-into-the-laptop sequence finishes and the user keeps
          // scrolling past it, dissolve the hero out and carry them into the hub
          // instead of cutting to the next page instantly.
          onLeave: () => {
            if (navigating) return;
            navigating = true;
            gsap.to(section, {
              opacity: 0,
              duration: 0.4,
              ease: "power1.in",
              onComplete: () => router.push("/login"),
            });
          },
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
        .to(laptop, { scale: 3, duration: 6, ease: "power2.inOut" }, "zoom")
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
      className="relative h-screen w-screen overflow-hidden bg-[#f5f4f0]"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/hero/background.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[36%] bg-gradient-to-b from-[#d7b98a] to-[#b98f5c]" />

      <div className="relative h-full max-w-6xl mx-auto">
        {DESK_ITEMS.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`absolute ${item.className} will-change-transform drop-shadow-lg`}
            style={{ transform: `rotate(${item.rotate}deg)`, aspectRatio: item.ratio }}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="220px"
              className="object-contain"
            />
          </div>
        ))}

        <div className="relative h-full flex flex-col items-center px-4 pt-[5%] sm:pt-[6.5%]">
          <div
            ref={headlineRef}
            className={`relative z-20 text-center will-change-transform ${baloo.className}`}
          >
            <h1 className="font-extrabold text-4xl sm:text-[68px] leading-tight text-black">
              Hire the best, build with confidence.
            </h1>
            <p className="mt-4 pl-24 text-lg sm:text-[45px] font-bold text-gray-900">
              A collaborative hub for builders to find teams &amp; for engineers
              to land professional projects.
            </p>
          </div>

          <a
            ref={ctaRef}
            href="#how-it-works"
            onClick={(event) => {
              event.preventDefault();
              window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
            }}
            className={`relative z-20 mt-5 inline-flex items-center gap-2 bg-orange-400 border-4 border-black px-6 py-3 rounded-full font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform will-change-transform cursor-pointer ${baloo.className}`}
          >
            Scroll to enter the hub.
            <Mouse className="w-5 h-5 animate-bounce" strokeWidth={2.5} />
          </a>

          <div
            ref={laptopRef}
            className="relative z-10 mt-auto mb-[6%] sm:mb-[4%] w-[320px] sm:w-[540px] will-change-transform"
            style={{ aspectRatio: LAPTOP_RATIO }}
          >
            <Image
              src="/hero/laptop.png"
              alt="Enginex — Engineering Community & Construction Platform"
              fill
              priority
              sizes="540px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
