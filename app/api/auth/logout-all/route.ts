import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
) {
  try {
    const token =
      request.cookies.get(
        SESSION_COOKIE_NAME,
      )?.value;

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

    const user =
      await prisma.user.findUnique({
        where: {
          username:
            session.username
              .trim()
              .toLowerCase(),
        },
        select: {
          id: true,
          active: true,
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

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionVersion: {
          increment: 1,
        },
      },
    });

    const response = NextResponse.json({
      success: true,
      message:
        "Semua perangkat berhasil dikeluarkan",
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
  } catch (error) {
    console.error(
      "Gagal mengeluarkan semua perangkat:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan saat mengeluarkan semua perangkat",
      },
      {
        status: 500,
      },
    );
  }
}