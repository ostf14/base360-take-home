export type Surface = "tiktok" | "dm" | "crm" | "call" | "email" | "system";

export interface Chapter {
  id: number;
  kicker: string;
  headline: string;
  // The acid-accented phrase inside the headline. Must appear verbatim
  // as a contiguous substring; the plaque splits headline into
  // (plain, accent, tail) and renders `accent` in --acid. If missing
  // or not found, the headline renders entirely in --text-hi.
  accent?: string;
  subcopy: string;
  surface: Surface;
}

// Headlines are tuned to fit on ONE LINE inside the plaque at the
// current 24 px display-bold size / ~620 px content width. Every
// entry stays under ~40 characters so no chapter ever wraps.
export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    kicker: "> STEP 01 / 06 — THE COMMENT",
    headline: "Every comment is a customer.",
    accent: "customer",
    subcopy:
      "Base360 watches every social channel and answers in public — instantly, in your voice.",
    surface: "tiktok",
  },
  {
    id: 1,
    kicker: "> STEP 02 / 06 — THE DM",
    headline: "Close the loop in the DM.",
    accent: "Close the loop",
    subcopy:
      "The AI agent slides into DMs, handles objections, and drops the buy link — 24/7.",
    surface: "dm",
  },
  {
    id: 2,
    kicker: "> STEP 03 / 06 — ADDED TO CRM",
    headline: "Every reply becomes a lead.",
    accent: "a lead",
    subcopy:
      "The record writes itself — source, intent, timeline — the second she replies.",
    surface: "crm",
  },
  {
    id: 3,
    kicker: "> STEP 04 / 06 — THE CALL",
    headline: "AI voice picks up the phone.",
    accent: "AI voice",
    subcopy:
      "When intent spikes, the agent calls — walks her through the product, live transcript on the record.",
    surface: "call",
  },
  {
    id: 4,
    kicker: "> STEP 05 / 06 — THE NURTURE",
    headline: "One record, every channel.",
    accent: "every channel",
    subcopy:
      "Email flows, opens, clicks — every touch tracked back to the comment that started it.",
    surface: "email",
  },
  {
    id: 5,
    kicker: "> STEP 06 / 06 — ONE SYSTEM",
    headline: "Every channel closed automatically.",
    accent: "automatically",
    subcopy:
      "That's Base360. Not five tools bolted together — one operating system for the customer.",
    surface: "system",
  },
];
