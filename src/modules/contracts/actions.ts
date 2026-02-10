"use server";

import { db } from "@/db";
import { contractItems, contracts } from "@/db/schema";
import { contractSchema, contractUpdateSchema } from "@/modules/contracts/validations";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

function parseContractPayload(formData: FormData) {
  const raw = formData.get("payload");
  if (!raw || typeof raw !== "string") {
    throw new Error("Invalid payload");
  }
  const json = JSON.parse(raw) as Record<string, unknown>;
  return json;
}

export async function createContract(formData: FormData) {
  const payload = parseContractPayload(formData);
  const values = contractSchema.parse(payload);

  const [contract] = await db
    .insert(contracts)
    .values({
      contractNo: values.contractNo,
      sellerCompanyId: values.sellerCompanyId,
      buyerCompanyId: values.buyerCompanyId,
      regionId: values.regionId,
      contractDate: values.contractDate,
      status: values.status,
      notes: values.notes
    })
    .returning();

  await db.insert(contractItems).values(
    values.items.map((item) => ({
      contractId: contract.id,
      commodityId: item.commodityId,
      qualitySpecId: item.qualitySpecId ?? null,
      description: item.description ?? null,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      uom: item.uom,
      deliveryStart: item.deliveryStart ?? null,
      deliveryEnd: item.deliveryEnd ?? null
    }))
  );

  revalidatePath("/contracts");
}

export async function updateContract(formData: FormData) {
  const payload = parseContractPayload(formData);
  const values = contractUpdateSchema.parse(payload);

  await db
    .update(contracts)
    .set({
      contractNo: values.contractNo,
      sellerCompanyId: values.sellerCompanyId,
      buyerCompanyId: values.buyerCompanyId,
      regionId: values.regionId,
      contractDate: values.contractDate,
      status: values.status,
      notes: values.notes
    })
    .where(eq(contracts.id, values.id));

  await db.delete(contractItems).where(eq(contractItems.contractId, values.id));
  await db.insert(contractItems).values(
    values.items.map((item) => ({
      contractId: values.id,
      commodityId: item.commodityId,
      qualitySpecId: item.qualitySpecId ?? null,
      description: item.description ?? null,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      uom: item.uom,
      deliveryStart: item.deliveryStart ?? null,
      deliveryEnd: item.deliveryEnd ?? null
    }))
  );

  revalidatePath("/contracts");
  revalidatePath(`/contracts/${values.id}`);
}

export async function deleteContract(formData: FormData) {
  const id = Number(formData.get("id"));
  await db.delete(contracts).where(eq(contracts.id, id));
  revalidatePath("/contracts");
}
