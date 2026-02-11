"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useActionToast } from "@/lib/use-action-toast";

export function PaymentDeleteForm({
  paymentId,
  invoiceId,
  onDelete
}: {
  paymentId: number;
  invoiceId: number;
  onDelete: (formData: FormData) => void;
}) {
  const handleDelete = useActionToast({
    action: onDelete,
    successTitle: "Payment deleted",
    errorTitle: "Delete failed"
  });

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={paymentId} />
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <Button size="sm" variant="ghost" type="submit">
        Delete
      </Button>
    </form>
  );
}
