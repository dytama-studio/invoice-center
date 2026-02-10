import { pgEnum } from "drizzle-orm/pg-core";

export const companyTypeEnum = pgEnum("company_type", ["mitra", "buyer", "vendor"]);
export const contractStatusEnum = pgEnum("contract_status", ["draft", "active", "closed"]);
export const proformaStatusEnum = pgEnum("proforma_status", ["draft", "issued"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "proforma", "partial", "paid", "overpaid"]);
export const taxTypeEnum = pgEnum("tax_type", ["PPN", "PPH22", "PPH23"]);
export const allocationTypeEnum = pgEnum("allocation_type", ["APN", "MITRA"]);
