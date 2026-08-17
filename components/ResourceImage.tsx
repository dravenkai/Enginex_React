"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { resourceImageUrl, type ImageResource } from "@/lib/api/images";

/**
 * Renders a post/project/portfolio image (GET /images/{resource}/{id}). By
 * default renders nothing at all if that resource doesn't have one — unlike
 * AvatarImage there's no placeholder image fallback here, since "no image"
 * is a completely normal state for a project/post and a generic placeholder
 * photo would be more misleading than just omitting the banner. Pass
 * `fallback` for spots (e.g. a dedicated portfolio section) that want an
 * explicit "no image yet" state instead of just disappearing.
 */
export default function ResourceImage({
  resource,
  id,
  alt = "",
  className,
  fallback = null,
}: {
  resource: ImageResource;
  id: number | string;
  alt?: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- served by our own proxy, next/image can't optimize a route handler response
    <img src={resourceImageUrl(resource, id)} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
