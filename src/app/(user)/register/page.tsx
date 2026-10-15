"use client";

import { useState, ChangeEvent, FormEvent, ReactNode } from "react";
import Link from "next/link";

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

// Akun contoh, dipakai untuk mengecek email/username/referral yang sudah ada
const SEED_USERS: Pick<StoredUser, "username" | "email" | "referralCode">[] = [
  { username: "budisantoso", email: "budi@email.com", referralCode: "BUDI7K2X" },
  { username: "sinarevent", email: "sinar@email.com", referralCode: "SINAR9QW" },
];

function readStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem("users") ?? "[]");
  } catch {
    return [];
  }
}

// Ubah file gambar jadi teks (data URL) agar bisa disimpan di localStorage
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca foto."));
    reader.readAsDataURL(file);
  });
}

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

type ErrorKey =
  | "username" | "name" | "email" | "phone"
  | "password" | "confirm" | "avatar" | "form";
type Errors = Partial<Record<ErrorKey, string>>;

// Pembungkus label + pesan error agar tidak menulis ulang berkali-kali
function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [myReferral, setMyReferral] = useState<string | null>(null); // tanda sukses

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, avatar: "File harus berupa gambar." }));
      return;
    }
    // Batas 1 MB karena disimpan di localStorage (kapasitas terbatas)
    if (file.size > 1024 * 1024) {
      setErrors((p) => ({ ...p, avatar: "Ukuran foto maksimal 1 MB." }));
      return;
    }
    setErrors((p) => ({ ...p, avatar: undefined }));
    setAvatarDataUrl(await fileToDataUrl(file));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(username))
      e.username = "Username 4-20 karakter: huruf, angka, atau underscore.";
    if (!name.trim()) e.name = "Nama lengkap wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Format email tidak valid.";
    if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(phone.trim()))
      e.phone = "Format no. ponsel tidak valid. Contoh: 081234567890.";
    if (password.length < 8) e.password = "Password minimal 8 karakter.";
    if (confirm !== password) e.confirm = "Konfirmasi password tidak sama.";
    return e;
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsLoading(true);
    await delay(1000); // simulasi menunggu backend

    const stored = readStoredUsers();
    const all = [...SEED_USERS, ...stored];

    // Cek duplikat dan kode referral
    if (all.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrors({ email: "Email sudah terdaftar." });
      setIsLoading(false);
      return;
    }
    if (all.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setErrors({ username: "Username sudah dipakai." });
      setIsLoading(false);
      return;
    }
    const usedReferral =
      role === "CUSTOMER" ? referralCode.trim().toUpperCase() : "";
    if (usedReferral && !all.some((u) => u.referralCode === usedReferral)) {
      setErrors({ form: "Kode referral tidak ditemukan." });
      setIsLoading(false);
      return;
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username: username.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender: null,
      birthDate: null,
      role,
      referralCode: generateReferralCode(),
      avatarUrl: avatarDataUrl,
      password, // hanya untuk latihan; backend nanti menyimpannya dalam bentuk hash
    };

    try {
      localStorage.setItem("users", JSON.stringify([...stored, newUser]));
    } catch {
      setErrors({ form: "Penyimpanan penuh. Coba pakai foto yang lebih kecil." });
      setIsLoading(false);
      return;
    }

    setMyReferral(newUser.referralCode);
    setIsLoading(false);
  }

  // Tampilan setelah berhasil daftar
  if (myReferral) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md space-y-4 rounded-xl border border-gray-100 bg-white p-6 text-center shadow-md sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran berhasil!</h1>
          <p className="text-sm text-gray-600">
            Akun kamu sudah dibuat. Ini kode referral milikmu, bagikan ke teman
            untuk mendapat poin.
          </p>
          <p className="rounded-lg bg-blue-50 py-3 text-xl font-bold tracking-widest text-blue-700">
            {myReferral}
          </p>
          <Link
            href="/login"
            className="block rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Lanjut ke halaman login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
        <p className="mt-1 text-sm text-gray-600">
          Daftar untuk mulai membeli tiket atau membuat event.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          {/* Pilih role */}
          <fieldset>
            <legend className={labelClass}>Daftar sebagai</legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: "CUSTOMER", title: "Customer", desc: "Beli tiket event" },
                  { value: "ORGANIZER", title: "Organizer", desc: "Buat & kelola event" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-lg border p-3 text-sm ${
                    role === opt.value
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    className="sr-only"
                  />
                  <span className="block font-semibold text-gray-900">{opt.title}</span>
                  <span className="block text-xs text-gray-500">{opt.desc}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Foto profil */}
          <div>
            <span className={labelClass}>Foto Profil (opsional)</span>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500">
                {avatarDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarDataUrl}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (name.charAt(0) || username.charAt(0) || "?").toUpperCase()
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Pilih foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatarDataUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarDataUrl(null)}
                    className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
            {errors.avatar ? (
              <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Maksimal 1 MB (JPG/PNG).</p>
            )}
          </div>

          <Field label="Username" htmlFor="username" error={errors.username}>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="budisantoso"
              autoComplete="username"
              className={inputClass}
            />
          </Field>

          <Field label="Nama Lengkap" htmlFor="name" error={errors.name}>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Budi Santoso"
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          <Field label="Email" htmlFor="email" error={errors.email}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <Field label="No. Ponsel" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              autoComplete="tel"
              className={inputClass}
            />
          </Field>

          <Field label="Password" htmlFor="password" error={errors.password}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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
          </Field>

          <Field label="Konfirmasi Password" htmlFor="confirm" error={errors.confirm}>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
          </Field>

          {/* Kode referral: hanya untuk customer */}
          {role === "CUSTOMER" && (
            <Field
              label="Kode Referral (opsional)"
              htmlFor="referral"
              hint="Punya kode dari teman? Masukkan untuk mendapat kupon diskon."
            >
              <input
                id="referral"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="BUDI7K2X"
                className={`${inputClass} uppercase tracking-widest`}
              />
            </Field>
          )}

          {errors.form && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
};