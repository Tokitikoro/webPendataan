export const SESSION_COOKIE_NAME =
  "simi-session";

const SESSION_DURATION_SECONDS =
  60 * 60 * 3;

export type UserRole =
  | "admin"
  | "operator"
  | "viewer";

export type SessionPayload = {
  username: string;
  displayName: string;
  role: UserRole;
  expiresAt: number;
};

export type SessionUser = Omit<
  SessionPayload,
  "expiresAt"
>;

function encodeBase64Url(value: string) {
  const bytes =
    new TextEncoder().encode(value);

  let binary = "";

  for (const byte of bytes) {
    binary +=
      String.fromCharCode(byte);
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
    (character) =>
      character.charCodeAt(0),
  );

  return new TextDecoder().decode(bytes);
}

async function getSigningKey() {
  const secret =
    process.env.AUTH_SECRET;

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

function isUserRole(
  value: unknown,
): value is UserRole {
  return (
    value === "admin" ||
    value === "operator" ||
    value === "viewer"
  );
}

export async function createSessionToken(
  user: SessionUser,
) {
  const payload: SessionPayload = {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    expiresAt:
      Math.floor(Date.now() / 1000) +
      SESSION_DURATION_SECONDS,
  };

  const encodedPayload =
    encodeBase64Url(
      JSON.stringify(payload),
    );

  const key = await getSigningKey();

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(
        encodedPayload,
      ),
    );

  const signatureText =
    Array.from(
      new Uint8Array(signature),
    )
      .map((byte) =>
        byte
          .toString(16)
          .padStart(2, "0"),
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

  const [
    encodedPayload,
    signatureText,
  ] = token.split(".");

  if (
    !encodedPayload ||
    !signatureText
  ) {
    return null;
  }

  try {
    const key = await getSigningKey();

    const matchedBytes =
      signatureText.match(/.{1,2}/g);

    if (!matchedBytes) {
      return null;
    }

    const signatureBytes =
      new Uint8Array(
        matchedBytes.map((hex) =>
          Number.parseInt(hex, 16),
        ),
      );

    const signatureValid =
      await crypto.subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        new TextEncoder().encode(
          encodedPayload,
        ),
      );

    if (!signatureValid) {
      return null;
    }

    const payload = JSON.parse(
      decodeBase64Url(
        encodedPayload,
      ),
    ) as Partial<SessionPayload>;

    if (
      typeof payload.username !==
        "string" ||
      payload.username.trim() === "" ||
      typeof payload.displayName !==
        "string" ||
      payload.displayName.trim() === "" ||
      !isUserRole(payload.role) ||
      typeof payload.expiresAt !==
        "number" ||
      payload.expiresAt <=
        Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      username:
        payload.username.trim(),
      displayName:
        payload.displayName.trim(),
      role: payload.role,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV ===
    "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge:
    SESSION_DURATION_SECONDS,
};