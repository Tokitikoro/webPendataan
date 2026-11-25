import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken, } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import {
  createPasswordHash,
  verifyPasswordHash,
} from "@/lib/users";
 
type PinPayload = {
  oldPin?: string;
  newPin?: string;
};

export async function POST(request: NextRequest) { try { const token = request.cookies.get(SESSION_COOKIE_NAME)?.value; const session = await verifySessionToken(token);

if (!session) {
  return NextResponse.json(
    { success: false, message: "Sesi tidak valid atau telah berakhir" },
    { status: 401 },
  );
}

const body = (await request.json()) as PinPayload;
const oldPin = body.oldPin?.trim() ?? "";
const newPin = body.newPin?.trim() ?? "";

if (!/^\d{4}$/.test(newPin)) {
  return NextResponse.json(
    { success: false, message: "PIN harus terdiri dari tepat 4 angka" },
    { status: 400 },
  );
}

const user = await prisma.user.findUnique({
  where: {
    id: session.id,
  },
  select: {
    historyPinHash: true,
  },
});

if (user?.historyPinHash) {
    const pinValid = await verifyPasswordHash(
    oldPin,
    user.historyPinHash,
  );

    if (!pinValid) {
    return NextResponse.json(
      {
        success: false,
        message: "PIN lama tidak sesuai",
      },
      {
        status: 401,
      },
    );
  }
}

const historyPinHash = await createPasswordHash(newPin);

await prisma.user.update({
  where: {
    id: session.id,
  },
  data: {
    historyPinHash,
  },
});

return NextResponse.json({
  success: true,
  message: "PIN riwayat berhasil disimpan",
});


} catch (error) { console.error("Gagal menyimpan PIN riwayat:", error);

return NextResponse.json(
  { success: false, message: "Gagal menyimpan PIN riwayat" },
  { status: 500 },
);


} }