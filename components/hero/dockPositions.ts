export interface Dock {
  x: number;
  y: number;
}

// Puck dock positions expressed as % of the canvas (0..100).
// The order matches CHAPTERS[i]. Between chapters the puck interpolates
// smoothly through these points — this is the entire scroll journey.
export const DOCKS: Dock[] = [
  { x: 8,  y: 36 },   // 0 — tiktok: to the left of Maya's ignited comment
  { x: 72, y: 22 },   // 1 — dm: at top of DM thread
  { x: 15, y: 18 },   // 2 — crm: header avatar slot
  { x: 22, y: 30 },   // 3 — call: over Maya's callee card
  { x: 75, y: 12 },   // 4 — email: recipient chip in header
  { x: 55, y: 72 },   // 5 — system: closed node
];

// Puck timeline. Each chapter gets one "dwell" and one "travel" slot.
// Repeating each dock gives a mid-chapter plateau so the puck reads as
// PARKED on a surface before it takes off to the next one.
// slotSize = 1/6 ≈ 0.1667. First half of a chapter = dwell, second half = travel.
export const PUCK_KEYFRAMES = [
  0.0, 0.083,
  0.166, 0.25,
  0.333, 0.416,
  0.5, 0.583,
  0.666, 0.75,
  0.833, 1.0,
];

export const PUCK_X = [
  DOCKS[0].x, DOCKS[0].x,
  DOCKS[1].x, DOCKS[1].x,
  DOCKS[2].x, DOCKS[2].x,
  DOCKS[3].x, DOCKS[3].x,
  DOCKS[4].x, DOCKS[4].x,
  DOCKS[5].x, DOCKS[5].x,
];

export const PUCK_Y = [
  DOCKS[0].y, DOCKS[0].y,
  DOCKS[1].y, DOCKS[1].y,
  DOCKS[2].y, DOCKS[2].y,
  DOCKS[3].y, DOCKS[3].y,
  DOCKS[4].y, DOCKS[4].y,
  DOCKS[5].y, DOCKS[5].y,
];

// SVG path for the persistent thread. Connects every dock with a small arc so
// the line reads as motion rather than raw geometry.
export const THREAD_PATH_D = (() => {
  const points: [number, number][] = [];
  DOCKS.forEach((d, i) => {
    points.push([d.x, d.y]);
    if (i < DOCKS.length - 1) {
      const next = DOCKS[i + 1];
      const midX = (d.x + next.x) / 2;
      const midY = (d.y + next.y) / 2 - 6;
      points.push([midX, midY]);
    }
  });
  const [first, ...rest] = points;
  let d = `M ${first[0]} ${first[1]}`;
  rest.forEach(([x, y]) => {
    d += ` L ${x} ${y}`;
  });
  return d;
})();
