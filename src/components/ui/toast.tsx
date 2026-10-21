"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useMotionSafe } from "@/lib/motion";

type ToastKind = "success" | "error" | "info";
interface ToastData {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

const DURATION = 4200;

const ToastContext = createContext<{ toast: (t: Omit<ToastData, "id">) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const meta: Record<ToastKind, { icon: ReactNode; ring: string }> = {
  success: { icon: <CheckCircle2 className="size-4.5 text-success" aria-hidden />, ring: "bg-success-soft" },
  error: { icon: <AlertCircle className="size-4.5 text-danger" aria-hidden />, ring: "bg-danger-soft" },
  info: { icon: <Info className="size-4.5 text-[var(--brand)]" aria-hidden />, ring: "bg-[var(--brand)]/10" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const idRef = useRef(0);
  const { reduce, transition } = useMotionSafe();

  const toast = useCallback((t: Omit<ToastData, "id">) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, DURATION);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id));
  useEffect(() => () => setToasts([]), []);

  const toastTransition = transition ?? { duration: 0.35, ease: [0.16, 1, 0.3, 1] };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        style={{ bottom: "var(--notify-bottom)" }}
        className="pointer-events-none fixed inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={toastTransition}
              className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-border bg-white p-4 shadow-layered"
              role="status"
            >
              <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${meta[toast.kind].ring}`}>
                {meta[toast.kind].icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                {toast.message && (
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-0.5 bg-[var(--brand)]"
                  initial={{ width: "100%" }}
                  animate={{ width: 0 }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
