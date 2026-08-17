// Local placeholder photos (public/profile/*) used when an engineer hasn't
// uploaded a real avatar. Picked deterministically from their engineer-
// profile id so the SAME engineer always gets the SAME placeholder no matter
// which page they're shown on (marketplace, favorites, team, their own
// profile, ...) — callers must all pass the same id space (engineerProfileId,
// not userId) for that to hold.
const BOY_AVATARS = ["/profile/boyprofile1.jpg", "/profile/boyprofile2.jpg"];
const GIRL_AVATARS = ["/profile/girlprofile1.jpg", "/profile/girlprofile2.jpg"];
const ALL_AVATARS = [...BOY_AVATARS, ...GIRL_AVATARS];

// There's no gender field anywhere in the backend, and guessing a real
// person's gender from their name is exactly the kind of thing to avoid —
// so this list is deliberately limited to a small set of globally
// unambiguous Western names (the kind used as generic examples, not names
// that happen to match real accounts in this app) purely to pick a matching
// stock photo when there's no avatar uploaded. Falls back to the id hash for
// anything else, including every Myanmar name actually used by real
// accounts in this app — no guessing there.
const FEMININE_NAMES = new Set([
  "alice", "emma", "olivia", "sophia", "isabella", "mia", "amelia", "harper",
  "evelyn", "abigail", "emily", "ella", "elizabeth", "sofia", "grace", "chloe",
  "victoria", "riley", "aria", "lily", "hannah", "zoe", "anna", "sarah",
  "sara", "maria", "nora", "layla", "ava", "scarlett", "aurora",
]);
const MASCULINE_NAMES = new Set([
  "james", "john", "robert", "michael", "william", "david", "richard",
  "joseph", "thomas", "daniel",
]);

// Explicit corrections for specific real accounts, confirmed directly by the
// user — not guessed. Keyed by engineer-profile id (the same id space used
// everywhere else in fallbackAvatar). Add to this only on an actual
// confirmation, never a guess.
const CONFIRMED_GENDER_BY_ENGINEER_ID: Record<number, "boy" | "girl"> = {
  2: "boy", // Shin Thant — confirmed by user
};

// Always hash the string form so the same person's id produces the same
// result whether a caller passes it as a number (1) or a string ("1") —
// callers are inconsistent about this across the app.
function hashKey(value: number | string): number {
  return String(value)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function fallbackAvatar(
  seed: number | string | null | undefined,
  name?: string | null
): string {
  // Normalize to a number since callers pass this id as either a number or a
  // string (e.g. a URL param) for the same person — same inconsistency as
  // the hashKey() note below.
  const numericSeed = typeof seed === "string" ? Number(seed) : seed;
  if (
    numericSeed != null &&
    !Number.isNaN(numericSeed) &&
    numericSeed in CONFIRMED_GENDER_BY_ENGINEER_ID
  ) {
    const pool = CONFIRMED_GENDER_BY_ENGINEER_ID[numericSeed] === "girl" ? GIRL_AVATARS : BOY_AVATARS;
    return pool[hashKey(numericSeed) % pool.length];
  }
  const firstName = name?.trim().split(/\s+/)[0]?.toLowerCase();
  if (firstName) {
    if (FEMININE_NAMES.has(firstName)) {
      return GIRL_AVATARS[hashKey(seed ?? name ?? "") % GIRL_AVATARS.length];
    }
    if (MASCULINE_NAMES.has(firstName)) {
      return BOY_AVATARS[hashKey(seed ?? name ?? "") % BOY_AVATARS.length];
    }
  }
  if (seed == null) return ALL_AVATARS[0];
  return ALL_AVATARS[Math.abs(hashKey(seed)) % ALL_AVATARS.length];
}
