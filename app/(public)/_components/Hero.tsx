"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IMAGE_WIDTH = 1728;
const IMAGE_HEIGHT = 1117;
const BUTTON_BOX = { left: 605, top: 403, width: 518, height: 90 };

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonRect, setButtonRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    function updateButtonRect() {
      const container = containerRef.current;
      if (!container) return;

      const { width: containerWidth, height: containerHeight } =
        container.getBoundingClientRect();
      const imageAspect = IMAGE_WIDTH / IMAGE_HEIGHT;
      const containerAspect = containerWidth / containerHeight;

      let renderWidth: number;
      let renderHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (containerAspect > imageAspect) {
        // Width-bound (typical laptop/desktop): image fills the width,
        // top-anchored, excess height is cropped off the bottom.
        renderWidth = containerWidth;
        renderHeight = renderWidth / imageAspect;
        offsetX = 0;
        offsetY = 0;
      } else {
        // Height-bound (tall/narrow viewport): image fills the height,
        // centered horizontally, excess width cropped off both sides.
        renderHeight = containerHeight;
        renderWidth = renderHeight * imageAspect;
        offsetX = (containerWidth - renderWidth) / 2;
        offsetY = 0;
      }

      const scale = renderWidth / IMAGE_WIDTH;
      setButtonRect({
        left: offsetX + BUTTON_BOX.left * scale,
        top: offsetY + BUTTON_BOX.top * scale,
        width: BUTTON_BOX.width * scale,
        height: BUTTON_BOX.height * scale,
      });
    }

    updateButtonRect();
    window.addEventListener("resize", updateButtonRect);
    return () => window.removeEventListener("resize", updateButtonRect);
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <Image
        src="/hero-landing.png"
        alt="Hire the best, build with confidence. A collaborative hub for builders to find teams and for engineers to land professional projects."
        fill
        priority
        className="object-cover object-top"
      />
      {buttonRect && (
        <Link
          href="/login"
          aria-label="Scroll to enter the hub"
          className="absolute"
          style={{
            left: buttonRect.left,
            top: buttonRect.top,
            width: buttonRect.width,
            height: buttonRect.height,
          }}
        />
      )}
    </section>
  );
}
