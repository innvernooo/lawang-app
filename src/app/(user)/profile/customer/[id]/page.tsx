"use client";

/* ═══════════ BAGIAN 1: IMPORT ═══════════ */
import {
  useEffect, useState, ChangeEvent, FormEvent, InputHTMLAttributes, ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance.lib";
/* ═══════════ BAGIAN 2: TIPE DATA (cermin tabel Customer di Prisma) ═══════════ */
type Gender = "MALE" | "FEMALE";

interface Customer {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  nik: string; // opsional, 16 digit
  country: string;
  gender: Gender | "";
  profilePictureUrl: string;
  referralCode: string;
  createdAt: string;
}

type Errors = Partial<Record<keyof Customer, string>>;
type Message = { text: string; ok: boolean } | null;
type Raw = Record<string, unknown>;

// Satu "batch" poin: setiap poin punya tanggal kedaluwarsa sendiri (3 bulan, sesuai PRD)
interface PointBatch {
  id: string;
  amount: number;
  note: string;
  earnedAt: string; // "YYYY-MM-DD"
  expiresAt: string; // "YYYY-MM-DD"
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  expiresAt: string; // "YYYY-MM-DD"
  used: boolean;
}

/* ═══════════ BAGIAN 3: KONSTANTA & DATA CONTOH ═══════════ */
const COUNTRIES = [
  "Indonesia", "Malaysia", "Singapura", "Brunei Darussalam", "Thailand",
  "Filipina", "Vietnam", "Jepang", "Korea Selatan", "Tiongkok", "India",
  "Australia", "Amerika Serikat", "Inggris", "Jerman", "Belanda",
  "Arab Saudi", "Negara lainnya",
];

// Akun contoh bawaan di halaman login, dipakai untuk mengecek email ganda
const SEED_ACCOUNTS = [
  { id: "usr-001", email: "budi@email.com" },
  { id: "usr-002", email: "sinar@email.com" },
];

// Dipakai kalau belum login sebagai customer, supaya halaman tetap bisa dilihat (data fiktif)
const DEMO_CUSTOMER: Customer = {
  id: "usr-001",
  username: "budisantoso",
  email: "budi@email.com",
  fullName: "Budi Santoso",
  phoneNumber: "081234567890",
  nik: "3171234567890001",
  country: "Indonesia",
  gender: "MALE",
  profilePictureUrl: "",
  referralCode: "BUDI7K2X",
  createdAt: "2026-09-10T00:00:00.000Z",
};

// Data contoh poin dan kupon. Nanti datang dari backend (tabel poin dan kupon).
const MOCK_POINTS: PointBatch[] = [
  { id: "p1", amount: 10_000, note: "Referral: teman mendaftar", earnedAt: "2026-10-01", expiresAt: "2027-01-01" },
  { id: "p2", amount: 10_000, note: "Referral: teman mendaftar", earnedAt: "2026-09-10", expiresAt: "2026-12-10" },
  { id: "p3", amount: 10_000, note: "Referral: teman mendaftar", earnedAt: "2026-06-15", expiresAt: "2026-09-15" },
];

const MOCK_COUPONS: Coupon[] = [
  { id: "c1", code: "REF-WELCOME", title: "Diskon pendaftar referral", discountPercent: 10, expiresAt: "2027-01-05", used: false },
  { id: "c2", code: "REF-WELCOME-2", title: "Diskon pendaftar referral", discountPercent: 10, expiresAt: "2026-08-01", used: false },
  { id: "c3", code: "REF-WELCOME-3", title: "Diskon pendaftar referral", discountPercent: 10, expiresAt: "2026-12-30", used: true },
];

/* ═══════════ BAGIAN 4: FUNGSI & KOMPONEN BANTU ═══════════ */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
const maskValue = (v: string) => (v.length <= 4 ? v : "•".repeat(v.length - 4) + v.slice(-4));
const str = (v: unknown) => (typeof v === "string" ? v : "");
const todayIso = () => new Date().toISOString().slice(0, 10);

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// Mengubah file gambar jadi teks (data URL) agar bisa disimpan di localStorage
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca foto."));
    reader.readAsDataURL(file);
  });
}

