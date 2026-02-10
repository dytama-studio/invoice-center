import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2).max(160),
  type: z.enum(["mitra", "buyer", "vendor"]),
  regionId: z.coerce.number(),
  taxId: z.string().max(40).optional(),
  address: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export const companyUpdateSchema = companySchema.extend({
  id: z.coerce.number()
});

export type CompanyInput = z.infer<typeof companySchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
