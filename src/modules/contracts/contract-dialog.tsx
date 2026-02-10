"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormRow } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Option = { id: number; name: string; uom?: string; commodityId?: number };

type ContractItem = {
  commodityId: number;
  qualitySpecId?: number | null;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  uom: string;
  deliveryStart?: string | null;
  deliveryEnd?: string | null;
};

type ContractPayload = {
  id?: number;
  contractNo: string;
  sellerCompanyId: number;
  buyerCompanyId: number;
  regionId: number;
  contractDate: string;
  status: "draft" | "active" | "closed";
  notes?: string | null;
  items: ContractItem[];
};

const emptyItem: ContractItem = {
  commodityId: 0,
  qualitySpecId: null,
  description: null,
  quantity: 0,
  unitPrice: 0,
  uom: ""
};

export function ContractDialog({
  triggerLabel,
  payload,
  companies,
  regions,
  commodities,
  qualitySpecs,
  onSubmit
}: {
  triggerLabel: string;
  payload?: ContractPayload;
  companies: Option[];
  regions: Option[];
  commodities: Option[];
  qualitySpecs: Option[];
  onSubmit: (formData: FormData) => void;
}) {
  const [form, setForm] = React.useState<ContractPayload>({
    id: payload?.id,
    contractNo: payload?.contractNo ?? "",
    sellerCompanyId: payload?.sellerCompanyId ?? 0,
    buyerCompanyId: payload?.buyerCompanyId ?? 0,
    regionId: payload?.regionId ?? 0,
    contractDate: payload?.contractDate ?? "",
    status: payload?.status ?? "draft",
    notes: payload?.notes ?? "",
    items: payload?.items?.length ? payload.items : [emptyItem]
  });

  function updateItem(index: number, key: keyof ContractItem, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]:
                key === "commodityId" ||
                key === "qualitySpecId" ||
                key === "quantity" ||
                key === "unitPrice"
                  ? Number(value)
                  : value
            }
          : item
      )
    }));
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  }

  function removeItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== index) }));
  }

  const payloadValue: ContractPayload = form;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{payload ? "Edit Contract" : "New Contract"}</DialogTitle>
        </DialogHeader>
        <Form action={onSubmit}>
          <input type="hidden" name="payload" value={JSON.stringify(payloadValue)} />
          <FormRow>
            <FormField>
              <Label>Contract No</Label>
              <Input
                value={form.contractNo}
                onChange={(event) => setForm((prev) => ({ ...prev, contractNo: event.target.value }))}
                required
              />
            </FormField>
            <FormField>
              <Label>Contract Date</Label>
              <Input
                type="date"
                value={form.contractDate}
                onChange={(event) => setForm((prev) => ({ ...prev, contractDate: event.target.value }))}
                required
              />
            </FormField>
            <FormField>
              <Label>Seller</Label>
              <Select
                value={form.sellerCompanyId}
                onChange={(event) => setForm((prev) => ({ ...prev, sellerCompanyId: Number(event.target.value) }))}
              >
                <option value="">Select</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Buyer</Label>
              <Select
                value={form.buyerCompanyId}
                onChange={(event) => setForm((prev) => ({ ...prev, buyerCompanyId: Number(event.target.value) }))}
              >
                <option value="">Select</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Region</Label>
              <Select
                value={form.regionId}
                onChange={(event) => setForm((prev) => ({ ...prev, regionId: Number(event.target.value) }))}
              >
                <option value="">Select</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label>Status</Label>
              <Select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ContractPayload["status"] }))}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </Select>
            </FormField>
          </FormRow>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted">Items</div>
            {form.items.map((item, index) => (
              <div key={index} className="rounded-md border p-3">
                <FormRow>
                  <FormField>
                    <Label>Commodity</Label>
                    <Select
                      value={item.commodityId}
                      onChange={(event) => {
                        const commodityId = Number(event.target.value);
                        const commodity = commodities.find((c) => c.id === commodityId);
                        updateItem(index, "commodityId", event.target.value);
                        updateItem(index, "uom", commodity?.uom ?? "");
                      }}
                    >
                      <option value="">Select</option>
                      {commodities.map((commodity) => (
                        <option key={commodity.id} value={commodity.id}>
                          {commodity.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Quality Spec</Label>
                    <Select
                      value={item.qualitySpecId ?? ""}
                      onChange={(event) => updateItem(index, "qualitySpecId", event.target.value)}
                    >
                      <option value="">Optional</option>
                      {qualitySpecs
                        .filter((spec) => !item.commodityId || spec.commodityId === item.commodityId)
                        .map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.name}
                          </option>
                        ))}
                    </Select>
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
                  <FormField>
                    <Label>UOM</Label>
                    <Input value={item.uom} onChange={(event) => updateItem(index, "uom", event.target.value)} />
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

          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit">{payload ? "Save Changes" : "Create Contract"}</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
