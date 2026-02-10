"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <Form action={onSubmit}>
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
              <Input type="number" step="0.01" name="amount" required />
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
