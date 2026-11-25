import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken, } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import { verifyPasswordHash } from "@/lib/users";

type ClearHistoryPayload = { pin?: string; };

export async function DELETE( request: NextRequest, ) { try { const token = request.cookies.get( SESSION_COOKIE_NAME, )?.value;

const session = await verifySessionToken(token);

if (!session) {
  return NextResponse.json(
    {
      success: false,
      message: "Sesi tidak valid atau telah berakhir",
    },
    {
      status: 401,
    },
  );
}

      const body = (await request.json()) as ClearHistoryPayload; 
      const pin = body.pin?.trim() ?? "";

      if (!/^\d{4}$/.test(pin)) { return NextResponse.json( { success: false, message: "PIN harus terdiri dari tepat 4 angka", }, { status: 400, }, ); }

const user = await prisma.user.findUnique({ where: { id: session.id, }, select: { historyPinHash: true, }, });

if (!user?.historyPinHash) { return NextResponse.json( { success: false, message: "PIN riwayat belum dibuat", }, { status: 400, }, ); }

const pinValid = await verifyPasswordHash( pin, user.historyPinHash, );

if (!pinValid) { return NextResponse.json( { success: false, message: "PIN tidak sesuai", }, { status: 401, }, ); }

await prisma.loginHistory.deleteMany({
  where: {
    userId: session.id,
  },
});

return NextResponse.json({
  success: true,
  message: "Riwayat sesi berhasil dihapus",
});


} catch (error) { console.error( "Gagal menghapus riwayat sesi:", error, );

return NextResponse.json(
  {
    success: false,
    message: "Gagal menghapus riwayat sesi",
  },
  {
    status: 500,
  },
);


} }