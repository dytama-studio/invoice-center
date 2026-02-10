import { date, index, integer, numeric, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "@/db/schema/common";
import { invoiceStatusEnum, taxTypeEnum } from "@/db/schema/enums";
import { contracts } from "@/db/schema/contract";
import { proformaInvoices } from "@/db/schema/proforma";

export const invoices = pgTable(
  "invoices",
  {
    id: serial("id").primaryKey(),
    contractId: integer("contract_id")
      .notNull()
      .references(() => contracts.id, { onDelete: "restrict" }),
    proformaId: integer("proforma_id").references(() => proformaInvoices.id, { onDelete: "set null" }),
    number: varchar("number", { length: 60 }).notNull().unique(),
    issueDate: date("issue_date").notNull(),
    dueDate: date("due_date"),
    currency: varchar("currency", { length: 10 }).notNull().default("IDR"),
    status: invoiceStatusEnum("status").notNull().default("draft"),
    notes: text("notes"),
    ...timestamps
  },
  (table) => ({
    contractIdx: index("invoices_contract_idx").on(table.contractId),
    proformaIdx: index("invoices_proforma_idx").on(table.proformaId)
  })
);

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull(),
    ...timestamps
  },
  (table) => ({
    invoiceIdx: index("invoice_items_invoice_idx").on(table.invoiceId)
  })
);

export const invoiceTaxes = pgTable(
  "invoice_taxes",
  {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    type: taxTypeEnum("type").notNull(),
    rate: numeric("rate", { precision: 6, scale: 4 }).notNull(),
    ...timestamps
  },
  (table) => ({
    invoiceIdx: index("invoice_taxes_invoice_idx").on(table.invoiceId)
  })
);

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  contract: one(contracts, { fields: [invoices.contractId], references: [contracts.id] }),
  proforma: one(proformaInvoices, { fields: [invoices.proformaId], references: [proformaInvoices.id] }),
  items: many(invoiceItems),
  taxes: many(invoiceTaxes)
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] })
}));

export const invoiceTaxesRelations = relations(invoiceTaxes, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceTaxes.invoiceId], references: [invoices.id] })
}));
