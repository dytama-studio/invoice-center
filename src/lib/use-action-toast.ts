"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

type ActionToastOptions = {
  action: (formData: FormData) => Promise<void> | void;
  successTitle: string;
  successDescription?: string;
  errorTitle?: string;
  onSuccess?: () => void;
};

export function useActionToast(options: ActionToastOptions) {
  const { toast } = useToast();
  const { action, successTitle, successDescription, errorTitle, onSuccess } = options;

  return React.useCallback(
    async (formData: FormData) => {
      try {
        await action(formData);
        toast({
          title: successTitle,
          description: successDescription,
          variant: "success"
        });
        onSuccess?.();
      } catch (error) {
        toast({
          title: errorTitle ?? "Action failed",
          description: getErrorMessage(error),
          variant: "error"
        });
      }
    },
    [action, errorTitle, onSuccess, successDescription, successTitle, toast]
  );
}
