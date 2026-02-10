"use server";

import { db } from "@/db";
import { mills } from "@/db/schema";
import { millSchema, millUpdateSchema } from "@/modules/master/mills/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createMill(formData: FormData) {
  const values = millSchema.parse(Object.fromEntries(formData));
  await db.insert(mills).values(values);
  revalidatePath("/master/mills");
}

export async function updateMill(formData: FormData) {
  const values = millUpdateSchema.parse(Object.fromEntries(formData));
  await db
    .update(mills)
    .set({
      code: values.code,
      name: values.name,
      regionId: values.regionId,
      companyId: values.companyId
    })
    .where(eq(mills.id, values.id));
  revalidatePath("/master/mills");
}

export async function deleteMill(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(mills).where(eq(mills.id, id));
  revalidatePath("/master/mills");
}
