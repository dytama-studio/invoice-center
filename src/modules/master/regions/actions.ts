"use server";

import { db } from "@/db";
import { regions } from "@/db/schema";
import { regionSchema, regionUpdateSchema } from "@/modules/master/regions/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createRegion(formData: FormData) {
  const values = regionSchema.parse(Object.fromEntries(formData));
  await db.insert(regions).values(values);
  revalidatePath("/master/regions");
}

export async function updateRegion(formData: FormData) {
  const values = regionUpdateSchema.parse(Object.fromEntries(formData));
  await db.update(regions).set({ code: values.code, name: values.name }).where(eq(regions.id, values.id));
  revalidatePath("/master/regions");
}

export async function deleteRegion(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(regions).where(eq(regions.id, id));
  revalidatePath("/master/regions");
}
