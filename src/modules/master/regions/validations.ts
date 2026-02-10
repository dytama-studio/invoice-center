import { z } from "zod";

export const regionSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(120)
});

export const regionUpdateSchema = regionSchema.extend({
  id: z.coerce.number()
});

export type RegionInput = z.infer<typeof regionSchema>;
export type RegionUpdateInput = z.infer<typeof regionUpdateSchema>;
