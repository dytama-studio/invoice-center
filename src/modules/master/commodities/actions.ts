"use server";

import { db } from "@/db";
import { commodities } from "@/db/schema";
import { commoditySchema, commodityUpdateSchema } from "@/modules/master/commodities/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createCommodity(formData: FormData) {
  const values = commoditySchema.parse(Object.fromEntries(formData));
  await db.insert(commodities).values(values);
  revalidatePath("/master/commodities");
}

export async function updateCommodity(formData: FormData) {
  const values = commodityUpdateSchema.parse(Object.fromEntries(formData));
  await db.update(commodities).set(values).where(eq(commodities.id, values.id));
  revalidatePath("/master/commodities");
}

export async function deleteCommodity(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(commodities).where(eq(commodities.id, id));
  revalidatePath("/master/commodities");
}
