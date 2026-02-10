import { z } from "zod";

export const millSchema = z.object({
  code: z.string().min(2).max(40),
  name: z.string().min(2).max(160),
  regionId: z.coerce.number(),
  companyId: z.coerce.number()
});

export const millUpdateSchema = millSchema.extend({
  id: z.coerce.number()
});

export type MillInput = z.infer<typeof millSchema>;
export type MillUpdateInput = z.infer<typeof millUpdateSchema>;
