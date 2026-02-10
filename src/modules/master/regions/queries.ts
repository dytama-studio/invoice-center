import { db } from "@/db";
import { regions } from "@/db/schema";

export async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}
