import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";
import {
  mkdir,
  writeFile,
  appendFile,
} from "node:fs/promises";
import path from "node:path";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const localUrl = process.env.DATABASE_URL;
const onlineUrl = process.env.TIDB_DATABASE_URL;

if (!localUrl) {
  throw new Error(
    "DATABASE_URL lokal tidak ditemukan di .env.local",
  );
}

if (!onlineUrl) {
  throw new Error(
    "TIDB_DATABASE_URL tidak ditemukan di .env.local",
  );
}

if (localUrl === onlineUrl) {
  throw new Error(
    "DATABASE_URL lokal dan TIDB_DATABASE_URL tidak boleh sama",
  );
}

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

const backupDirectory = path.join(
  process.cwd(),
  "database-backups",
);

const logFile = path.join(
  backupDirectory,
  "sync-online-to-local.log",
);

function createTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
}

async function writeLog(message) {
  const line =
    `[${new Date().toISOString()}] ${message}\n`;

  console.log(message);

  await appendFile(
    logFile,
    line,
    "utf8",
  );
}

async function main() {
  await mkdir(backupDirectory, {
    recursive: true,
  });

  await writeLog(
    "Memulai sinkronisasi TiDB Cloud ke MySQL XAMPP",
  );

  const onlineUsers =
    await onlinePrisma.user.findMany({
      orderBy: {
        username: "asc",
      },
    });

  /*
   * Pengaman agar gangguan koneksi atau database
   * online kosong tidak menghapus seluruh akun lokal.
   */
  if (onlineUsers.length === 0) {
    throw new Error(
      "TiDB Cloud tidak memiliki akun. Sinkronisasi dibatalkan agar data lokal tidak terhapus.",
    );
  }

  const localUsers =
    await localPrisma.user.findMany({
      orderBy: {
        username: "asc",
      },
    });

  /*
   * Membuat snapshot data lokal sebelum perubahan.
   * File backup berisi hash, bukan password asli.
   */
  const snapshotFile = path.join(
    backupDirectory,
    `users-${createTimestamp()}.json`,
  );

  await writeFile(
    snapshotFile,
    JSON.stringify(localUsers, null, 2),
    "utf8",
  );

  await writeLog(
    `Snapshot lokal dibuat: ${path.basename(snapshotFile)}`,
  );

  const onlineUsernames = onlineUsers.map(
    (user) => user.username,
  );

  /*
   * Semua perubahan lokal dilakukan dalam transaksi.
   * Jika salah satu proses gagal, perubahan dibatalkan.
   */
  await localPrisma.$transaction(
    async (transaction) => {
      for (const user of onlineUsers) {
        await transaction.user.upsert({
          where: {
            username: user.username,
          },
          update: {
            displayName: user.displayName,
            role: user.role,
            passwordHash: user.passwordHash,
            passwordSalt: user.passwordSalt,
            active: user.active,
            sessionVersion:
              user.sessionVersion,
            lastLoginAt: user.lastLoginAt,
          },
          create: {
            username: user.username,
            displayName: user.displayName,
            role: user.role,
            passwordHash: user.passwordHash,
            passwordSalt: user.passwordSalt,
            active: user.active,
            sessionVersion:
              user.sessionVersion,
            lastLoginAt: user.lastLoginAt,
          },
        });
      }

      /*
       * Menghapus akun lokal yang sudah tidak ada
       * lagi pada TiDB Cloud.
       */
      await transaction.user.deleteMany({
        where: {
          username: {
            notIn: onlineUsernames,
          },
        },
      });
    },
  );

  const updatedLocalUsers =
    await localPrisma.user.findMany({
      orderBy: {
        username: "asc",
      },
    });

  await writeLog(
    `${onlineUsers.length} akun dari TiDB berhasil disinkronkan`,
  );

  await writeLog(
    `Jumlah akun lokal sekarang: ${updatedLocalUsers.length}`,
  );

  await writeLog(
    "Sinkronisasi selesai tanpa menampilkan password maupun hash",
  );
}

main()
  .catch(async (error) => {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      "Sinkronisasi gagal:",
      message,
    );

    try {
      await mkdir(backupDirectory, {
        recursive: true,
      });

      await appendFile(
        logFile,
        `[${new Date().toISOString()}] GAGAL: ${message}\n`,
        "utf8",
      );
    } catch {
      // Abaikan jika log gagal ditulis.
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await localPrisma.$disconnect();
    await onlinePrisma.$disconnect();
  });