import { date, index, integer, numeric, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "@/db/schema/common";
import { proformaStatusEnum } from "@/db/schema/enums";
import { contracts, contractItems } from "@/db/schema/contract";

export const proformaInvoices = pgTable(
  "proforma_invoices",
  {
    id: serial("id").primaryKey(),
    contractId: integer("contract_id")
      .notNull()
      .references(() => contracts.id, { onDelete: "restrict" }),
    number: varchar("number", { length: 60 }).notNull().unique(),
    issueDate: date("issue_date").notNull(),
    dueDate: date("due_date"),
    status: proformaStatusEnum("status").notNull().default("draft"),
    notes: text("notes"),
    ...timestamps
  },
  (table) => ({
    contractIdx: index("proforma_contract_idx").on(table.contractId)
  })
);

export const proformaItems = pgTable(
  "proforma_items",
  {
    id: serial("id").primaryKey(),
    proformaId: integer("proforma_id")
      .notNull()
      .references(() => proformaInvoices.id, { onDelete: "cascade" }),
    contractItemId: integer("contract_item_id")
      .notNull()
      .references(() => contractItems.id, { onDelete: "restrict" }),
    description: text("description"),
    quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull(),
    ...timestamps
  },
  (table) => ({
    proformaIdx: index("proforma_items_proforma_idx").on(table.proformaId),
    contractItemIdx: index("proforma_items_contract_item_idx").on(table.contractItemId)
  })
);

export const proformaInvoicesRelations = relations(proformaInvoices, ({ one, many }) => ({
  contract: one(contracts, { fields: [proformaInvoices.contractId], references: [contracts.id] }),
  items: many(proformaItems)
}));

export const proformaItemsRelations = relations(proformaItems, ({ one }) => ({
  proforma: one(proformaInvoices, { fields: [proformaItems.proformaId], references: [proformaInvoices.id] }),
  contractItem: one(contractItems, { fields: [proformaItems.contractItemId], references: [contractItems.id] })
}));
