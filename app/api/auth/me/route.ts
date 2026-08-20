import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    SESSION_COOKIE_NAME,
    verifySessionToken,
} from "@/lib/auth";

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

    return NextResponse.json({
        success: true,
        user: {
            username: session.username,
            displayName:
                session.displayName,
            role: session.role,
        },
    });
}