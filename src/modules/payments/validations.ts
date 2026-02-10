import { z } from "zod";

export const paymentSchema = z.object({
  invoiceId: z.coerce.number(),
  paymentDate: z.string(),
  amount: z.coerce.number(),
  method: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const paymentUpdateSchema = paymentSchema.extend({
  id: z.coerce.number()
});

export type PaymentInput = z.infer<typeof paymentSchema>;
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
