import { index, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "@/db/schema/common";
import { companyTypeEnum } from "@/db/schema/enums";

export const regions = pgTable(
  "regions",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    ...timestamps
  },
  (table) => ({
    codeIdx: index("regions_code_idx").on(table.code)
  })
);

export const companies = pgTable(
  "companies",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    type: companyTypeEnum("type").notNull(),
    regionId: integer("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "restrict" }),
    taxId: varchar("tax_id", { length: 40 }),
    address: text("address"),
    email: varchar("email", { length: 120 }),
    phone: varchar("phone", { length: 40 }),
    ...timestamps
  },
  (table) => ({
    regionIdx: index("companies_region_idx").on(table.regionId)
  })
);

export const mills = pgTable(
  "mills",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 40 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    regionId: integer("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "restrict" }),
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    ...timestamps
  },
  (table) => ({
    regionIdx: index("mills_region_idx").on(table.regionId),
    companyIdx: index("mills_company_idx").on(table.companyId)
  })
);

export const commodities = pgTable(
  "commodities",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    uom: varchar("uom", { length: 20 }).notNull(),
    ...timestamps
  },
  (table) => ({
    codeIdx: index("commodities_code_idx").on(table.code)
  })
);

export const qualitySpecs = pgTable(
  "quality_specs",
  {
    id: serial("id").primaryKey(),
    commodityId: integer("commodity_id")
      .notNull()
      .references(() => commodities.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    ...timestamps
  },
  (table) => ({
    commodityIdx: index("quality_specs_commodity_idx").on(table.commodityId)
  })
);

export const regionsRelations = relations(regions, ({ many }) => ({
  companies: many(companies),
  mills: many(mills)
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  region: one(regions, {
    fields: [companies.regionId],
    references: [regions.id]
  }),
  mills: many(mills)
}));

export const millsRelations = relations(mills, ({ one }) => ({
  region: one(regions, {
    fields: [mills.regionId],
    references: [regions.id]
  }),
  company: one(companies, {
    fields: [mills.companyId],
    references: [companies.id]
  })
}));

export const commoditiesRelations = relations(commodities, ({ many }) => ({
  qualitySpecs: many(qualitySpecs)
}));

export const qualitySpecsRelations = relations(qualitySpecs, ({ one }) => ({
  commodity: one(commodities, {
    fields: [qualitySpecs.commodityId],
    references: [commodities.id]
  })
}));
