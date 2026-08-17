// Major Myanmar cities/townships — this is a TU (Technological University)
// Myanmar platform, so location fields are constrained to a real select
// instead of free text.
export const MYANMAR_LOCATIONS = [
  "Yangon, Myanmar",
  "Mandalay, Myanmar",
  "Naypyidaw, Myanmar",
  "Mawlamyine, Myanmar",
  "Taunggyi, Myanmar",
  "Meiktila, Myanmar",
  "Pathein, Myanmar",
  "Magway, Myanmar",
  "Monywa, Myanmar",
  "Myitkyina, Myanmar",
  "Sittwe, Myanmar",
  "Hinthada, Myanmar",
  "Pyay, Myanmar",
  "Dawei, Myanmar",
  "Loikaw, Myanmar",
  "Hpa-An, Myanmar",
  "Bago, Myanmar",
  "Myeik, Myanmar",
] as const;

/**
 * Builds the option list for a location <select>, including the profile's
 * current value even if it's not in the standard list (e.g. legacy free-text
 * data like "Mandalay,Myanmar" without a space) so editing never silently
 * discards it.
 */
export function locationSelectOptions(currentValue?: string | null): string[] {
  const options: string[] = [...MYANMAR_LOCATIONS];
  if (currentValue && !options.includes(currentValue)) {
    options.unshift(currentValue);
  }
  return options;
}
