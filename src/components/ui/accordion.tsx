"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/constants";

interface AccordionItemProps {
  value: string;
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ value, question, children, defaultOpen }: AccordionItemProps) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const panelId = `panel-${value}`;
  const buttonId = `button-${value}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white transition-colors",
        open ? "border-[#0052FF]/25 shadow-card" : "border-border"
      )}
    >
      <h3>
        <button
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left min-h-11"
        >
          <span className="text-[15px] font-semibold text-foreground">{question}</span>
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
              open
                ? "rotate-180 border-[#0052FF] bg-brand-gradient text-white"
                : "border-border text-muted-foreground"
            )}
          >
            <ChevronDown className="size-4" aria-hidden />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ items, className }: { items: { q: string; a: ReactNode }[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`${i}-${item.q}`} question={item.q}>
          {item.a}
        </AccordionItem>
      ))}
    </div>
  );
}