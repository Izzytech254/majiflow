import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const fieldBase =
  "w-full rounded-lg border border-border bg-white px-3.5 text-sm text-foreground placeholder:text-slate-400 shadow-soft transition-colors min-h-11 focus:outline-2 focus:outline-offset-2 focus:outline-[#0052FF] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#dc2626]";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 3, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "py-2.5 resize-none", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, invalid, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "appearance-none bg-no-repeat pr-9", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.75rem center",
      }}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, error, required, children, className }: FieldProps) {
  const id = useId();
  const labelledChild = isValidElement(children)
    ? cloneElement(
        children as ReactElement<Record<string, unknown>>,
        Object.assign(
          { id },
          error ? { "aria-invalid": true } : {}
        ) as Record<string, unknown>
      )
    : children;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
            {label}
            {required && <span className="text-[#0052FF]"> *</span>}
          </label>
          {error && <Badge variant="danger">{error}</Badge>}
        </div>
      )}
      {labelledChild}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}