import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken, } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

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