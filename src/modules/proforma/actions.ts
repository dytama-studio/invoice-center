"use server";

import { db } from "@/db";
import { contractItems, proformaInvoices, proformaItems } from "@/db/schema";
import { proformaSchema, proformaUpdateSchema } from "@/modules/proforma/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createProforma(formData: FormData) {
  const values = proformaSchema.parse(Object.fromEntries(formData));
  const [proforma] = await db
    .insert(proformaInvoices)
    .values({
      contractId: values.contractId,
      number: values.number,
      issueDate: values.issueDate,
      dueDate: values.dueDate ?? null,
      status: values.status,
      notes: values.notes ?? null
    })
    .returning();

  const items = await db.select().from(contractItems).where(eq(contractItems.contractId, values.contractId));

  if (items.length) {
    await db.insert(proformaItems).values(
      items.map((item) => ({
        proformaId: proforma.id,
        contractItemId: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    );
  }

  revalidatePath("/proforma");
}

export async function updateProforma(formData: FormData) {
  const values = proformaUpdateSchema.parse(Object.fromEntries(formData));
  await db
    .update(proformaInvoices)
    .set({
      issueDate: values.issueDate,
      dueDate: values.dueDate ?? null,
      status: values.status,
      notes: values.notes ?? null
    })
    .where(eq(proformaInvoices.id, values.id));
  revalidatePath("/proforma");
  revalidatePath(`/proforma/${values.id}`);
}

export async function deleteProforma(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(proformaInvoices).where(eq(proformaInvoices.id, id));
  revalidatePath("/proforma");
}
