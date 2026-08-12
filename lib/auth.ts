export const SESSION_COOKIE_NAME =
    "simi-session";

const SESSION_DURATION_SECONDS =
    60 * 60 * 8;

type SessionPayload = {
    username: string;
    role: "admin";
    expiresAt: number;
};

function encodeBase64Url(value: string) {
    const bytes = new TextEncoder().encode(value);

    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
    const normalized = value
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const padded =
        normalized +
        "=".repeat(
            (4 - (normalized.length % 4)) % 4,
        );

    const binary = atob(padded);
    const bytes = Uint8Array.from(
        binary,
        (character) => character.charCodeAt(0),
    );

    return new TextDecoder().decode(bytes);
}

async function getSigningKey() {
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
        throw new Error(
            "AUTH_SECRET belum dikonfigurasi",
        );
    }

    return crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        false,
        ["sign", "verify"],
    );
}

export async function createSessionToken(
    username: string,
) {
    const payload: SessionPayload = {
        username,
        role: "admin",
        expiresAt:
            Math.floor(Date.now() / 1000) +
            SESSION_DURATION_SECONDS,
    };

    const encodedPayload = encodeBase64Url(
        JSON.stringify(payload),
    );

    const key = await getSigningKey();

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(encodedPayload),
    );

    const signatureText = Array.from(
        new Uint8Array(signature),
    )
        .map((byte) =>
            byte.toString(16).padStart(2, "0"),
        )
        .join("");

    return `${encodedPayload}.${signatureText}`;
}

export async function verifySessionToken(
    token: string | undefined,
): Promise<SessionPayload | null> {
    if (!token) {
        return null;
    }

    const [encodedPayload, signatureText] =
        token.split(".");

    if (!encodedPayload || !signatureText) {
        return null;
    }

    try {
        const key = await getSigningKey();

        const signatureBytes = new Uint8Array(
            signatureText
                .match(/.{1,2}/g)
                ?.map((hex) => parseInt(hex, 16)) ??
            [],
        );

        const signatureValid =
            await crypto.subtle.verify(
                "HMAC",
                key,
                signatureBytes,
                new TextEncoder().encode(encodedPayload),
            );

        if (!signatureValid) {
            return null;
        }

        const payload = JSON.parse(
            decodeBase64Url(encodedPayload),
        ) as SessionPayload;

        if (
            !payload.username ||
            payload.role !== "admin" ||
            payload.expiresAt <=
            Math.floor(Date.now() / 1000)
        ) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
};