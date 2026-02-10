import { db } from "@/db";
import { invoices, invoiceItems, invoiceTaxes, payments, contracts } from "@/db/schema";
import { calculateInvoiceTotals, deriveInvoiceStatus } from "@/server/finance/invoice-calculations";
import { eq } from "drizzle-orm";

export async function getInvoices() {
  const list = await db
    .select({
      id: invoices.id,
      number: invoices.number,
      issueDate: invoices.issueDate,
      currency: invoices.currency,
      contractNo: contracts.contractNo,
      proformaId: invoices.proformaId
    })
    .from(invoices)
    .leftJoin(contracts, eq(invoices.contractId, contracts.id))
    .orderBy(invoices.issueDate);

  const rows = await Promise.all(
    list.map(async (invoice) => {
      const items = await db
        .select({ quantity: invoiceItems.quantity, unitPrice: invoiceItems.unitPrice })
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, invoice.id));
      const taxes = await db
        .select({ type: invoiceTaxes.type, rate: invoiceTaxes.rate })
        .from(invoiceTaxes)
        .where(eq(invoiceTaxes.invoiceId, invoice.id));
      const paid = await db
        .select({ amount: payments.amount })
        .from(payments)
        .where(eq(payments.invoiceId, invoice.id));

      const totals = calculateInvoiceTotals(items, taxes, paid);
      const status = deriveInvoiceStatus(totals.total, totals.paid, Boolean(invoice.proformaId));

      return {
        ...invoice,
        status,
        total: totals.total.toFixed(2),
        balance: totals.balance.toFixed(2)
      };
    })
  );

  return rows;
}

export async function getInvoiceDetail(id: number) {
  const invoice = await db.select().from(invoices).where(eq(invoices.id, id)).then((rows) => rows[0]);
  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));
  const taxes = await db.select().from(invoiceTaxes).where(eq(invoiceTaxes.invoiceId, id));
  const paymentList = await db.select().from(payments).where(eq(payments.invoiceId, id));

  const totals = calculateInvoiceTotals(
    items.map((item) => ({ quantity: item.quantity, unitPrice: item.unitPrice })),
    taxes.map((tax) => ({ type: tax.type, rate: tax.rate })),
    paymentList.map((payment) => ({ amount: payment.amount }))
  );

  const status = deriveInvoiceStatus(totals.total, totals.paid, Boolean(invoice?.proformaId));

  return { invoice, items, taxes, payments: paymentList, totals, status };
}

export async function getInvoiceLookups() {
  const contractsList = await db.select({ id: contracts.id, contractNo: contracts.contractNo }).from(contracts);
  return { contractsList };
}
