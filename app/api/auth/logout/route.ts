import { NextResponse } from "next/server";

import {
    SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: "Berhasil keluar",
    });

    response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure:
            process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
        maxAge: 0,
    });

    return response;
}