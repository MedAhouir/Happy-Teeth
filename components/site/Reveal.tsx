"use client";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** One quiet entrance per block, played once. Used on headings and groups, not on every card. */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "ul" | "li" | "header";
}) {
  const Comp = motion[as] as typeof motion.div;
  const reduce = useReducedMotion();
  return (
    <Comp
      className={cn(className)}
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay }}
    >
      {children}
    </Comp>
  );
}
