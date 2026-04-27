import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "nom-nom",
  isDev: process.env.INNGEST_DEV === "1",
});
