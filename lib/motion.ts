import type { Transition, Variants } from "framer-motion";

/** Strong ease-out: fast start, long soft landing. Used for anything that arrives. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** No overshoot. Production polish, not playfulness. */
export const springSoft: Transition = { type: "spring", duration: 0.55, bounce: 0 };
export const springSnappy: Transition = { type: "spring", duration: 0.32, bounce: 0 };

/** Enter: opacity + small rise + 4px blur (materialises into focus). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

/** Exit is subtler than enter. */
export const fadeOutSoft = { opacity: 0, y: -6, filter: "blur(2px)" };
