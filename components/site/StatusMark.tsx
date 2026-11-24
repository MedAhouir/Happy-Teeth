"use client";
import { motion } from "framer-motion";

/** Success / error mark that draws itself once when the dialog opens. */
export default function StatusMark({ kind }: { kind: "success" | "error" }) {
  const color = kind === "success" ? "#0E8F5C" : "#D6483D";
  const paths = kind === "success" ? ["M30 51 L44 65 L70 36"] : ["M33 33 L67 67", "M67 33 L33 67"];
  return (
    <svg width="84" height="84" viewBox="0 0 100 100" fill="none" aria-hidden>
      <motion.circle cx="50" cy="50" r="44" stroke={color} strokeWidth="5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
      {paths.map((d, i) => (
        <motion.path key={i} d={d} stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }} />
      ))}
    </svg>
  );
}
