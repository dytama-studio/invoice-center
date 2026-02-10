import { db } from "@/db";
import { invoices, invoiceItems, invoiceTaxes, payments, contracts } from "@/db/schema";
import { calculateInvoiceTotals, deriveInvoiceStatus } from "@/server/finance/invoice-calculations";
import { eq } from "drizzle-orm";

export async function getDashboardSnapshot() {
  const invoiceList = await db.select().from(invoices);
  const snapshot = await Promise.all(
    invoiceList.map(async (invoice) => {
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
        id: invoice.id,
        number: invoice.number,
        status,
        total: totals.total.toFixed(2),
        balance: totals.balance.toFixed(2),
        currency: invoice.currency,
        issueDate: invoice.issueDate
      };
    })
  );

  const outstanding = snapshot.filter((item) => ["draft", "proforma", "partial"].includes(item.status));
  const paidInvoices = snapshot.filter((item) => ["paid", "overpaid"].includes(item.status));

  const contractsCount = await db.select({ id: contracts.id }).from(contracts);

  return {
    outstanding,
    paidInvoices,
    totalOutstanding: outstanding.reduce((sum, item) => sum + Number(item.balance), 0),
    totalPaid: paidInvoices.reduce((sum, item) => sum + Number(item.total), 0),
    contractsTotal: contractsCount.length
  };
}
