"use server";

import { db } from "@/db";
import { invoiceItems, invoiceTaxes, invoices } from "@/db/schema";
import { invoiceSchema, invoiceUpdateSchema } from "@/modules/invoices/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { reconcileInvoice } from "@/server/invoices/reconcile";

function parseInvoicePayload(formData: FormData) {
  const raw = formData.get("payload");
  if (!raw || typeof raw !== "string") {
    throw new Error("Invalid payload");
  }
  return JSON.parse(raw) as Record<string, unknown>;
}

export async function createInvoice(formData: FormData) {
  const payload = parseInvoicePayload(formData);
  const values = invoiceSchema.parse(payload);

  const [invoice] = await db
    .insert(invoices)
    .values({
      contractId: values.contractId,
      proformaId: values.proformaId ?? null,
      number: values.number,
      issueDate: values.issueDate,
      dueDate: values.dueDate ?? null,
      currency: values.currency,
      notes: values.notes ?? null
    })
    .returning();

  await db.insert(invoiceItems).values(
    values.items.map((item) => ({
      invoiceId: invoice.id,
      description: item.description,
      quantity: item.quantity.toString(),
      unitPrice: Math.round(item.unitPrice).toString()
    }))
  );

  if (values.taxes.length) {
    await db.insert(invoiceTaxes).values(
      values.taxes.map((tax) => ({
        invoiceId: invoice.id,
        type: tax.type,
        rate: tax.rate.toString()
      }))
    );
  }

  await reconcileInvoice(invoice.id);
  revalidatePath("/invoices");
}

export async function updateInvoice(formData: FormData) {
  const payload = parseInvoicePayload(formData);
  const values = invoiceUpdateSchema.parse(payload);

  await db
    .update(invoices)
    .set({
      contractId: values.contractId,
      proformaId: values.proformaId ?? null,
      number: values.number,
      issueDate: values.issueDate,
      dueDate: values.dueDate ?? null,
      currency: values.currency,
      notes: values.notes ?? null
    })
    .where(eq(invoices.id, values.id));

  await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, values.id));
  await db.delete(invoiceTaxes).where(eq(invoiceTaxes.invoiceId, values.id));

  await db.insert(invoiceItems).values(
    values.items.map((item) => ({
      invoiceId: values.id,
      description: item.description,
      quantity: item.quantity.toString(),
      unitPrice: Math.round(item.unitPrice).toString()
    }))
  );

  if (values.taxes.length) {
    await db.insert(invoiceTaxes).values(
      values.taxes.map((tax) => ({
        invoiceId: values.id,
        type: tax.type,
        rate: tax.rate.toString()
      }))
    );
  }

  await reconcileInvoice(values.id);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${values.id}`);
}

export async function deleteInvoice(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(invoices).where(eq(invoices.id, id));
  revalidatePath("/invoices");
}
