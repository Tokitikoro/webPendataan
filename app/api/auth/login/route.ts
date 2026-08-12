import { NextResponse } from "next/server";

import {
    createSessionToken,
    SESSION_COOKIE_NAME,
    sessionCookieOptions,
} from "@/lib/auth";

type LoginPayload = {
    username?: string;
    password?: string;
};

export async function POST(request: Request) {
    try {
        const body =
            (await request.json()) as LoginPayload;

        const username =
            body.username?.trim() ?? "";

        const password =
            body.password ?? "";

        const adminUsername =
            process.env.ADMIN_USERNAME?.trim();

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        if (
            !adminUsername ||
            !adminPassword ||
            !process.env.AUTH_SECRET
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Konfigurasi login belum lengkap",
                },
                {
                    status: 500,
                },
            );
        }

        if (
            username !== adminUsername ||
            password !== adminPassword
        ) {
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
            await createSessionToken(username);

        const response = NextResponse.json({
            success: true,
            message: "Login berhasil",
        });

        response.cookies.set(
            SESSION_COOKIE_NAME,
            token,
            sessionCookieOptions,
        );

        return response;
    } catch {
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