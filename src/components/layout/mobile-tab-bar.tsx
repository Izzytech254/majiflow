"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Fixed bottom navigation for small screens, app-style. */
export function MobileTabBar({ items, className }: { items: TabItem[]; className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        {items.map((item) => {
          const active = item.href ? isActive(pathname, item.href) : false;
          const body = (
            <>
              <span className="relative">
                <item.icon
                  className={cn("size-5", active ? "text-[#0052FF]" : "text-muted-foreground")}
                  aria-hidden
                />
                {item.badge ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0052FF] px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  active ? "text-[#0052FF]" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </>
          );
          const classes = "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors";

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className={classes}
              aria-current={active ? "page" : undefined}
            >
              {body}
            </Link>
          ) : (
            <button key={item.label} type="button" onClick={item.onClick} className={classes}>
              {body}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
