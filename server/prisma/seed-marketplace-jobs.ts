import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { buildMarketplaceJobTemplates } from './marketplace-jobs.data';
import { MARKETPLACE_DEMO_CLIENTS } from './marketplace-demo-clients.data';

/** Stable IDs so re-seed replaces the same demo rows. */
export const MARKETPLACE_JOB_ID_PREFIX = 'seed-downwork-';

const DEMO_PASSWORD_PLAINTEXT = 'password123';

export type MarketplaceDemoClientRow = { id: string; email: string };

/**
 * Creates or updates demo client users + ClientProfile (same pattern as prisma/seed.ts).
 * These accounts own all `seed-downwork-*` jobs only.
 */
export async function ensureMarketplaceDemoClients(
  prisma: PrismaClient,
): Promise<MarketplaceDemoClientRow[]> {
  const password = await bcrypt.hash(DEMO_PASSWORD_PLAINTEXT, 12);
  const rows: MarketplaceDemoClientRow[] = [];

  for (let i = 0; i < MARKETPLACE_DEMO_CLIENTS.length; i++) {
    const d = MARKETPLACE_DEMO_CLIENTS[i];
    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: {
        username: d.username,
        password,
        firstName: d.firstName,
        lastName: d.lastName,
        location: d.location,
        role: 'client',
        isEmailVerified: true,
        status: 'active',
        deletedAt: null,
      },
      create: {
        email: d.email,
        username: d.username,
        password,
        firstName: d.firstName,
        lastName: d.lastName,
        role: 'client',
        isEmailVerified: true,
        status: 'active',
        location: d.location,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${d.firstName}+${d.lastName}`)}&background=0d9488&color=fff`,
      },
    });

    await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {
        companyName: d.companyName,
        industry: d.industry,
        paymentVerified: true,
      },
      create: {
        userId: user.id,
        companyName: d.companyName,
        companySize: '10-50',
        industry: d.industry,
        description: 'Demo hiring company — seeded marketplace job postings.',
        totalSpent: 0,
        totalJobsPosted: 0,
        hireRate: 72 + (i % 5),
        rating: 4.5 + (i % 4) * 0.1,
        reviewCount: 3 + (i % 8),
        paymentVerified: true,
      },
    });

    rows.push({ id: user.id, email: d.email });
  }

  console.log(
    `Marketplace demo clients: ensured ${rows.length} client account(s) (password: ${DEMO_PASSWORD_PLAINTEXT}).`,
  );
  return rows;
}

async function syncClientJobCounts(prisma: PrismaClient, clientIds: string[]): Promise<void> {
  for (const userId of clientIds) {
    const totalJobsPosted = await prisma.job.count({ where: { clientId: userId } });
    await prisma.clientProfile.updateMany({
      where: { userId },
      data: { totalJobsPosted },
    });
  }
}

/**
 * Ensures demo client users exist, then inserts ~130 marketplace open jobs owned by them.
 * Removes prior marketplace demo jobs (`seed-downwork-*`, legacy `seed-upwork-*`) first.
 */
export async function seedMarketplaceJobs(prisma: PrismaClient): Promise<number> {
  const demoClients = await ensureMarketplaceDemoClients(prisma);
  const clientIds = demoClients.map((c) => c.id);

  const removed = await prisma.job.deleteMany({
    where: {
      OR: [
        { id: { startsWith: MARKETPLACE_JOB_ID_PREFIX } },
        { id: { startsWith: 'seed-upwork-' } },
      ],
    },
  });
  if (removed.count > 0) {
    console.log(`Marketplace jobs: removed ${removed.count} previous demo job(s).`);
  }

  const templates = buildMarketplaceJobTemplates();
  const now = Date.now();

  const rows = templates.map((row, idx) => ({
    id: `${MARKETPLACE_JOB_ID_PREFIX}${String(idx).padStart(4, '0')}`,
    clientId: clientIds[idx % clientIds.length],
    createdAt: new Date(now - idx * 39 * 60 * 1000),
    updatedAt: new Date(now - idx * 39 * 60 * 1000),
    status: 'open' as const,
    visibility: 'public' as const,
    title: row.title,
    description: row.description,
    category: row.category,
    subcategory: row.subcategory ?? null,
    skills: row.skills,
    budgetType: row.budgetType,
    budgetMin: row.budgetType === 'hourly' ? row.budgetMin : null,
    budgetMax: row.budgetType === 'hourly' ? row.budgetMax : null,
    budgetFixed: row.budgetType === 'fixed' ? row.budgetFixed : null,
    duration: row.duration,
    experienceLevel: row.experienceLevel,
    proposalCount: row.proposalCount,
    viewCount: row.viewCount,
  }));

  const result = await prisma.job.createMany({ data: rows });
  console.log(`Marketplace jobs: inserted ${result.count} open listings.`);

  await syncClientJobCounts(prisma, clientIds);
  console.log('Marketplace jobs: synced ClientProfile.totalJobsPosted for demo clients.');

  return result.count;
}

async function cli(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await seedMarketplaceJobs(prisma);
    console.log('');
    console.log('Log in as any marketplace demo client (see emails above) with password:', DEMO_PASSWORD_PLAINTEXT);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void cli();
}
