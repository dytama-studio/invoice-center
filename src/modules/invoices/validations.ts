import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number(),
  unitPrice: z.number()
});

export const invoiceTaxSchema = z.object({
  type: z.enum(["PPN", "PPH22", "PPH23"]),
  rate: z.number()
});

export const invoiceSchema = z.object({
  contractId: z.number(),
  proformaId: z.number().optional().nullable(),
  number: z.string().min(2).max(60),
  issueDate: z.string(),
  dueDate: z.string().optional().nullable(),
  currency: z.string().default("IDR"),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1),
  taxes: z.array(invoiceTaxSchema)
});

export const invoiceUpdateSchema = invoiceSchema.extend({
  id: z.number()
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>;
