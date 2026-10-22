import { prisma } from "@/lib/prisma";

import type {
    SessionUser,
    UserRole,
} from "@/lib/auth";

type StoredUser = SessionUser & {
    passwordHash: string;
};

function isUserRole(
    value: unknown,
): value is UserRole {
    return (
        value === "admin" ||
        value === "operator" ||
        value === "viewer"
    );
}

function decodeHex(value: string) {
    if (
        value.length === 0 ||
        value.length % 2 !== 0 ||
        !/^[0-9a-f]+$/i.test(value)
    ) {
        return null;
    }

    const bytes = new Uint8Array(
        value.length / 2,
    );

    for (
        let index = 0;
        index < value.length;
        index += 2
    ) {
        bytes[index / 2] =
            Number.parseInt(
                value.slice(index, index + 2),
                16,
            );
    }

    return bytes;
}

function constantTimeEqual(
    left: Uint8Array,
    right: Uint8Array,
) {
    if (left.length !== right.length) {
        return false;
    }

    let difference = 0;

    for (
        let index = 0;
        index < left.length;
        index += 1
    ) {
        difference |=
            left[index] ^ right[index];
    }

    return difference === 0;
}

async function verifyPasswordHash(
    password: string,
    storedHash: string,
) {
    const [
        algorithm,
        iterationText,
        saltHex,
        expectedHashHex,
    ] = storedHash.split(":");

    if (algorithm !== "pbkdf2-sha256") {
        return false;
    }

    const iterations =
        Number(iterationText);

    if (
        !Number.isInteger(iterations) ||
        iterations < 100_000
    ) {
        return false;
    }

    const salt =
        decodeHex(saltHex);

    const expectedHash =
        decodeHex(expectedHashHex);

    if (!salt || !expectedHash) {
        return false;
    }

    const passwordKey =
        await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            "PBKDF2",
            false,
            ["deriveBits"],
        );

    const derivedBits =
        await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                hash: "SHA-256",
                salt,
                iterations,
            },
            passwordKey,
            expectedHash.length * 8,
        );

    return constantTimeEqual(
        new Uint8Array(derivedBits),
        expectedHash,
    );
}

export async function authenticateUser(
    username: string,
    password: string,
): Promise<SessionUser | null> {
    const normalizedUsername =
        username.trim().toLowerCase();

   const user = await prisma.user.findUnique({ where: { username: normalizedUsername, }, });

    if (!user || !user.active || !isUserRole(user.role)) { return null; }

    const passwordValid =
        await verifyPasswordHash(
            password,
            user.passwordHash,
        );

    if (!passwordValid) {
        return null;
    }

    await prisma.user.update({
  where: {
    id: user.id,
  },
  data: {
    lastLoginAt: new Date(),
  },
});

    return {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
    };
}