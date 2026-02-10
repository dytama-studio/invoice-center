"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Option = { id: number; contractNo: string };

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceTax = {
  type: "PPN" | "PPH22" | "PPH23";
  rate: number;
};

type InvoicePayload = {
  id?: number;
  contractId: number;
  proformaId?: number | null;
  number: string;
  issueDate: string;
  dueDate?: string | null;
  currency: string;
  notes?: string | null;
  items: InvoiceItem[];
  taxes: InvoiceTax[];
};

const emptyItem: InvoiceItem = { description: "", quantity: 0, unitPrice: 0 };

export function InvoiceDialog({
  triggerLabel,
  payload,
  contracts,
  onSubmit
}: {
  triggerLabel: string;
  payload?: InvoicePayload;
  contracts: Option[];
  onSubmit: (formData: FormData) => void;
}) {
  const [form, setForm] = React.useState<InvoicePayload>({
    id: payload?.id,
    contractId: payload?.contractId ?? 0,
    proformaId: payload?.proformaId ?? null,
    number: payload?.number ?? "",
    issueDate: payload?.issueDate ?? "",
    dueDate: payload?.dueDate ?? "",
    currency: payload?.currency ?? "IDR",
    notes: payload?.notes ?? "",
    items: payload?.items?.length ? payload.items : [emptyItem],
    taxes: payload?.taxes?.length ? payload.taxes : [
      { type: "PPN", rate: 0.11 },
      { type: "PPH22", rate: 0 },
      { type: "PPH23", rate: 0 }
    ]
  });

  function updateItem(index: number, key: keyof InvoiceItem, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index
          ? { ...item, [key]: key === "quantity" || key === "unitPrice" ? Number(value) : value }
          : item
      )
    }));
  }

  function updateTax(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      taxes: prev.taxes.map((tax, idx) => (idx === index ? { ...tax, rate: Number(value) } : tax))
    }));
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  }

  function removeItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== index) }));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{payload ? "Edit Invoice" : "New Invoice"}</DialogTitle>
        </DialogHeader>
        <Form action={onSubmit}>
          <input type="hidden" name="payload" value={JSON.stringify(form)} />
          <FormRow>
            <FormField>
              <Label>Contract</Label>
              <Select
                value={form.contractId}
                onChange={(event) => setForm((prev) => ({ ...prev, contractId: Number(event.target.value) }))}
              >
                <option value="">Select</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.contractNo}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Invoice No</Label>
              <Input value={form.number} onChange={(event) => setForm((prev) => ({ ...prev, number: event.target.value }))} />
            </FormField>
            <FormField>
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={form.issueDate}
                onChange={(event) => setForm((prev) => ({ ...prev, issueDate: event.target.value }))}
              />
            </FormField>
            <FormField>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              />
            </FormField>
          </FormRow>

          <div className="mt-3 space-y-2">
            <div className="text-xs font-semibold text-muted">Items</div>
            {form.items.map((item, index) => (
              <div key={index} className="rounded-md border p-3">
                <FormRow>
                  <FormField className="md:col-span-6">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(event) => updateItem(index, "description", event.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, "quantity", event.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) => updateItem(index, "unitPrice", event.target.value)}
                    />
                  </FormField>
                </FormRow>
                <div className="mt-2 flex justify-end">
                  <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={addItem}>
              Add Item
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            <div className="text-xs font-semibold text-muted">Taxes</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {form.taxes.map((tax, index) => (
                <div key={tax.type} className="space-y-1">
                  <Label>{tax.type} Rate</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={tax.rate}
                    onChange={(event) => updateTax(index, event.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit">{payload ? "Save Changes" : "Create Invoice"}</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
