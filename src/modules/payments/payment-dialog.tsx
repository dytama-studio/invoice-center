"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui2/select";
import { useActionToast } from "@/lib/use-action-toast";
import { formatIntegerInput, parseIntegerInput } from "@/lib/number";

type InvoiceOption = { id: number; number: string };

export function PaymentDialog({
  triggerLabel,
  invoiceId,
  invoices,
  onSubmit
}: {
  triggerLabel: string;
  invoiceId?: number;
  invoices?: InvoiceOption[];
  onSubmit: (formData: FormData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [amountInput, setAmountInput] = React.useState("");
  const handleSubmit = useActionToast({
    action: onSubmit,
    successTitle: "Payment recorded",
    errorTitle: "Save failed",
    onSuccess: () => {
      setOpen(false);
      setAmountInput("");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <Form action={handleSubmit}>
          {invoiceId ? (
            <input type="hidden" name="invoiceId" value={invoiceId} />
          ) : (
            <FormField>
              <Label>Invoice</Label>
              <Select name="invoiceId" required>
                {invoices?.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.number}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
          <FormRow>
            <FormField>
              <Label>Payment Date</Label>
              <Input type="date" name="paymentDate" required />
            </FormField>
            <FormField>
              <Label>Amount</Label>
              <input type="hidden" name="amount" value={amountInput ? String(parseIntegerInput(amountInput)) : ""} />
              <Input
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(event) => setAmountInput(formatIntegerInput(event.target.value))}
                required
              />
            </FormField>
            <FormField>
              <Label>Method</Label>
              <Input name="method" />
            </FormField>
            <FormField>
              <Label>Reference</Label>
              <Input name="reference" />
            </FormField>
          </FormRow>
          <div className="flex justify-end gap-2">
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
