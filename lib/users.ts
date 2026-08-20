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

function loadUsers() {
    const rawUsers =
        process.env.APP_USERS_JSON;

    if (!rawUsers) {
        throw new Error(
            "APP_USERS_JSON belum dikonfigurasi",
        );
    }

    const parsedUsers =
        JSON.parse(rawUsers) as unknown;

    if (!Array.isArray(parsedUsers)) {
        throw new Error(
            "Format APP_USERS_JSON tidak valid",
        );
    }

    const users: StoredUser[] = [];

    for (const item of parsedUsers) {
        if (
            typeof item !== "object" ||
            item === null
        ) {
            continue;
        }

        const candidate =
            item as Record<string, unknown>;

        if (
            typeof candidate.username !==
            "string" ||
            candidate.username.trim() === "" ||
            typeof candidate.displayName !==
            "string" ||
            candidate.displayName.trim() === "" ||
            typeof candidate.passwordHash !==
            "string" ||
            candidate.passwordHash.trim() === "" ||
            !isUserRole(candidate.role)
        ) {
            continue;
        }

        users.push({
            username:
                candidate.username
                    .trim()
                    .toLowerCase(),
            displayName:
                candidate.displayName.trim(),
            passwordHash:
                candidate.passwordHash.trim(),
            role: candidate.role,
        });
    }

    if (users.length === 0) {
        throw new Error(
            "Tidak ada akun yang valid pada APP_USERS_JSON",
        );
    }

    return users;
}

export async function authenticateUser(
    username: string,
    password: string,
): Promise<SessionUser | null> {
    const normalizedUsername =
        username.trim().toLowerCase();

    const users = loadUsers();

    const user = users.find(
        (item) =>
            item.username ===
            normalizedUsername,
    );

    if (!user) {
        return null;
    }

    const passwordValid =
        await verifyPasswordHash(
            password,
            user.passwordHash,
        );

    if (!passwordValid) {
        return null;
    }

    return {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
    };
}