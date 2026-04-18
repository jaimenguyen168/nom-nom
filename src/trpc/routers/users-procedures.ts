import { authProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { nomnomDb } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schemas/users";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getCurrentUser: authProcedure.query(async ({ ctx }) => {
    const user = await nomnomDb
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .then((rows) => rows[0]);

    if (!user)
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    return user;
  }),

  updateProfile: authProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().optional(),
        username: z.string().min(3).optional(),
        bio: z.string().optional(),
        profileImageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await nomnomDb
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.userId));

      return { success: true };
    }),
});
