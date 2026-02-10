import Decimal from "decimal.js";
import { taxTypeEnum } from "@/db/schema/enums";

type Item = { quantity: string; unitPrice: string };
type Tax = { type: (typeof taxTypeEnum.enumValues)[number]; rate: string };
type Payment = { amount: string };

export type InvoiceTotals = {
  itemsTotal: Decimal;
  ppn: Decimal;
  withheld: Decimal;
  total: Decimal;
  paid: Decimal;
  balance: Decimal;
};

export function calculateInvoiceTotals(items: Item[], taxes: Tax[], payments: Payment[]): InvoiceTotals {
  const itemsTotal = items.reduce(
    (acc, item) => acc.plus(new Decimal(item.quantity).mul(item.unitPrice)),
    new Decimal(0)
  );

  const ppn = taxes
    .filter((tax) => tax.type === "PPN")
    .reduce((acc, tax) => acc.plus(itemsTotal.mul(tax.rate)), new Decimal(0));

  const withheld = taxes
    .filter((tax) => tax.type === "PPH22" || tax.type === "PPH23")
    .reduce((acc, tax) => acc.plus(itemsTotal.mul(tax.rate)), new Decimal(0));

  const total = itemsTotal.plus(ppn).minus(withheld);

  const paid = payments.reduce((acc, payment) => acc.plus(payment.amount), new Decimal(0));

  const balance = total.minus(paid);

  return { itemsTotal, ppn, withheld, total, paid, balance };
}

export function deriveInvoiceStatus(total: Decimal, paid: Decimal, hasProforma: boolean) {
  if (paid.eq(0)) {
    return hasProforma ? "proforma" : "draft";
  }
  if (paid.lt(total)) {
    return "partial";
  }
  if (paid.eq(total)) {
    return "paid";
  }
  return "overpaid";
}
