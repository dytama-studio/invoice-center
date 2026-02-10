"use server";

import { db } from "@/db";
import { paymentAllocations, payments } from "@/db/schema";
import { paymentSchema, paymentUpdateSchema } from "@/modules/payments/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { reconcileInvoice } from "@/server/invoices/reconcile";

export async function createPayment(formData: FormData) {
  const values = paymentSchema.parse(Object.fromEntries(formData));
  const [payment] = await db
    .insert(payments)
    .values({
      invoiceId: values.invoiceId,
      paymentDate: values.paymentDate,
      amount: values.amount.toString(),
      method: values.method ?? null,
      reference: values.reference ?? null,
      notes: values.notes ?? null
    })
    .returning();

  await db.insert(paymentAllocations).values([
    { paymentId: payment.id, allocationType: "APN", percentage: "40.00" },
    { paymentId: payment.id, allocationType: "MITRA", percentage: "60.00" }
  ]);

  await reconcileInvoice(values.invoiceId);
  revalidatePath("/payments");
  revalidatePath(`/invoices/${values.invoiceId}`);
}

export async function updatePayment(formData: FormData) {
  const values = paymentUpdateSchema.parse(Object.fromEntries(formData));
  await db
    .update(payments)
    .set({
      paymentDate: values.paymentDate,
      amount: values.amount.toString(),
      method: values.method ?? null,
      reference: values.reference ?? null,
      notes: values.notes ?? null
    })
    .where(eq(payments.id, values.id));

  await db.delete(paymentAllocations).where(eq(paymentAllocations.paymentId, values.id));
  await db.insert(paymentAllocations).values([
    { paymentId: values.id, allocationType: "APN", percentage: "40.00" },
    { paymentId: values.id, allocationType: "MITRA", percentage: "60.00" }
  ]);

  await reconcileInvoice(values.invoiceId);
  revalidatePath("/payments");
  revalidatePath(`/invoices/${values.invoiceId}`);
}

export async function deletePayment(formData: FormData) {
  const id = Number(formData.get("id"));
  const invoiceId = Number(formData.get("invoiceId"));
  await db.delete(payments).where(eq(payments.id, id));
  await reconcileInvoice(invoiceId);
  revalidatePath("/payments");
  revalidatePath(`/invoices/${invoiceId}`);
}
