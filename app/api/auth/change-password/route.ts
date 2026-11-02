import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken, } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import { createPasswordHash, verifyPasswordHash, } from "@/lib/users";

type ChangePasswordPayload = { currentPassword?: string; newPassword?: string; confirmPassword?: string; };

export async function POST( request: NextRequest, ) { try { const token = request.cookies.get( SESSION_COOKIE_NAME, )?.value;

    const session =
  await verifySessionToken(token);

if (!session) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Sesi tidak valid atau telah berakhir",
    },
    {
      status: 401,
    },
  );
}

const payload =
  (await request.json()) as ChangePasswordPayload;

const currentPassword =
  String(
    payload.currentPassword || "",
  );

const newPassword =
  String(
    payload.newPassword || "",
  );

const confirmPassword =
  String(
    payload.confirmPassword || "",
  );

if (
  !currentPassword ||
  !newPassword ||
  !confirmPassword
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Semua kolom password wajib diisi",
    },
    {
      status: 400,
    },
  );
}

if (newPassword.length < 8) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Password baru minimal 8 karakter",
    },
    {
      status: 400,
    },
  );
}

if (newPassword !== confirmPassword) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Konfirmasi password baru tidak sama",
    },
    {
      status: 400,
    },
  );
}

if (newPassword === currentPassword) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Password baru tidak boleh sama dengan password lama",
    },
    {
      status: 400,
    },
  );
}

const user =
  await prisma.user.findUnique({
    where: {
      username:
        session.username
          .trim()
          .toLowerCase(),
    },
  });

if (!user || !user.active) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Akun tidak ditemukan atau tidak aktif",
    },
    {
      status: 404,
    },
  );
}

const currentPasswordValid =
  await verifyPasswordHash(
    currentPassword,
    user.passwordHash,
  );

if (!currentPasswordValid) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Password lama tidak benar",
    },
    {
      status: 400,
    },
  );
}

const passwordHash =
  await createPasswordHash(
    newPassword,
  );

const passwordSalt =
  passwordHash.split(":")[2];

if (!passwordSalt) {
  throw new Error(
    "Salt password baru gagal dibuat",
  );
}

await prisma.user.update({
  where: {
    id: user.id,
  },
  data: {
    passwordHash,
    passwordSalt,
    sessionVersion: {
      increment: 1,
    },
  },
});

const response = NextResponse.json({
  success: true,
  message:
    "Password berhasil diubah. Silakan login kembali.",
});

response.cookies.set(
  SESSION_COOKIE_NAME,
  "",
  {
    httpOnly: true,
    sameSite: "lax",
    secure:
      process.env.NODE_ENV ===
      "production",
    path: "/",
    maxAge: 0,
  },
);

return response;


} catch (error) { console.error( "Gagal mengubah password:", error, );

return NextResponse.json(
  {
    success: false,
    message:
      "Terjadi kesalahan saat mengubah password",
  },
  {
    status: 500,
  },
);


} }