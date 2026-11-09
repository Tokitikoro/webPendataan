import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth";

import {
  authenticateUser,
} from "@/lib/users";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(
  request: Request,
) {
  try {
    if (!process.env.AUTH_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Konfigurasi autentikasi belum lengkap",
        },
        {
          status: 500,
        },
      );
    }

    const body =
      (await request.json()) as LoginPayload;

    const username =
      body.username?.trim() ?? "";

    const password =
      body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username dan password wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    const user =
      await authenticateUser(
        username,
        password,
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    const loginTime = new Date();

    const expirationTime = new Date(
      loginTime.getTime() -
        24 * 60 * 60 * 1000,
    );

    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor
        ?.split(",")[0]
        ?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    const userAgent =
      request.headers.get("user-agent");

    await prisma.loginHistory.deleteMany({
      where: {
        userId: user.id,
        loggedInAt: {
          lt: expirationTime,
        },
      },
    });

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        loggedInAt: loginTime,
        ipAddress,
        userAgent,
      },
    });

    const token =
      await createSessionToken(user);

    const response =
      NextResponse.json({
        success: true,
        message: "Login berhasil",
        user,
      });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      sessionCookieOptions,
    );

    return response;
  } catch (error) {
    console.error(
      "Gagal memproses login:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan saat login",
      },
      {
        status: 500,
      },
    );
  }
}