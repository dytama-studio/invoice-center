import { z } from "zod";

export const contractItemSchema = z.object({
  commodityId: z.number(),
  qualitySpecId: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number(),
  unitPrice: z.number(),
  uom: z.string(),
  deliveryStart: z.string().optional().nullable(),
  deliveryEnd: z.string().optional().nullable()
});

export const contractSchema = z.object({
  contractNo: z.string().min(2).max(60),
  sellerCompanyId: z.number(),
  buyerCompanyId: z.number(),
  regionId: z.number(),
  contractDate: z.string(),
  status: z.enum(["draft", "active", "closed"]),
  notes: z.string().optional().nullable(),
  items: z.array(contractItemSchema).min(1)
});

export const contractUpdateSchema = contractSchema.extend({
  id: z.number()
});

export type ContractInput = z.infer<typeof contractSchema>;
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;
