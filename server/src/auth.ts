import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") ?? [],
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "AGENT"],
        input: false,
        defaultValue: "AGENT",
      },
    },
  },
});
