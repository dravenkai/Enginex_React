import { JetBrains_Mono } from "next/font/google";

// Loaded once here and reused by every dashboard shell (client/engineer/team)
// instead of each shell calling JetBrains_Mono() itself with an identical
// config. Three separate call sites — even with matching subsets/weights —
// make next/font emit three separate font assets/preload tags, one per
// route group; since only one shell is ever mounted at a time, the other
// two show up as "preloaded but not used" console warnings. A single shared
// instance means a single font asset and a single preload tag.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});
