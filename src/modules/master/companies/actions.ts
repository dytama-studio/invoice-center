"use server";

import { db } from "@/db";
import { companies } from "@/db/schema";
import { companySchema, companyUpdateSchema } from "@/modules/master/companies/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createCompany(formData: FormData) {
  const values = companySchema.parse(Object.fromEntries(formData));
  await db.insert(companies).values(values);
  revalidatePath("/master/companies");
}

export async function updateCompany(formData: FormData) {
  const values = companyUpdateSchema.parse(Object.fromEntries(formData));
  await db
    .update(companies)
    .set({
      name: values.name,
      type: values.type,
      regionId: values.regionId,
      taxId: values.taxId,
      address: values.address,
      email: values.email,
      phone: values.phone
    })
    .where(eq(companies.id, values.id));
  revalidatePath("/master/companies");
}

export async function deleteCompany(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(companies).where(eq(companies.id, id));
  revalidatePath("/master/companies");
}
