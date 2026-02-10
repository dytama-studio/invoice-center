import { db } from "@/db";
import { contractItems, contracts, proformaInvoices, proformaItems, commodities, qualitySpecs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProformas() {
  return db
    .select({
      id: proformaInvoices.id,
      number: proformaInvoices.number,
      status: proformaInvoices.status,
      issueDate: proformaInvoices.issueDate,
      contractNo: contracts.contractNo
    })
    .from(proformaInvoices)
    .leftJoin(contracts, eq(proformaInvoices.contractId, contracts.id))
    .orderBy(proformaInvoices.issueDate);
}

export async function getProformaDetail(id: number) {
  const proforma = await db
    .select()
    .from(proformaInvoices)
    .where(eq(proformaInvoices.id, id))
    .then((rows) => rows[0]);

  const items = await db
    .select({
      id: proformaItems.id,
      description: proformaItems.description,
      quantity: proformaItems.quantity,
      unitPrice: proformaItems.unitPrice,
      commodityName: commodities.name,
      qualityName: qualitySpecs.name
    })
    .from(proformaItems)
    .leftJoin(contractItems, eq(proformaItems.contractItemId, contractItems.id))
    .leftJoin(commodities, eq(contractItems.commodityId, commodities.id))
    .leftJoin(qualitySpecs, eq(contractItems.qualitySpecId, qualitySpecs.id))
    .where(eq(proformaItems.proformaId, id));

  return { proforma, items };
}

export async function getContractLookup() {
  return db.select({ id: contracts.id, contractNo: contracts.contractNo }).from(contracts).orderBy(contracts.contractNo);
}
