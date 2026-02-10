import { db } from "@/db";
import { companies, regions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCompanies() {
  return db
    .select({
      id: companies.id,
      name: companies.name,
      type: companies.type,
      regionId: companies.regionId,
      regionName: regions.name,
      email: companies.email,
      phone: companies.phone
    })
    .from(companies)
    .leftJoin(regions, eq(companies.regionId, regions.id))
    .orderBy(companies.name);
}

export async function getRegionsLookup() {
  return db.select({ id: regions.id, name: regions.name }).from(regions).orderBy(regions.name);
}
