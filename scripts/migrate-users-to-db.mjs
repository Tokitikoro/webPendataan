import nextEnv from "@next/env";
 const { loadEnvConfig } = nextEnv;
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  const rawUsers = process.env.APP_USERS_JSON;

  if (!rawUsers) {
    throw new Error(
      "APP_USERS_JSON tidak ditemukan di .env.local",
    );
  }

  const users = JSON.parse(rawUsers);

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        username: String(user.username)
          .trim()
          .toLowerCase(),
      },
      update: {
        displayName:
          user.displayName || user.username,
        role: String(
          user.role || "operator",
        ).toLowerCase(),
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt || user.salt || String(user.passwordHash).split(":")[2],
        active: user.active !== false,
      },
      create: {
        username: String(user.username)
          .trim()
          .toLowerCase(),
        displayName:
          user.displayName || user.username,
        role: String(
          user.role || "operator",
        ).toLowerCase(),
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt || user.salt || String(user.passwordHash).split(":")[2],
        active: user.active !== false,
      },
    });

    console.log(
      `Akun ${user.username} berhasil dipindahkan`,
    );
  }
}

main()
  .catch((error) => {
    console.error("Migrasi pengguna gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });