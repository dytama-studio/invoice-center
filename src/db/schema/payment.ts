import { date, index, integer, numeric, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "@/db/schema/common";
import { allocationTypeEnum } from "@/db/schema/enums";
import { invoices } from "@/db/schema/invoice";

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "restrict" }),
    paymentDate: date("payment_date").notNull(),
    amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
    method: varchar("method", { length: 40 }),
    reference: varchar("reference", { length: 80 }),
    notes: text("notes"),
    ...timestamps
  },
  (table) => ({
    invoiceIdx: index("payments_invoice_idx").on(table.invoiceId)
  })
);

export const paymentAllocations = pgTable(
  "payment_allocations",
  {
    id: serial("id").primaryKey(),
    paymentId: integer("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "cascade" }),
    allocationType: allocationTypeEnum("allocation_type").notNull(),
    percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
    ...timestamps
  },
  (table) => ({
    paymentIdx: index("payment_allocations_payment_idx").on(table.paymentId)
  })
);

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
  allocations: many(paymentAllocations)
}));

export const paymentAllocationsRelations = relations(paymentAllocations, ({ one }) => ({
  payment: one(payments, { fields: [paymentAllocations.paymentId], references: [payments.id] })
}));