/* --- Penyimpanan sementara (nanti diganti API backend) --- */

function readUsers(): Raw[] {
  try {
    return JSON.parse(localStorage.getItem("users") ?? "[]");
  } catch {
    return [];
  }
}

function readCurrentUser(): Raw | null {
  try {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function isEmailTaken(userId: string, email: string) {
  return [...SEED_ACCOUNTS, ...readUsers()].some(
    (u) => u.id !== userId && String(u.email ?? "").toLowerCase() === email.toLowerCase()
  );
}

// Menulis perubahan ke akun yang sedang login dan ke daftar semua akun.
// Bisa melempar error kalau penyimpanan penuh, jadi panggil di dalam try/catch.
function saveUserPatch(id: string, patch: Raw) {
  const users = readUsers();
  const current = readCurrentUser() ?? {};
  localStorage.setItem("currentUser", JSON.stringify({ ...current, ...patch }));
  localStorage.setItem(
    "users",
    JSON.stringify(users.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  );
}

/* --- Konversi & validasi data --- */

// Data tersimpan (bentuknya bisa beragam) -> bentuk standar untuk form
function normalize(raw: Raw): Customer {
  const gender = str(raw.gender);
  return {
    id: str(raw.id) || "demo",
    username: str(raw.username),
    email: str(raw.email),
    fullName: str(raw.fullName) || str(raw.name),
    phoneNumber: str(raw.phoneNumber) || str(raw.phone),
    nik: str(raw.nik),
    country: str(raw.country) || "Indonesia",
    gender: gender === "MALE" || gender === "FEMALE" ? gender : "",
    profilePictureUrl: str(raw.profilePictureUrl) || str(raw.avatarUrl),
    referralCode: str(raw.referralCode),
    createdAt: str(raw.createdAt),
  };
}

// Bentuk form -> bentuk yang disimpan. Username dan kode referral TIDAK ikut ditulis.
function toStored(c: Customer) {
  return {
    email: c.email.trim(),
    fullName: c.fullName.trim(),
    phoneNumber: c.phoneNumber.trim(),
    nik: c.nik || null,
    country: c.country,
    gender: c.gender || null,
    profilePictureUrl: c.profilePictureUrl || null,
    // alias supaya halaman lain (login, navbar) tetap berjalan
    name: c.fullName.trim(),
    phone: c.phoneNumber.trim(),
    avatarUrl: c.profilePictureUrl || null,
  };
}

// Mengembalikan { namaField: "pesan error" }. Kosong berarti data valid.
function validate(f: Customer): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = "Nama lengkap wajib diisi.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Format email tidak valid.";
  if (!/^\+?[0-9]{8,15}$/.test(f.phoneNumber.trim()))
    e.phoneNumber = "Format no. ponsel tidak valid. Contoh: 081234567890.";
  if (f.nik && !/^\d{16}$/.test(f.nik)) e.nik = "NIK harus 16 digit angka.";
  if (!f.country) e.country = "Pilih negara.";
  return e;
}

/* --- Kelas Tailwind bersama --- */

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 [color-scheme:light] disabled:cursor-default disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700";
const lockedClass =
  "w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 placeholder-gray-400";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

/* --- Komponen kecil --- */

// Pembungkus label + pesan error + hint
function Field({
  id, label, error, hint, className, children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Input teks lengkap dengan label. locked = true: tampil abu-abu dan tidak bisa diubah.
function Text({
  id, label, error, hint, locked, className, ...input
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  locked?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <input
        id={id}
        {...input}
        disabled={locked || input.disabled}
        className={`${locked ? lockedClass : inputClass} ${error ? "border-red-400" : ""}`}
      />
    </Field>
  );
}

// Kelompok field dengan judul, tersusun dua kolom di layar lebar
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Notice({ message }: { message: Message }) {
  if (!message) return null;
  return (
    <p
      className={`rounded-lg p-3 text-sm ${
        message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </p>
  );
}

// Popup konfirmasi sebelum mengubah data (catatan PRD no. 4)
function ConfirmDialog({
  open, title, message, confirmText = "Ya, lanjutkan", isLoading = false, onConfirm, onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Tab "Keamanan": ganti password + tautan reset password lewat email
function PasswordTab({ userId, isDemo }: { userId: string; isDemo: boolean }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validasi dulu, lalu buka popup konfirmasi
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentPw) return setMessage({ text: "Password saat ini wajib diisi.", ok: false });
    if (newPw.length < 8) return setMessage({ text: "Password baru minimal 8 karakter.", ok: false });
    if (newPw === currentPw)
      return setMessage({ text: "Password baru tidak boleh sama dengan password lama.", ok: false });
    if (newPw !== confirmPw) return setMessage({ text: "Konfirmasi password tidak sama.", ok: false });
    setMessage(null);
    setShowConfirm(true);
  }

  // Penyimpanan sebenarnya, setelah user menekan "Ya"
  async function handleConfirm() {
    setIsSaving(true);
    await delay(800); // simulasi menunggu backend

    let result: { text: string; ok: boolean } = { text: "Password berhasil diubah.", ok: true };
    if (isDemo) {
      result = { text: "Data contoh tidak bisa mengganti password.", ok: false };
    } else {
      try {
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx === -1) {
          // Akun contoh bawaan tidak tersimpan di localStorage
          result = {
            text: "Akun contoh tidak bisa mengganti password. Daftar akun baru untuk mencobanya.",
            ok: false,
          };
        } else if (users[idx].password !== currentPw) {
          result = { text: "Password saat ini salah.", ok: false };
        } else {
          users[idx].password = newPw; // hanya latihan; backend nanti menyimpan hash
          localStorage.setItem("users", JSON.stringify(users));
        }
      } catch {
        result = { text: "Gagal menyimpan password.", ok: false };
      }
    }

    if (result.ok) {
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
    setMessage(result);
    setIsSaving(false);
    setShowConfirm(false);
  }

  const type = showPw ? "text" : "password";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Ganti Password</h2>
        <p className="text-sm text-gray-500">
          Gunakan password minimal 8 karakter yang belum pernah kamu pakai.
        </p>
      </div>

      <Text
        id="currentPw" label="Password Saat Ini" type={type}
        value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
        autoComplete="current-password"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Text
          id="newPw" label="Password Baru" type={type}
          value={newPw} onChange={(e) => setNewPw(e.target.value)}
          autoComplete="new-password"
        />
        <Text
          id="confirmPw" label="Konfirmasi Password Baru" type={type}
          value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox" checked={showPw}
          onChange={(e) => setShowPw(e.target.checked)}
          className="h-4 w-4 accent-indigo-600"
        />
        Tampilkan password
      </label>

      <Notice message={message} />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 sm:w-auto sm:px-6"
        >
          Ubah Password
        </button>
        <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
          Lupa password saat ini? Reset lewat email
        </Link>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Ubah password?"
        message="Password akunmu akan diganti dengan password baru."
        confirmText="Ya, ubah"
        isLoading={isSaving}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </form>
  );
}

export default function CustomerProfilePage() {
  const pathname = usePathname();

  /* ═══════════ BAGIAN 5: STATE ═══════════ */
  const [user, setUser] = useState<Customer | null>(null); // data tersimpan
  const [f, setF] = useState<Customer>(DEMO_CUSTOMER); // data yang sedang diketik
  const [isDemo, setIsDemo] = useState(false);
  const [wrongRole, setWrongRole] = useState(false);
  const [tab, setTab] = useState<"info" | "rewards" | "security">("info");
  const [editing, setEditing] = useState(false); // false = semua terkunci
  const [reveal, setReveal] = useState(false); // tampilkan NIK
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<Message>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ═══════════ BAGIAN 6: useEffect (ambil data saat halaman dibuka) ═══════════ */
 // Ambil data profil dari backend (cookie token terkirim otomatis)
const { data: me, isError } = useQuery({
  queryKey: ["me"],
  queryFn: async () => (await axiosInstance.get("/auth/me")).data.data,
  retry: false,
});

useEffect(() => {
  if (!me) return;
  if (me.role === "ORGANIZER") {
    setWrongRole(true); // halaman ini khusus customer
    return;
  }
  const data = normalize(me); // kolom "name" dari database otomatis jadi fullName
  setIsDemo(false);
  setUser(data);
  setF(data);
}, [me]);

  /* ═══════════ BAGIAN 7: HANDLER (aksi saat tombol ditekan) ═══════════ */

  // Mengubah satu field di form sekaligus menghapus error field itu
  function set<K extends keyof Customer>(key: K, value: Customer[K]) {
    setF((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function startEdit() {
    setMessage(null);
    setEditing(true);
  }

  // Batal: kembalikan isian ke data tersimpan, lalu kunci lagi
  function cancelEdit() {
    if (user) setF(user);
    setErrors({});
    setMessage(null);
    setEditing(false);
  }

  async function handleAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setMessage({ text: "File harus berupa gambar.", ok: false });
    if (file.size > 1024 * 1024)
      return setMessage({ text: "Ukuran foto maksimal 1 MB.", ok: false });
    setMessage(null);
    set("profilePictureUrl", await fileToDataUrl(file));
  }

  // Tahap 1: validasi, lalu buka popup konfirmasi
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const found = validate(f);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage({ text: "Periksa kembali isian yang ditandai merah.", ok: false });
      return;
    }
    setMessage(null);
    setShowConfirm(true);
  }

  // Tahap 2: penyimpanan sebenarnya, setelah user menekan "Ya"
  async function handleConfirm() {
    setIsSaving(true);
    await delay(800); // simulasi menunggu backend

    const updated: Customer = {
      ...f,
      fullName: f.fullName.trim(),
      email: f.email.trim(),
      phoneNumber: f.phoneNumber.trim(),
    };

    let error: string | null = null;
    if (!isDemo) {
      if (isEmailTaken(f.id, updated.email)) {
        error = "Email sudah dipakai akun lain.";
        setErrors({ email: error });
      } else {
        try {
          saveUserPatch(f.id, toStored(updated));
        } catch {
          error = "Penyimpanan penuh. Coba pakai foto yang lebih kecil.";
        }
      }
    }

    setIsSaving(false);
    setShowConfirm(false);
    if (error) return setMessage({ text: error, ok: false });

    setUser(updated);
    setF(updated);
    setEditing(false); // kunci lagi setelah tersimpan
    setMessage({ text: "Profil berhasil diperbarui.", ok: true });
  }

  async function handleCopy() {
    if (!user) return;
    await navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ═══════════ BAGIAN 8: TAMPILAN (JSX) ═══════════ */

  // Akun organizer tidak boleh membuka halaman customer
  if (wrongRole) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p className="rounded-xl bg-amber-50 p-6 text-amber-800">
          Halaman ini khusus akun <b>Customer</b>. Kamu masuk sebagai Organizer.
        </p>
        <Link
          href={pathname.replace(/\/customer$/, "/organizer")}
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          Ke profil organizer
        </Link>
      </div>
    );
  }

      if (isError) {
  return (
    <div className="mx-auto max-w-lg p-8 text-center">
      <p className="text-gray-700">Gagal memuat profil. Pastikan kamu sudah login.</p>
      <Link href="/login" className="mt-3 inline-block text-indigo-600 hover:underline">
        Ke halaman login
      </Link>
    </div>
  );
}
  // Skeleton loading
  if (!user) {
    return (
      <main className="mx-auto max-w-6xl p-4 sm:p-8">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="h-56 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-96 animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
        </div>
      </main>
    );
  }

  const today = todayIso();
  const activePoints = MOCK_POINTS.filter((p) => p.expiresAt >= today).reduce((s, p) => s + p.amount, 0);
  const initial = (f.fullName || "?").charAt(0).toUpperCase();

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      {/* ── Judul + tombol Update Profile ── */}
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
              ? ""
              : "Klik Update Profile untuk mengubahnya."}
          </p>
        </div>
        {tab === "info" && !editing && (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Update Profile
          </button>
        )}
      </div>

      {/* ── Grid: kartu identitas (kiri) + panel tab (kanan) ── */}
      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:space-y-0">
        {/* Kartu identitas + kode referral */}
        <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5 lg:sticky lg:top-8 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xl font-bold text-gray-500">
              {f.profilePictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.profilePictureUrl} alt="Foto profil" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{user.fullName || "-"}</p>
              <p className="truncate text-sm text-gray-500">@{user.username || "-"}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t border-indigo-100 pt-4 text-sm">
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Customer
            </span>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">ID Akun</span>
              <span className="font-mono text-gray-700">{user.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Bergabung</span>
              <span className="text-gray-700">{user.createdAt ? formatDate(user.createdAt) : "-"}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-indigo-100 pt-4">
            <p className="text-sm text-gray-600">Kode referral kamu</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="text-xl font-bold tracking-widest text-indigo-700">
                {user.referralCode || "-"}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!user.referralCode}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                {copied ? "Tersalin!" : "Salin"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Kode ini permanen dan tidak bisa diubah. Bagikan ke teman, dan kamu
              mendapat 10.000 poin untuk setiap pendaftar baru.
            </p>
          </div>
        </section>

        {/* Panel kanan: tab */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-md lg:col-span-2">
          <div role="tablist" className="flex overflow-x-auto border-b border-gray-200">
            {(
              [
                { key: "info", label: "Informasi Profil" },
                { key: "rewards", label: "Poin & Kupon" },
                { key: "security", label: "Keamanan" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors sm:flex-none sm:px-6 ${
                  tab === t.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab Informasi Profil ── */}
          {tab === "info" && (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8">
              {/* fieldset disabled = satu atribut yang mengunci SEMUA input di dalamnya */}
              <fieldset disabled={!editing} className="min-w-0 space-y-8">
                {/* Foto profil */}
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 lg:h-24 lg:w-24 lg:text-3xl">
                    {f.profilePictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.profilePictureUrl} alt="Foto profil" className="h-full w-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  {editing && (
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Ganti foto
                        <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                      </label>
                      {f.profilePictureUrl && (
                        <button
                          type="button"
                          onClick={() => set("profilePictureUrl", "")}
                          className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <Section title="Data Akun">
                  <Text
                    id="username" label="Username" locked readOnly placeholder="-" value={f.username}
                    hint={editing ? "Username tidak bisa diubah." : undefined}
                  />
                  <Text
                    id="role" label="Jenis Akun" locked readOnly value="Customer"
                    hint={editing ? "Tidak bisa diubah." : undefined}
                  />
                  <Text
                    id="email" label="Email" type="email" maxLength={255} placeholder="-"
                    value={f.email} onChange={(e) => set("email", e.target.value)} error={errors.email}
                  />
                  <Text
                    id="phoneNumber" label="No. Ponsel" type="tel" inputMode="tel" maxLength={20} placeholder="-"
                    value={f.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)}
                    error={errors.phoneNumber}
                  />
                </Section>

                <Section title="Data Diri">
                  <Text
                    id="fullName" label="Nama Lengkap" maxLength={150} placeholder="-" className="md:col-span-2"
                    value={f.fullName} onChange={(e) => set("fullName", e.target.value)} error={errors.fullName}
                  />
                  <Text
                    id="nik" label="NIK (opsional)" inputMode="numeric" placeholder={editing ? "16 digit NIK" : "-"}
                    value={editing || reveal ? f.nik : maskValue(f.nik)}
                    onChange={(e) => set("nik", onlyDigits(e.target.value, 16))}
                    error={errors.nik}
                    hint={editing ? `Sesuai KTP, 16 digit (${f.nik.length}/16).` : undefined}
                  />
                  <Field id="country" label="Negara" error={errors.country}>
                    <select
                      id="country" value={f.country}
                      onChange={(e) => set("country", e.target.value)}
                      className={`${inputClass} ${errors.country ? "border-red-400" : ""}`}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Jenis kelamin */}
                  <fieldset className="md:col-span-2">
                    <legend className={labelClass}>Jenis Kelamin</legend>
                    <div className="flex gap-6">
                      {(
                        [
                          { value: "MALE", label: "Laki-laki" },
                          { value: "FEMALE", label: "Perempuan" },
                        ] as const
                      ).map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                          <input
                            type="radio" name="gender" value={opt.value}
                            checked={f.gender === opt.value}
                            onChange={() => set("gender", opt.value)}
                            className="h-4 w-4 accent-indigo-600"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </Section>
              </fieldset>

              {/* Tampilkan/sembunyikan NIK (hanya di mode lihat) */}
              {!editing && f.nik && (
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
                >
                  {reveal ? "Sembunyikan NIK" : "Tampilkan NIK"}
                </button>
              )}

              <div className="mt-6 space-y-4">
                <Notice message={message} />
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
                      className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* ── Tab Poin & Kupon ── */}
          {tab === "rewards" && (
            <div className="space-y-8 p-5 sm:p-6 lg:p-8">
             

              {/* Saldo poin aktif */}
              <div className="rounded-xl bg-indigo-600 p-5 text-white">
                <p className="text-sm text-indigo-100">Saldo poin aktif</p>
                <p className="text-3xl font-bold">{activePoints.toLocaleString("id-ID")} poin</p>
                <p className="mt-1 text-xs text-indigo-100">
                  Poin berlaku 3 bulan sejak diterima. Poin yang kedaluwarsa tidak dihitung.
                </p>
              </div>

              {/* Riwayat poin */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Riwayat Poin
                </h2>
                {MOCK_POINTS.length === 0 ? (
                  <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                    Belum ada poin. Bagikan kode referralmu ke teman!
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                    {MOCK_POINTS.map((p) => {
                      const expired = p.expiresAt < today;
                      return (
                        <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              +{p.amount.toLocaleString("id-ID")} poin
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.note} · diterima {formatDate(p.earnedAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                                expired ? "bg-gray-200 text-gray-600" : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {expired ? "Kedaluwarsa" : "Aktif"}
                            </span>
                            <p className="mt-1 text-xs text-gray-500">s.d. {formatDate(p.expiresAt)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Kupon diskon */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Kupon Diskon
                </h2>
                {MOCK_COUPONS.length === 0 ? (
                  <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                    Belum ada kupon. Daftar dengan kode referral untuk mendapatkannya.
                  </p>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {MOCK_COUPONS.map((c) => {
                      const expired = c.expiresAt < today;
                      const state = c.used ? "Terpakai" : expired ? "Kedaluwarsa" : "Aktif";
                      const valid = state === "Aktif";
                      return (
                        <li
                          key={c.id}
                          className={`rounded-lg border p-4 ${
                            valid ? "border-indigo-200 bg-indigo-50" : "border-gray-200 bg-gray-50 opacity-70"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-2xl font-bold text-indigo-700">{c.discountPercent}%</p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                valid ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {state}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">{c.title}</p>
                          <p className="font-mono text-xs text-gray-600">{c.code}</p>
                          <p className="mt-1 text-xs text-gray-500">Berlaku s.d. {formatDate(c.expiresAt)}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── Tab Keamanan ── */}
          {tab === "security" && <PasswordTab userId={user.id} isDemo={isDemo} />}
        </div>
      </div>
    
      {/* Popup konfirmasi */}
      <ConfirmDialog
        open={showConfirm}
        title="Update profil?"
        message="Data profil kamu akan diperbarui."
        confirmText="Ya, update"
        isLoading={isSaving}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </main>
  );
}