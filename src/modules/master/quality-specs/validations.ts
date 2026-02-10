import { z } from "zod";

export const qualitySpecSchema = z.object({
  commodityId: z.coerce.number(),
  name: z.string().min(2).max(120),
  description: z.string().optional()
});

export const qualitySpecUpdateSchema = qualitySpecSchema.extend({
  id: z.coerce.number()
});

export type QualitySpecInput = z.infer<typeof qualitySpecSchema>;
export type QualitySpecUpdateInput = z.infer<typeof qualitySpecUpdateSchema>;
