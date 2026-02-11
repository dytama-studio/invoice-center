"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = nanoid();
      setToasts((prev) => [...prev, { id, ...input }]);
      window.setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={cn(
              "pointer-events-auto rounded-md border bg-sheet p-3 shadow-card",
              toastItem.variant === "success" && "border-emerald-500/60",
              toastItem.variant === "error" && "border-red-500/60"
            )}
          >
            <div className="text-sm font-semibold text-foreground">{toastItem.title}</div>
            {toastItem.description ? (
              <div className="text-xs text-muted-foreground">{toastItem.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
