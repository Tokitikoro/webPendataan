import { NextResponse } from "next/server";

import type {
    NextRequest,
} from "next/server";

import {
    SESSION_COOKIE_NAME,
    verifySessionToken,
} from "@/lib/auth";

export async function proxy(
    request: NextRequest,
) {
    const pathname =
        request.nextUrl.pathname;

    const isLoginPage =
        pathname === "/login";

    const token = request.cookies.get(
        SESSION_COOKIE_NAME,
    )?.value;

    const session =
        await verifySessionToken(token);

    if (!session && !isLoginPage) {
        const loginUrl =
            new URL("/login", request.url);

        return NextResponse.redirect(loginUrl);
    }

    if (session && isLoginPage) {
        const dashboardUrl =
            new URL("/", request.url);

        return NextResponse.redirect(
            dashboardUrl,
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};