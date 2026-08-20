import {
    pbkdf2Sync,
    randomBytes,
} from "node:crypto";

const password =
    process.argv[2];

if (!password) {
    console.error(
        "Gunakan: node scripts/create-password-hash.mjs PASSWORD",
    );

    process.exit(1);
}

const iterations = 310000;
const salt = randomBytes(32);

const hash = pbkdf2Sync(
    password,
    salt,
    iterations,
    32,
    "sha256",
);

console.log(
    [
        "pbkdf2-sha256",
        iterations,
        salt.toString("hex"),
        hash.toString("hex"),
    ].join(":"),
);