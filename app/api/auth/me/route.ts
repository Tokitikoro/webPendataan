import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    SESSION_COOKIE_NAME,
    verifySessionToken,
} from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
) {
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

    const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
    );

    const databaseUser =
        await prisma.user.findUnique({
            where: {
                username: session.username,
            },
            select: {
                lastLoginAt: true,
                loginHistories: {
                    where: {
                        loggedInAt: {
                            gte: twentyFourHoursAgo,
                        },
                    },
                    orderBy: {
                        loggedInAt: "desc",
                    },
                    take: 10,
                    select: {
                        id: true,
                        loggedInAt: true,
                        ipAddress: true,
                        userAgent: true,
                    },
                },
            },
        });

    if (!databaseUser) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Pengguna tidak ditemukan",
            },
            {
                status: 404,
            },
        );
    }

    return NextResponse.json({
        success: true,
        user: {
            username: session.username,
            displayName:
                session.displayName,
            role: session.role,
            lastLoginAt:
                databaseUser.lastLoginAt?.toISOString() ??
                null,
            loginHistories:
                databaseUser.loginHistories.map(
                    (history) => ({
                        id: history.id,
                        loggedInAt:
                            history.loggedInAt.toISOString(),
                        ipAddress:
                            history.ipAddress,
                        userAgent:
                            history.userAgent,
                    }),
                ),
        },
    });
}