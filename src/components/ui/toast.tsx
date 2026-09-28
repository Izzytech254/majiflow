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
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/constants";

type ToastKind = "success" | "error" | "info";
interface ToastData {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

const ToastContext = createContext<{ toast: (t: Omit<ToastData, "id">) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 className="size-4.5 text-success" aria-hidden />,
  error: <AlertCircle className="size-4.5 text-danger" aria-hidden />,
  info: <Info className="size-4.5 text-[#0052FF]" aria-hidden />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((t: Omit<ToastData, "id">) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id));
  useEffect(() => () => setToasts([]), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-layered"
              role="status"
            >
              <span className="mt-0.5 shrink-0">{icons[t.kind]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.message && (
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}