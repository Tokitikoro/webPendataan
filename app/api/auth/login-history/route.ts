import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken, } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function GET( request: NextRequest, ) { try { const token = request.cookies.get( SESSION_COOKIE_NAME, )?.value;

const user = await verifySessionToken(token);

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "Sesi tidak valid",
    },
    {
      status: 401,
    },
  );
}

const expirationTime = new Date(
  Date.now() - 24 * 60 * 60 * 1000,
);

await prisma.loginHistory.deleteMany({
  where: {
    userId: user.id,
    loggedInAt: {
      lt: expirationTime,
    },
  },
});

const histories = await prisma.loginHistory.findMany({
  where: {
    userId: user.id,
    loggedInAt: {
      gte: expirationTime,
    },
  },
  orderBy: {
    loggedInAt: "desc",
  },
  
  select: {
    id: true,
    loggedInAt: true,
    ipAddress: true,
    userAgent: true,
  },
});

return NextResponse.json({
  success: true,
  histories,
});


} catch (error) { console.error( "Gagal mengambil riwayat login:", error, );

return NextResponse.json(
  {
    success: false,
    message: "Gagal mengambil riwayat login",
  },
  {
    status: 500,
  },
);


} }