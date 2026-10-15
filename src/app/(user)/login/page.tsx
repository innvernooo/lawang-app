"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Role = "CUSTOMER" | "ORGANIZER";

interface StoredUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  gender: "MALE" | "FEMALE" | null;
  birthDate: string | null;
  role: Role;
  referralCode: string;
  avatarUrl: string | null;
  password: string;
}

// Akun contoh (data palsu). Password semua akun: password123
const SEED_USERS: StoredUser[] = [
  {
    id: "usr-001",
    username: "budisantoso",
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081234567890",
    gender: "MALE",
    birthDate: "2000-05-17",
    role: "CUSTOMER",
    referralCode: "BUDI7K2X",
    avatarUrl: null,
    password: "password123",
  },
  {
    id: "usr-002",
    username: "sinarevent",
    name: "Sinar Event Organizer",
    email: "sinar@email.com",
    phone: "081298765432",
    gender: null,
    birthDate: null,
    role: "ORGANIZER",
    referralCode: "SINAR9QW",
    avatarUrl: null,
    password: "password123",
  },
];

// Ambil akun hasil register dari localStorage
function readStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem("users") ?? "[]");
  } catch {
    return [];
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Email/username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    await delay(800); // simulasi menunggu backend

    const id = identifier.trim().toLowerCase();
    const user = [...SEED_USERS, ...readStoredUsers()].find(
      (u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id
    );

    if (!user || user.password !== password) {
      setError("Email/username atau password salah.");
      setIsLoading(false);
      return;
    }

    // Simpan user yang sedang login (tanpa password)
    const { password: _omit, ...currentUser } = user;
    void _omit;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    router.push(user.role === "ORGANIZER" ? "/dashboard" : "/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-125 rounded-xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
    {/* Contoh menambahkan dan mengatur ukuran gambar layout */}
        <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang kembali! Masuk untuk login.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="identifier" className={labelClass}>
              Email atau Username
            </label>
            <input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="nama@email.com atau username"
              autoComplete="username"
              className={inputClass}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>

        {/* Hapus blok ini kalau backend sudah terhubung */}
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          Akun contoh (password: <b>password123</b>):
          <br />
          Customer: budisantoso · Organizer: sinarevent
        </div>
      </div>
    </main>
  );
}