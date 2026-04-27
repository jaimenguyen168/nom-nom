import { nomnomDb } from "@/db";
import { userUsage } from "@/db/schemas/usage";
import {
  PLANS,
  DEFAULT_PLAN,
  getPlan,
} from "@/features/billing/constants/plans";
import { and, eq, sql, desc } from "drizzle-orm";
import { startOfMonth } from "date-fns";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

// ---------------------------------------------------------------------------
// Plan resolution
// ---------------------------------------------------------------------------

type HasFn = (params: { plan: string }) => boolean;

export function getPlanIdFromHas(has: HasFn) {
  const paidPlans = [...PLANS].filter((p) => p.clerkPlanSlug).reverse();
  for (const plan of paidPlans) {
    if (has({ plan: plan.clerkPlanSlug! })) return plan.id;
  }
  return DEFAULT_PLAN;
}

// ---------------------------------------------------------------------------
// Usage read — one row per user per calendar month
// ---------------------------------------------------------------------------

/**
 * Returns (or creates) the usage row for the current calendar month.
 *
 * Each month gets its own row — old rows are never modified, giving a
 * full history of usage per period. The current period is identified by
 *   userId + periodStart = startOfMonth(today)
 */
export async function getOrCreateUsage(userId: string) {
  const currentMonthStart = startOfMonth(new Date());

  const existing = await nomnomDb
    .select()
    .from(userUsage)
    .where(
      and(
        eq(userUsage.userId, userId),
        eq(userUsage.periodStart, currentMonthStart),
      ),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  // New month — insert a fresh row
  const [created] = await nomnomDb
    .insert(userUsage)
    .values({
      id: nanoid(),
      userId,
      periodStart: currentMonthStart,
      aiRecipesUsed: 0,
      aiBlogsUsed: 0,
    })
    .onConflictDoNothing() // guard against race conditions
    .returning();

  // onConflictDoNothing returns nothing if a concurrent insert won — re-fetch
  if (!created) {
    const [row] = await nomnomDb
      .select()
      .from(userUsage)
      .where(
        and(
          eq(userUsage.userId, userId),
          eq(userUsage.periodStart, currentMonthStart),
        ),
      )
      .limit(1);
    return row;
  }

  return created;
}

/**
 * Returns all usage rows for a user, newest first.
 * Useful for showing billing history.
 */
export async function getUsageHistory(userId: string) {
  return nomnomDb
    .select()
    .from(userUsage)
    .where(eq(userUsage.userId, userId))
    .orderBy(desc(userUsage.periodStart));
}

// ---------------------------------------------------------------------------
// Limit enforcement
// ---------------------------------------------------------------------------

export async function assertRecipeLimit(userId: string, has: HasFn) {
  const planId = getPlanIdFromHas(has);
  const plan = getPlan(planId);
  const limit = plan.limits.aiRecipesPerMonth;

  if (limit === null) return; // unlimited

  const usage = await getOrCreateUsage(userId);

  if (usage.aiRecipesUsed >= limit) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You've used all ${limit} recipe inspiration${limit === 1 ? "" : "s"} for this month. Upgrade your plan to continue.`,
    });
  }
}

export async function assertBlogLimit(userId: string, has: HasFn) {
  const planId = getPlanIdFromHas(has);
  const plan = getPlan(planId);
  const limit = plan.limits.aiBlogsPerMonth;

  if (limit === null) return; // unlimited

  const usage = await getOrCreateUsage(userId);

  if (usage.aiBlogsUsed >= limit) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You've used all ${limit} blog inspiration${limit === 1 ? "" : "s"} for this month. Upgrade your plan to continue.`,
    });
  }
}

// ---------------------------------------------------------------------------
// Usage increment — always targets the current month's row
// ---------------------------------------------------------------------------

export async function incrementRecipeUsage(userId: string) {
  const currentMonthStart = startOfMonth(new Date());
  await nomnomDb
    .update(userUsage)
    .set({ aiRecipesUsed: sql`${userUsage.aiRecipesUsed} + 1` })
    .where(
      and(
        eq(userUsage.userId, userId),
        eq(userUsage.periodStart, currentMonthStart),
      ),
    );
}

export async function incrementBlogUsage(userId: string) {
  const currentMonthStart = startOfMonth(new Date());
  await nomnomDb
    .update(userUsage)
    .set({ aiBlogsUsed: sql`${userUsage.aiBlogsUsed} + 1` })
    .where(
      and(
        eq(userUsage.userId, userId),
        eq(userUsage.periodStart, currentMonthStart),
      ),
    );
}

// ---------------------------------------------------------------------------
// Hard reset — called from Clerk webhook on subscription.created
// Ensures a clean row exists for the current month
// ---------------------------------------------------------------------------

export async function resetUsage(userId: string) {
  const currentMonthStart = startOfMonth(new Date());

  // Upsert: zero out if a row already exists this month, otherwise insert
  await nomnomDb
    .insert(userUsage)
    .values({
      id: nanoid(),
      userId,
      periodStart: currentMonthStart,
      aiRecipesUsed: 0,
      aiBlogsUsed: 0,
    })
    .onConflictDoUpdate({
      target: [userUsage.userId, userUsage.periodStart],
      set: {
        aiRecipesUsed: 0,
        aiBlogsUsed: 0,
      },
    });
}
