import { db } from "@/db";
import { invoiceItems, invoiceTaxes, invoices, payments } from "@/db/schema";
import { calculateInvoiceTotals, deriveInvoiceStatus } from "@/server/finance/invoice-calculations";
import { eq } from "drizzle-orm";

export async function reconcileInvoice(invoiceId: number) {
  const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
  if (!invoice) return;

  const items = await db
    .select({ quantity: invoiceItems.quantity, unitPrice: invoiceItems.unitPrice })
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoiceId));

  const taxes = await db
    .select({ type: invoiceTaxes.type, rate: invoiceTaxes.rate })
    .from(invoiceTaxes)
    .where(eq(invoiceTaxes.invoiceId, invoiceId));

  const paid = await db
    .select({ amount: payments.amount })
    .from(payments)
    .where(eq(payments.invoiceId, invoiceId));

  const totals = calculateInvoiceTotals(items, taxes, paid);
  const status = deriveInvoiceStatus(totals.total, totals.paid, Boolean(invoice.proformaId));

  await db.update(invoices).set({ status }).where(eq(invoices.id, invoiceId));
}
