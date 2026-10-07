import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "select-none transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052FF]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200",
    "hover:[&_svg]:translate-x-0.5 group-hover:[&_svg]:translate-x-0.5",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-white shadow-accent hover:shadow-[0_16px_44px_-10px_rgba(0,82,255,0.6)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "border border-border bg-white text-foreground shadow-card hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5",
        outline:
          "border border-[#0052FF]/40 text-[#0052FF] bg-transparent hover:border-[#0052FF] hover:bg-[#0052FF]/5",
        ghost: "text-foreground hover:bg-muted",
        dark: "bg-white text-ink hover:bg-slate-100 hover:-translate-y-0.5 shadow-card",
        link: "text-[#0052FF] underline-offset-4 hover:underline",
      },
      size: {
        md: "h-11 rounded-lg px-5 text-sm",
        lg: "h-12 rounded-xl px-6 text-[15px] min-h-11",
        sm: "h-9 rounded-md px-3.5 text-sm",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };