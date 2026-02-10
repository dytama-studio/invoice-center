import { date, index, integer, numeric, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "@/db/schema/common";
import { contractStatusEnum } from "@/db/schema/enums";
import { companies, commodities, qualitySpecs, regions } from "@/db/schema/master";

export const contracts = pgTable(
  "contracts",
  {
    id: serial("id").primaryKey(),
    contractNo: varchar("contract_no", { length: 60 }).notNull().unique(),
    sellerCompanyId: integer("seller_company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    buyerCompanyId: integer("buyer_company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    regionId: integer("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "restrict" }),
    contractDate: date("contract_date").notNull(),
    status: contractStatusEnum("status").notNull().default("draft"),
    notes: text("notes"),
    ...timestamps
  },
  (table) => ({
    sellerIdx: index("contracts_seller_idx").on(table.sellerCompanyId),
    buyerIdx: index("contracts_buyer_idx").on(table.buyerCompanyId),
    regionIdx: index("contracts_region_idx").on(table.regionId)
  })
);

export const contractItems = pgTable(
  "contract_items",
  {
    id: serial("id").primaryKey(),
    contractId: integer("contract_id")
      .notNull()
      .references(() => contracts.id, { onDelete: "cascade" }),
    commodityId: integer("commodity_id")
      .notNull()
      .references(() => commodities.id, { onDelete: "restrict" }),
    qualitySpecId: integer("quality_spec_id").references(() => qualitySpecs.id, { onDelete: "set null" }),
    description: text("description"),
    quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull(),
    uom: varchar("uom", { length: 20 }).notNull(),
    deliveryStart: date("delivery_start"),
    deliveryEnd: date("delivery_end"),
    ...timestamps
  },
  (table) => ({
    contractIdx: index("contract_items_contract_idx").on(table.contractId),
    commodityIdx: index("contract_items_commodity_idx").on(table.commodityId),
    qualityIdx: index("contract_items_quality_idx").on(table.qualitySpecId)
  })
);

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  seller: one(companies, { fields: [contracts.sellerCompanyId], references: [companies.id] }),
  buyer: one(companies, { fields: [contracts.buyerCompanyId], references: [companies.id] }),
  region: one(regions, { fields: [contracts.regionId], references: [regions.id] }),
  items: many(contractItems)
}));

export const contractItemsRelations = relations(contractItems, ({ one }) => ({
  contract: one(contracts, { fields: [contractItems.contractId], references: [contracts.id] }),
  commodity: one(commodities, { fields: [contractItems.commodityId], references: [commodities.id] }),
  qualitySpec: one(qualitySpecs, { fields: [contractItems.qualitySpecId], references: [qualitySpecs.id] })
}));
