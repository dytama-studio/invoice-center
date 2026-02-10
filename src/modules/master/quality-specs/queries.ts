import { db } from "@/db";
import { commodities, qualitySpecs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getQualitySpecs() {
  return db
    .select({
      id: qualitySpecs.id,
      commodityId: qualitySpecs.commodityId,
      commodityName: commodities.name,
      name: qualitySpecs.name,
      description: qualitySpecs.description
    })
    .from(qualitySpecs)
    .leftJoin(commodities, eq(qualitySpecs.commodityId, commodities.id))
    .orderBy(qualitySpecs.name);
}

export async function getCommoditiesLookup() {
  return db.select({ id: commodities.id, name: commodities.name }).from(commodities).orderBy(commodities.name);
}
