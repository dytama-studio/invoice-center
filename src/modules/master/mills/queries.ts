import { db } from "@/db";
import { companies, mills, regions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getMills() {
  return db
    .select({
      id: mills.id,
      code: mills.code,
      name: mills.name,
      regionId: mills.regionId,
      regionName: regions.name,
      companyId: mills.companyId,
      companyName: companies.name
    })
    .from(mills)
    .leftJoin(regions, eq(mills.regionId, regions.id))
    .leftJoin(companies, eq(mills.companyId, companies.id))
    .orderBy(mills.name);
}

export async function getMillsLookups() {
  const [regionList, companyList] = await Promise.all([
    db.select({ id: regions.id, name: regions.name }).from(regions).orderBy(regions.name),
    db.select({ id: companies.id, name: companies.name }).from(companies).orderBy(companies.name)
  ]);

  return { regionList, companyList };
}
