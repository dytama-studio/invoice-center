import { z } from "zod";

export const proformaSchema = z.object({
  contractId: z.coerce.number(),
  number: z.string().min(2).max(60),
  issueDate: z.string(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(["draft", "issued"]).default("draft"),
  notes: z.string().optional().nullable()
});

export const proformaUpdateSchema = proformaSchema.extend({
  id: z.coerce.number()
});

export type ProformaInput = z.infer<typeof proformaSchema>;
export type ProformaUpdateInput = z.infer<typeof proformaUpdateSchema>;
