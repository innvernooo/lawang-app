"use client";

import { useEffect, useState, ChangeEvent, FormEvent, ReactNode } from "react";

type Role = "CUSTOMER" | "ORGANIZER";
type Gender = "MALE" | "FEMALE";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  nik?: string; // 16 digit, akun lama belum punya field ini
  country?: string; // akun lama belum punya field ini
  gender: Gender | null;
  role: Role;
  referralCode: string;
  avatarUrl: string | null;
}

const COUNTRIES = [
  "Indonesia", "Malaysia", "Singapura", "Brunei Darussalam", "Thailand",
  "Filipina", "Vietnam", "Jepang", "Korea Selatan", "Tiongkok", "India",
  "Australia", "Amerika Serikat", "Inggris", "Jerman", "Belanda",
  "Arab Saudi", "Negara lainnya",
];

const ROLE_INFO: Record<Role, { label: string; desc: string; badge: string }> = {
  CUSTOMER: {
    label: "Customer",
    desc: "Akun pembeli tiket event",
    badge: "bg-green-100 text-green-700",
  },
  ORGANIZER: {
    label: "Event Organizer",
    desc: "Akun pembuat dan pengelola event",
    badge: "bg-purple-100 text-purple-700",
  },
};

// Dipakai kalau belum ada yang login, supaya halaman tetap bisa dilihat (data fiktif)
const DEMO_USER: User = {
  id: "usr-001",
  username: "budisantoso",
  name: "Budi Santoso",
  email: "budi@email.com",
  phone: "081234567890",
  nik: "3171234567890001",
  country: "Indonesia",
  gender: "MALE",
  role: "CUSTOMER",
  referralCode: "BUDI7K2X",
  avatarUrl: null,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
const maskNik = (v: string) =>
  v.length <= 4 ? v : "•".repeat(v.length - 4) + v.slice(-4);

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca foto."));
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 [color-scheme:light] disabled:cursor-default disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700";
const readOnlyClass =
  "w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

// Pembungkus label + hint agar tidak menulis ulang berkali-kali
function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); // data tersimpan
  const [editing, setEditing] = useState(false); // false = semua data terkunci
  const [revealNik, setRevealNik] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [gender, setGender] = useState<Gender | "">("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  // Isi semua field dari data user
  function fillForm(data: User) {
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone ?? "");
    setNik(data.nik ?? "");
    setCountry(data.country ?? "Indonesia");
    setGender(data.gender ?? "");
    setAvatar(data.avatarUrl);
  }

  // Ambil user yang sedang login dari localStorage saat halaman dibuka
  useEffect(() => {
    let data = DEMO_USER;
    try {
      const saved = localStorage.getItem("currentUser");
      if (saved) data = JSON.parse(saved);
    } catch {
      // abaikan, pakai DEMO_USER
    }
    setUser(data);
    fillForm(data);
  }, []);

  function startEdit() {
    setMessage(null);
    setEditing(true);
  }

  // Batal: kembalikan semua isian ke data tersimpan, lalu kunci lagi
  function cancelEdit() {
    if (user) fillForm(user);
    setMessage(null);
    setEditing(false);
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "File harus berupa gambar.", ok: false });
      return;
    }
    if (file.size > 1024 * 1024) {
      setMessage({ text: "Ukuran foto maksimal 1 MB.", ok: false });
      return;
    }
    setMessage(null);
    setAvatar(await fileToDataUrl(file));
  }

  // Submit form hanya memvalidasi lalu membuka popup konfirmasi
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    if (!name.trim()) {
      setMessage({ text: "Nama lengkap wajib diisi.", ok: false });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ text: "Format email tidak valid.", ok: false });
      return;
    }
    // Menerima 081234567890, 6281234567890, atau +6281234567890 (juga nomor luar negeri)
    if (phone.trim() && !/^\+?[0-9]{8,15}$/.test(phone.trim())) {
      setMessage({
        text: "Format no. ponsel tidak valid. Contoh: 081234567890.",
        ok: false,
      });
      return;
    }
    if (nik && !/^\d{16}$/.test(nik)) {
      setMessage({ text: "NIK harus 16 digit angka.", ok: false });
      return;
    }

    setMessage(null);
    setShowConfirm(true);
  }

  // Penyimpanan sebenarnya terjadi setelah user menekan "Ya"
  async function handleConfirm() {
    if (!user) return;
    setIsSaving(true);
    await delay(800); // simulasi menunggu backend

    const updated: User = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      nik: nik || undefined,
      country,
      gender: gender || null,
      avatarUrl: avatar,
    };

    try {
      localStorage.setItem("currentUser", JSON.stringify(updated));

      // Perbarui juga daftar akun, password tetap dipertahankan
      const users = JSON.parse(localStorage.getItem("users") ?? "[]");
      const synced = users.map((u: User) =>
        u.id === updated.id ? { ...u, ...updated } : u
      );
      localStorage.setItem("users", JSON.stringify(synced));
    } catch {
      setMessage({
        text: "Penyimpanan penuh. Coba pakai foto yang lebih kecil.",
        ok: false,
      });
      setIsSaving(false);
      setShowConfirm(false);
      return;
    }

    setUser(updated);
    setIsSaving(false);
    setShowConfirm(false);
    setEditing(false); // kunci lagi setelah tersimpan
    setMessage({ text: "Profil berhasil diperbarui.", ok: true });
  }

  async function handleCopy() {
    if (!user) return;
    await navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Tampilan loading (skeleton sederhana)
  if (!user) {
    return (
      <main className="mx-auto max-w-6xl bg-white p-4 sm:p-8">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="h-48 animate-pulse rounded-xl bg-gray-200 lg:col-span-1" />
          <div className="h-96 animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
        </div>
      </main>
    );
  }

  const roleInfo = ROLE_INFO[user.role];

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 bg-white p-4 sm:p-8">
      {/* Judul + tombol Update Profile */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Profil Saya</h1>
            {editing && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Mode ubah aktif
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {editing
              ? "Ubah data yang diperlukan, lalu klik Update Profile di bagian bawah."
              : "Data profil bersifat tetap. Klik Update Profile untuk mengubahnya."}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Update Profile
          </button>
        )}
      </div>

      {/* HP & tablet: satu kolom. Desktop: kiri identitas, kanan form */}
      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:space-y-0">
        {/* Identitas akun: role, ID, dan kode referral */}
        <section className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5 lg:sticky lg:top-8 lg:col-span-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-600">Jenis akun</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${roleInfo.badge}`}
                >
                  {roleInfo.label}
                </span>
                <span className="text-xs text-gray-500">{roleInfo.desc}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">ID Akun</p>
              <p className="font-mono text-sm text-gray-700">
                {user.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {user.role === "CUSTOMER" && (
            <div className="mt-4 border-t border-blue-100 pt-4">
              <p className="text-sm text-gray-600">Kode referral kamu</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="text-xl font-bold tracking-widest text-blue-700">
                  {user.referralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Kode ini permanen dan tidak bisa diubah. Bagikan ke teman, dan
                kamu mendapat 10.000 poin untuk setiap pendaftar baru.
              </p>
            </div>
          )}
        </section>

        {/* Form profil */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-6 lg:col-span-2 lg:p-8"
        >
          {/* Semua field terkunci selama bukan mode ubah */}
          <fieldset disabled={!editing} className="min-w-0 space-y-6">
            {/* Foto profil */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 lg:h-24 lg:w-24 lg:text-3xl">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              {editing && (
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Ganti foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar(null)}
                      className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Data akun */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Data Akun
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Username"
                  htmlFor="username"
                  hint={editing ? "Username tidak bisa diubah." : undefined}
                >
                  <input
                    id="username"
                    value={user.username}
                    disabled
                    className={readOnlyClass}
                  />
                </Field>

                <Field
                  label="Jenis Akun"
                  htmlFor="role"
                  hint={editing ? "Tidak bisa diubah." : undefined}
                >
                  <input
                    id="role"
                    value={roleInfo.label}
                    disabled
                    className={readOnlyClass}
                  />
                </Field>

                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className={inputClass}
                  />
                </Field>

                <Field label="No. Ponsel" htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* Data diri */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Data Diri
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Nama Lengkap" htmlFor="name">
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap sesuai identitas"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field
                  label="NIK"
                  htmlFor="nik"
                  hint={editing ? `Sesuai KTP, 16 digit (${nik.length}/16).` : undefined}
                >
                  <input
                    id="nik"
                    inputMode="numeric"
                    value={editing || revealNik ? nik : maskNik(nik)}
                    onChange={(e) => setNik(onlyDigits(e.target.value, 16))}
                    placeholder={editing ? "16 digit NIK" : "-"}
                    className={inputClass}
                  />
                </Field>

                <Field label="Negara" htmlFor="country">
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={inputClass}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Jenis kelamin */}
                <fieldset className="sm:col-span-2">
                  <legend className={labelClass}>Jenis Kelamin</legend>
                  <div className="flex gap-6">
                    {(
                      [
                        { value: "MALE", label: "Laki-laki" },
                        { value: "FEMALE", label: "Perempuan" },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={opt.value}
                          checked={gender === opt.value}
                          onChange={() => setGender(opt.value)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </fieldset>

          {/* Tampilkan/sembunyikan NIK (hanya saat mode lihat) */}
          {!editing && nik && (
            <button
              type="button"
              onClick={() => setRevealNik((v) => !v)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {revealNik ? "Sembunyikan NIK" : "Tampilkan NIK"}
            </button>
          )}

          {message && (
            <p
              className={`rounded-lg p-3 text-sm ${
                message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Tombol bawah hanya muncul di mode ubah */}
          {editing && (
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Update Profile
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}