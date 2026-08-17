"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "next/image";

interface AvatarImageProps extends Omit<ImageProps, "src" | "onError" | "unoptimized"> {
  /** The real avatar URL, if any — may be set but still fail to load (e.g.
   * the backend's S3 bucket serving uploads is private, so every uploaded
   * photo 403s even though the URL is saved correctly). */
  src?: string | null;
  /** Local placeholder to show when there's no src, or it fails to load. */
  fallbackSrc: string;
}

export default function AvatarImage({ src, fallbackSrc, ...props }: AvatarImageProps) {
  const [failed, setFailed] = useState(false);
  const usingFallback = !src || failed;

  return (
    <Image
      {...props}
      src={usingFallback ? fallbackSrc : src}
      unoptimized={!usingFallback}
      onError={() => setFailed(true)}
    />
  );
}
