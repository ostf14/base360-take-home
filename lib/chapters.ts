export type Surface = "tiktok" | "dm" | "crm" | "call" | "email" | "system";

export interface Chapter {
  id: number;
  kicker: string;
  headline: string;
  subcopy: string;
  surface: Surface;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    kicker: "> STEP 01 / 06 — THE COMMENT",
    headline: "Every comment is a customer.",
    subcopy:
      "Base360 watches every social channel and answers in public — instantly, in your voice.",
    surface: "tiktok",
  },
  {
    id: 1,
    kicker: "> STEP 02 / 06 — THE DM",
    headline: "Move the conversation. Close the loop.",
    subcopy:
      "The AI agent slides into DMs, handles objections, and drops the buy link — 24/7.",
    surface: "dm",
  },
  {
    id: 2,
    kicker: "> STEP 03 / 06 — ADDED TO CRM",
    headline: "Every conversation becomes a tracked lead.",
    subcopy:
      "The record writes itself — source, intent, timeline — the second she replies.",
    surface: "crm",
  },
  {
    id: 3,
    kicker: "> STEP 04 / 06 — THE CALL",
    headline: "AI voice picks up the phone.",
    subcopy:
      "When intent spikes, the agent calls — walks her through the product, live transcript on the record.",
    surface: "call",
  },
  {
    id: 4,
    kicker: "> STEP 05 / 06 — THE NURTURE",
    headline: "Marketing runs on the same customer.",
    subcopy:
      "One record. Email flows, opens, clicks — every touch tracked back to the comment that started it.",
    surface: "email",
  },
  {
    id: 5,
    kicker: "> STEP 06 / 06 — ONE SYSTEM",
    headline: "One comment. Every channel. Closed — automatically.",
    subcopy:
      "That's Base360. Not five tools bolted together — one operating system for the customer.",
    surface: "system",
  },
];
