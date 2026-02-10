import { db } from "@/db";
import { commodities } from "@/db/schema";

export async function getCommodities() {
  return db.select().from(commodities).orderBy(commodities.name);
}
