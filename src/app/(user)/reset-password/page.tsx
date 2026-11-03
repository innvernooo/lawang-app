"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }

    setIsLoading(true);
    // MOCK: nanti diganti dengan:
    // await authService.resetPassword(token, password)
    console.log("token dari URL:", token);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsDone(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Atur Ulang Kata Sandi</h1>

        {isDone ? (
          <div className="mt-4 space-y-4">
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.
            </p>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Ke halaman masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Kata sandi baru
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
                Konfirmasi kata sandi baru
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}