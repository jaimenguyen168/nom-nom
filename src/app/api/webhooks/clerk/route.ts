import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { nomnomDb } from "@/db";
import { users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type: eventType, data } = evt;

  if (eventType === "user.created") {
    await nomnomDb.insert(users).values({
      id: data.id,
      email: data.email_addresses[0]?.email_address ?? "",
      username:
        data.username ??
        data.email_addresses[0]?.email_address.split("@")[0] ??
        data.id,
      profileImageUrl: data.image_url,
      firstName: data.first_name,
      lastName: data.last_name,
    });
  }

  if (eventType === "user.updated") {
    await nomnomDb
      .update(users)
      .set({
        email: data.email_addresses[0]?.email_address ?? "",
        username:
          data.username ??
          data.email_addresses[0]?.email_address.split("@")[0] ??
          data.id,
        profileImageUrl: data.image_url,
        firstName: data.first_name,
        lastName: data.last_name,
      })
      .where(eq(users.id, data.id));
  }

  if (eventType === "user.deleted") {
    if (data.id) {
      await nomnomDb.delete(users).where(eq(users.id, data.id));
    }
  }

  return new Response("OK", { status: 200 });
}
