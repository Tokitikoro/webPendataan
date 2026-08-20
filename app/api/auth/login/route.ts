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