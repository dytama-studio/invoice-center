"use server";

import { db } from "@/db";
import { qualitySpecs } from "@/db/schema";
import { qualitySpecSchema, qualitySpecUpdateSchema } from "@/modules/master/quality-specs/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createQualitySpec(formData: FormData) {
  const values = qualitySpecSchema.parse(Object.fromEntries(formData));
  await db.insert(qualitySpecs).values(values);
  revalidatePath("/master/quality-specs");
}

export async function updateQualitySpec(formData: FormData) {
  const values = qualitySpecUpdateSchema.parse(Object.fromEntries(formData));
  await db
    .update(qualitySpecs)
    .set({ commodityId: values.commodityId, name: values.name, description: values.description })
    .where(eq(qualitySpecs.id, values.id));
  revalidatePath("/master/quality-specs");
}

export async function deleteQualitySpec(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(qualitySpecs).where(eq(qualitySpecs.id, id));
  revalidatePath("/master/quality-specs");
}
