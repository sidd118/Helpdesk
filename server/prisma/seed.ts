import { randomUUID } from "node:crypto";
import { auth } from "../src/auth";
import { prisma } from "../src/db";
import { Role } from "../src/generated/prisma/enums";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  // emailAndPassword.disableSignUp blocks the public sign-up endpoint, so the
  // admin account is created directly via Prisma, reusing Better Auth's own
  // password hashing so it verifies correctly against sign-in later.
  const authContext = await auth.$context;
  const hashedPassword = await authContext.password.hash(password);
  const userId = randomUUID();

  await prisma.user.create({
    data: {
      id: userId,
      name: "Admin",
      email,
      emailVerified: true,
      role: Role.ADMIN,
      accounts: {
        create: {
          id: randomUUID(),
          accountId: userId,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  console.log(`Created admin user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
