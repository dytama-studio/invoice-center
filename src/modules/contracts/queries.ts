import { db } from "@/db";
import { companies, contractItems, contracts, qualitySpecs, commodities, regions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function getContracts() {
  const seller = alias(companies, "seller");
  const buyer = alias(companies, "buyer");
  return db
    .select({
      id: contracts.id,
      contractNo: contracts.contractNo,
      sellerId: contracts.sellerCompanyId,
      buyerId: contracts.buyerCompanyId,
      sellerName: seller.name,
      buyerName: buyer.name,
      regionName: regions.name,
      status: contracts.status,
      contractDate: contracts.contractDate
    })
    .from(contracts)
    .leftJoin(regions, eq(contracts.regionId, regions.id))
    .leftJoin(seller, eq(contracts.sellerCompanyId, seller.id))
    .leftJoin(buyer, eq(contracts.buyerCompanyId, buyer.id))
    .orderBy(contracts.contractDate);
}

export async function getContractDetail(id: number) {
  const contract = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, id))
    .then((rows) => rows[0]);

  const items = await db
    .select({
      id: contractItems.id,
      commodityId: contractItems.commodityId,
      qualitySpecId: contractItems.qualitySpecId,
      commodityName: commodities.name,
      qualityName: qualitySpecs.name,
      description: contractItems.description,
      quantity: contractItems.quantity,
      unitPrice: contractItems.unitPrice,
      uom: contractItems.uom,
      deliveryStart: contractItems.deliveryStart,
      deliveryEnd: contractItems.deliveryEnd
    })
    .from(contractItems)
    .leftJoin(commodities, eq(contractItems.commodityId, commodities.id))
    .leftJoin(qualitySpecs, eq(contractItems.qualitySpecId, qualitySpecs.id))
    .where(eq(contractItems.contractId, id));

  return { contract, items };
}

export async function getContractLookups() {
  const [companyList, regionList, commodityList, qualityList] = await Promise.all([
    db.select({ id: companies.id, name: companies.name }).from(companies).orderBy(companies.name),
    db.select({ id: regions.id, name: regions.name }).from(regions).orderBy(regions.name),
    db.select({ id: commodities.id, name: commodities.name, uom: commodities.uom }).from(commodities),
    db
      .select({ id: qualitySpecs.id, name: qualitySpecs.name, commodityId: qualitySpecs.commodityId })
      .from(qualitySpecs)
  ]);

  return { companyList, regionList, commodityList, qualityList };
}
