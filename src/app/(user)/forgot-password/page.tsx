"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    setIsLoading(true);
    // MOCK: pura-pura memanggil backend selama 1 detik.
    // Nanti diganti dengan: await authService.forgotPassword(email)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Lupa Password</h1>

        {isSent ? (
          <div className="mt-4 space-y-4">
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Link reset password sudah dikirim ke <b>{email}</b>. Cek inbox
              atau folder spam kamu.
            </p>
            <Link
              href="/login"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              Kembali ke halaman login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              Masukkan email akunmu, kami akan mengirim link untuk mengatur
              ulang password.
            </p>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>

            <Link
              href="/login"
              className="block text-center text-sm text-gray-600 hover:underline"
            >
              Kembali ke login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}