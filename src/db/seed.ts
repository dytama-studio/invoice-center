import 'dotenv/config';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { nanoid } from 'nanoid';

import {
  companies,
  commodities,
  qualitySpecs,
  regions,
  user,
  account,
} from '@/db/schema';
import { hashPassword } from 'better-auth/crypto';

async function seed() {
  console.log('🌱 Seeding master data...');

  // =========================
  // REGIONS
  // =========================
  const regionRows = await db
    .insert(regions)
    .values([
      { code: 'SUM', name: 'Sumatra' },
      { code: 'KAL', name: 'Kalimantan' },
    ])
    .onConflictDoNothing()
    .returning();

  const resolvedRegions =
    regionRows.length > 0 ? regionRows : await db.select().from(regions);

  // =========================
  // COMMODITIES
  // =========================
  const commodityRows = await db
    .insert(commodities)
    .values([
      { code: 'CPO', name: 'Crude Palm Oil', uom: 'MT' },
      { code: 'PK', name: 'Palm Kernel', uom: 'MT' },
      { code: 'TBS', name: 'Fresh Fruit Bunch', uom: 'KG' },
      { code: 'SVC', name: 'Service', uom: 'LOT' },
    ])
    .onConflictDoNothing()
    .returning();

  const resolvedCommodities =
    commodityRows.length > 0
      ? commodityRows
      : await db.select().from(commodities);

  // =========================
  // COMPANIES (MASTER ONLY)
  // =========================
  await db
    .insert(companies)
    .values([
      {
        name: 'PT Agrinas Trading',
        type: 'mitra',
        regionId: resolvedRegions[0]?.id,
        taxId: '01.234.567.8-901.000',
        email: 'finance@agrinas.co.id',
      },
      {
        name: 'PT Nusantara Buyers',
        type: 'buyer',
        regionId: resolvedRegions[0]?.id,
        email: 'ap@nusantara.co.id',
      },
      {
        name: 'PT Logistics Vendor',
        type: 'vendor',
        regionId: resolvedRegions[1]?.id,
        email: 'billing@logistics.co.id',
      },
    ])
    .onConflictDoNothing();

  // =========================
  // QUALITY SPECS
  // =========================
  await db
    .insert(qualitySpecs)
    .values([
      {
        commodityId: resolvedCommodities[0]?.id,
        name: 'FFA < 3%',
        description: 'Standard CPO quality',
      },
      {
        commodityId: resolvedCommodities[1]?.id,
        name: 'Moisture < 7%',
        description: 'Kernel standard',
      },
    ])
    .onConflictDoNothing();

  // =================================================
  // AUTH USER
  // =================================================
  const userId = nanoid();

  const hashedPassword = await hashPassword('admin480');

  await db.insert(user).values({
    id: userId,
    name: 'Admin Agrinas',
    email: 'admin@gmail.com',
    emailVerified: true,
  });

  console.log('🎉 Master seed completed');

  await db.insert(account).values({
    id: nanoid(),
    userId,
    accountId: userId,
    providerId: 'credential',
    password: hashedPassword,
  });

  console.log('✅ Account credentials created');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  });
