import { PrismaClient } from "@prisma/client";

const onlineUrl = process.env.DATABASE_URL;

if (!onlineUrl) {
  throw new Error(
    "DATABASE_URL TiDB Cloud tidak tersedia di terminal",
  );
}

const localUrl =
  "mysql://root:@localhost:3306/simiaqua";

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: localUrl,
    },
  },
});

const onlinePrisma = new PrismaClient({
  datasources: {
    db: {
      url: onlineUrl,
    },
  },
});

async function main() {
  const users = await localPrisma.user.findMany();

  if (users.length === 0) {
    throw new Error(
      "Tidak ada pengguna di MySQL XAMPP",
    );
  }

  for (const user of users) {
    await onlinePrisma.user.upsert({
      where: {
        username: user.username,
      },
      update: {
        displayName: user.displayName,
        role: user.role,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        active: user.active,
        sessionVersion: user.sessionVersion,
        lastLoginAt: user.lastLoginAt,
      },
      create: {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        active: user.active,
        sessionVersion: user.sessionVersion,
        lastLoginAt: user.lastLoginAt,
      },
    });

    console.log(
      `Akun ${user.username} berhasil disalin ke TiDB Cloud`,
    );
    const onlineUser = await onlinePrisma.user.findUnique({

where: {

username: user.username,

},

});

console.log(

user.username,

onlineUser?.passwordHash === user.passwordHash &&

onlineUser?.passwordSalt === user.passwordSalt

? "SAMA"

: "BERBEDA",

);
  }

  console.log(
    `${users.length} akun berhasil dipindahkan`,
  );
}

main()
  .catch((error) => {
    console.error(
      "Penyalinan pengguna gagal:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await localPrisma.$disconnect();
    await onlinePrisma.$disconnect();
  });