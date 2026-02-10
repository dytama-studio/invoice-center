import { z } from "zod";

export const commoditySchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(120),
  uom: z.string().min(1).max(20)
});

export const commodityUpdateSchema = commoditySchema.extend({
  id: z.coerce.number()
});

export type CommodityInput = z.infer<typeof commoditySchema>;
export type CommodityUpdateInput = z.infer<typeof commodityUpdateSchema>;
