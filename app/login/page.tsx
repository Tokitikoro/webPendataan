"use client";

import {
    type FormEvent,
    useState,
} from "react";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    LogIn,
    User,
} from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    async function handleLogin(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setSubmitting(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                },
            );

            const result = (await response.json()) as {
                success?: boolean;
                message?: string;
            };

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ?? "Login gagal",
                );
            }

            window.location.href = "/";
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Login gagal",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="loginPage">
            <section className="loginCard">
                <div className="loginBrand">
                    <div className="loginLogo">
                        BPS
                    </div>

                    <div>
                        <p className="eyebrow">
                            SISTEM MONITORING
                        </p>

                        <h1>Masuk ke SIMI Aqua</h1>

                        <p>
                            Gunakan akun yang telah terdaftar
                            untuk mengakses dashboard.
                        </p>
                    </div>
                </div>

                <form
                    className="loginForm"
                    onSubmit={handleLogin}
                >
                    <label>
                        <span>Username</span>

                        <div className="loginInput">
                            <User />

                            <input
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value,
                                    )
                                }
                                placeholder="Masukkan username"
                                autoComplete="username"
                                required
                                autoFocus
                            />
                        </div>
                    </label>

                    <label>
                        <span>Password</span>

                        <div className="loginInput">
                            <LockKeyhole />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="loginPasswordToggle"
                                onClick={() =>
                                    setShowPassword((current) => !current)
                                }
                                aria-label={
                                    showPassword
                                        ? "Sembunyikan password"
                                        : "Tampilkan password"
                                }
                                title={
                                    showPassword
                                        ? "Sembunyikan password"
                                        : "Tampilkan password"
                                }
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </label>

                    {message && (
                        <div className="loginMessage">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="loginSubmit"
                        disabled={
                            submitting ||
                            username.trim() === "" ||
                            password === ""
                        }
                    >
                        <LogIn />

                        {submitting
                            ? "Memeriksa..."
                            : "Masuk"}
                    </button>
                </form>

                <small className="loginFooter">
                    Badan Pusat Statistik · SIMI Aqua
                </small>
            </section>
        </div>
    );
}