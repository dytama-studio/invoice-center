import { db } from "@/db";
import { payments, invoices, paymentAllocations } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function getPayments() {
  return db
    .select({
      id: payments.id,
      invoiceId: payments.invoiceId,
      invoiceNumber: invoices.number,
      paymentDate: payments.paymentDate,
      amount: payments.amount,
      method: payments.method
    })
    .from(payments)
    .leftJoin(invoices, eq(payments.invoiceId, invoices.id))
    .orderBy(payments.paymentDate);
}

export async function getPaymentsByInvoice(invoiceId: number) {
  const paymentList = await db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
  const allocations = paymentList.length
    ? await db
        .select()
        .from(paymentAllocations)
        .where(inArray(paymentAllocations.paymentId, paymentList.map((payment) => payment.id)))
    : [];
  return { paymentList, allocations };
}

export async function getInvoiceLookup() {
  return db.select({ id: invoices.id, number: invoices.number }).from(invoices).orderBy(invoices.number);
}
