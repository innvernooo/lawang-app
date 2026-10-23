"use client";

/* ═══════════ BAGIAN 1: IMPORT ═══════════ */
import {
  useEffect, useState, ChangeEvent, FormEvent, InputHTMLAttributes, ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ═══════════ BAGIAN 2: TIPE DATA (cermin tabel Organizer di Prisma) ═══════════ */
type OrganizerType = "INDIVIDUAL" | "COMPANY";

interface Organizer {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  organizerName: string;
  organizerType: OrganizerType | "";
  legalName: string;
  organizerBio: string;
  websiteUrl: string;
  instagramUrl: string;
  npwp: string;
  npwpImageUrl: string;
  nib: string;
  picName: string;
  picNik: string;
  picKtpImageUrl: string;
  picPhoneNumber: string;
  officeAddress: string;
  city: string;
  province: string;
  postalCode: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  createdAt: string;
}

type Errors = Partial<Record<keyof Organizer, string>>;
type Message = { text: string; ok: boolean } | null;
type Raw = Record<string, unknown>;

/* ═══════════ BAGIAN 3: KONSTANTA & DATA CONTOH ═══════════ */
const TYPE_LABEL: Record<OrganizerType, string> = {
  INDIVIDUAL: "Perorangan",
  COMPANY: "Perusahaan / Badan Usaha",
};

const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi",
  "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta",
  "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan",
  "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo",
  "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Barat Daya",
  "Papua Tengah", "Papua Pegunungan", "Papua Selatan",
];

const BANKS = [
  "BCA", "BNI", "BRI", "Bank Mandiri", "BSI", "CIMB Niaga", "Permata",
  "Danamon", "BTN", "OCBC", "Bank Jago",
];

// Akun contoh bawaan di halaman login, dipakai untuk mengecek email ganda
const SEED_ACCOUNTS = [
  { id: "usr-001", email: "budi@email.com" },
  { id: "usr-002", email: "sinar@email.com" },
];

// Dipakai kalau belum login sebagai organizer, supaya halaman tetap bisa dilihat (data fiktif)
const DEMO_ORGANIZER: Organizer = {
  id: "demo-organizer-0001",
  username: "sinarevent",
  email: "sinar@email.com",
  profilePictureUrl: "",
  organizerName: "Sinar Event Organizer",
  organizerType: "COMPANY",
  legalName: "PT Sinar Kreasi Nusantara",
  organizerBio: "Penyelenggara konser, workshop, dan festival komunitas sejak 2018.",
  websiteUrl: "https://sinarevent.id",
  instagramUrl: "https://instagram.com/sinarevent",
  npwp: "1234567890123456",
  npwpImageUrl: "npwp-sinar.pdf",
  nib: "1234567890123",
  picName: "Sinta Dewi",
  picNik: "3171234567890001",
  picKtpImageUrl: "ktp-sinta.jpg",
  picPhoneNumber: "081298765432",
  officeAddress: "Jl. Contoh No. 10, Setiabudi",
  city: "Jakarta Selatan",
  province: "DKI Jakarta",
  postalCode: "12920",
  bankName: "BCA",
  bankAccountNumber: "1234567890",
  bankAccountHolder: "PT Sinar Kreasi Nusantara",
  createdAt: "2026-10-01T00:00:00.000Z",
};

/* ═══════════ BAGIAN 4: FUNGSI & KOMPONEN BANTU ═══════════ */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
const maskValue = (v: string) => (v.length <= 4 ? v : "•".repeat(v.length - 4) + v.slice(-4));
const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v);
const str = (v: unknown) => (typeof v === "string" ? v : "");

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
function normalize(raw: Raw): Organizer {
  const type = str(raw.organizerType);
  return {
    id: str(raw.id) || "demo",
    username: str(raw.username),
    email: str(raw.email),
    profilePictureUrl: str(raw.profilePictureUrl) || str(raw.avatarUrl),
    organizerName: str(raw.organizerName) || str(raw.organizationName) || str(raw.name),
    organizerType: type === "INDIVIDUAL" || type === "COMPANY" ? type : "",
    legalName: str(raw.legalName),
    organizerBio: str(raw.organizerBio) || str(raw.description),
    websiteUrl: str(raw.websiteUrl),
    instagramUrl: str(raw.instagramUrl),
    npwp: str(raw.npwp),
    npwpImageUrl: str(raw.npwpImageUrl),
    nib: str(raw.nib),
    picName: str(raw.picName) || str(raw.name),
    picNik: str(raw.picNik),
    picKtpImageUrl: str(raw.picKtpImageUrl),
    picPhoneNumber: str(raw.picPhoneNumber) || str(raw.phone),
    officeAddress: str(raw.officeAddress),
    city: str(raw.city),
    province: str(raw.province),
    postalCode: str(raw.postalCode),
    bankName: str(raw.bankName),
    bankAccountNumber: str(raw.bankAccountNumber),
    bankAccountHolder: str(raw.bankAccountHolder),
    createdAt: str(raw.createdAt),
  };
}

// Bentuk form -> bentuk yang disimpan. Hanya field yang BOLEH diubah yang ditulis balik.
// Ada alias (name, phone, avatarUrl, ...) supaya login dan dashboard tetap berjalan.
function toStored(o: Organizer) {
  const orNull = (v: string) => (v.trim() ? v.trim() : null);
  return {
    email: o.email.trim(),
    profilePictureUrl: o.profilePictureUrl || null,
    organizerName: o.organizerName.trim(),
    organizerBio: orNull(o.organizerBio),
    websiteUrl: orNull(o.websiteUrl),
    instagramUrl: orNull(o.instagramUrl),
    picName: o.picName.trim(),
    picPhoneNumber: o.picPhoneNumber.trim(),
    officeAddress: o.officeAddress.trim(),
    city: o.city.trim(),
    province: o.province,
    postalCode: o.postalCode,
    bankName: o.bankName,
    bankAccountNumber: o.bankAccountNumber,
    name: o.picName.trim(),
    phone: o.picPhoneNumber.trim(),
    avatarUrl: o.profilePictureUrl || null,
    organizationName: o.organizerName.trim(),
    description: o.organizerBio.trim(),
  };
}

// Mengembalikan { namaField: "pesan error" }. Kosong berarti data valid.
function validate(f: Organizer): Errors {
  const e: Errors = {};
  if (f.organizerName.trim().length < 3) e.organizerName = "Nama organizer minimal 3 karakter.";
  if (f.organizerBio.length > 500) e.organizerBio = "Bio maksimal 500 karakter.";
  if (f.websiteUrl && !isUrl(f.websiteUrl))
    e.websiteUrl = "Gunakan format URL lengkap, contoh: https://namabrand.com";
  if (f.instagramUrl && !isUrl(f.instagramUrl))
    e.instagramUrl = "Gunakan format URL lengkap, contoh: https://instagram.com/namabrand";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Format email tidak valid.";
  if (!f.picName.trim()) e.picName = "Nama penanggung jawab wajib diisi.";
  if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(f.picPhoneNumber.trim()))
    e.picPhoneNumber = "Format no. ponsel tidak valid. Contoh: 081234567890.";
  if (!f.officeAddress.trim()) e.officeAddress = "Alamat kantor wajib diisi.";
  if (!f.city.trim()) e.city = "Kota wajib diisi.";
  if (!f.province) e.province = "Pilih provinsi.";
  if (!/^\d{5}$/.test(f.postalCode)) e.postalCode = "Kode pos harus 5 digit angka.";
  if (!f.bankName) e.bankName = "Pilih bank.";
  if (!/^\d{6,30}$/.test(f.bankAccountNumber))
    e.bankAccountNumber = "Nomor rekening 6-30 digit angka.";
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

export default function OrganizerProfilePage() {
  const pathname = usePathname();

  /* ═══════════ BAGIAN 5: STATE ═══════════ */
  const [user, setUser] = useState<Organizer | null>(null); // data tersimpan
  const [f, setF] = useState<Organizer>(DEMO_ORGANIZER); // data yang sedang diketik
  const [isDemo, setIsDemo] = useState(false);
  const [wrongRole, setWrongRole] = useState(false);
  const [tab, setTab] = useState<"info" | "security">("info");
  const [editing, setEditing] = useState(false); // false = semua terkunci
  const [reveal, setReveal] = useState(false); // tampilkan data sensitif
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<Message>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* ═══════════ BAGIAN 6: useEffect (ambil data saat halaman dibuka) ═══════════ */
  useEffect(() => {
    const raw = readCurrentUser();
    if (raw && raw.role === "CUSTOMER") {
      setWrongRole(true); // halaman ini khusus organizer
      return;
    }
    const data = raw ? normalize(raw) : DEMO_ORGANIZER;
    setIsDemo(!raw);
    setUser(data);
    setF(data);
  }, []);

  /* ═══════════ BAGIAN 7: HANDLER (aksi saat tombol ditekan) ═══════════ */

  // Mengubah satu field di form sekaligus menghapus error field itu
  function set<K extends keyof Organizer>(key: K, value: Organizer[K]) {
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

  async function handleLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setMessage({ text: "File harus berupa gambar.", ok: false });
    if (file.size > 1024 * 1024)
      return setMessage({ text: "Ukuran logo maksimal 1 MB.", ok: false });
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

    const updated: Organizer = {
      ...f,
      email: f.email.trim(),
      organizerName: f.organizerName.trim(),
      picName: f.picName.trim(),
      picPhoneNumber: f.picPhoneNumber.trim(),
      officeAddress: f.officeAddress.trim(),
      city: f.city.trim(),
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
          error = "Penyimpanan penuh. Coba pakai logo yang lebih kecil.";
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

  /* ═══════════ BAGIAN 8: TAMPILAN (JSX) ═══════════ */

  // Akun customer tidak boleh membuka halaman organizer
  if (wrongRole) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p className="rounded-xl bg-amber-50 p-6 text-amber-800">
          Halaman ini khusus akun <b>Organizer</b>. Kamu masuk sebagai Customer.
        </p>
        <Link
          href={pathname.replace(/\/organizer$/, "/customer")}
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          Ke profil customer
        </Link>
      </div>
    );
  }

  // Skeleton loading
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-[32rem] animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
        </div>
      </div>
    );
  }

  const shown = (v: string) => (reveal ? v : maskValue(v)); // samarkan data sensitif
  const lockedHint = editing ? "Tidak bisa diubah." : undefined;
  const bankOptions = !f.bankName || BANKS.includes(f.bankName) ? BANKS : [f.bankName, ...BANKS];
  const initial = (f.organizerName || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* ── Judul + tombol Update Profile ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Profil Organizer</h1>
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

     
      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:space-y-0">
        {/* Kartu identitas */}
        <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5 lg:sticky lg:top-24 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xl font-bold text-gray-500">
              {f.profilePictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.profilePictureUrl} alt="Logo organizer" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{user.organizerName || "-"}</p>
              <p className="truncate text-sm text-gray-500">@{user.username || "-"}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t border-indigo-100 pt-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                Event Organizer
              </span>
              {user.organizerType && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                  {TYPE_LABEL[user.organizerType]}
                </span>
              )}
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">ID Akun</span>
              <span className="font-mono text-gray-700">{user.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Bergabung</span>
              <span className="text-gray-700">{user.createdAt ? formatDate(user.createdAt) : "-"}</span>
            </div>
          </div>

          <p className="mt-4 border-t border-indigo-100 pt-4 text-xs text-gray-500">
            Nama organizer, bio, dan tautan tampil di halaman publik organizer,
            bersama rating dan ulasan dari peserta.
          </p>
        </section>

        {/* Panel kanan: tab */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-md lg:col-span-2">
          <div role="tablist" className="flex border-b border-gray-200">
            {(
              [
                { key: "info", label: "Informasi Profil" },
                { key: "security", label: "Keamanan" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition-colors sm:flex-none sm:px-6 ${
                  tab === t.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Informasi Profil */}
          {tab === "info" && (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8">
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  {reveal ? "Sembunyikan data sensitif" : "Tampilkan data sensitif"}
                </button>
              </div>

              {/* fieldset disabled = satu atribut yang mengunci SEMUA input di dalamnya */}
              <fieldset disabled={!editing} className="min-w-0 space-y-8">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 lg:h-24 lg:w-24 lg:text-3xl">
                    {f.profilePictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.profilePictureUrl} alt="Logo organizer" className="h-full w-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  {editing && (
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Ganti logo
                        <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
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

                <Section title="Akun">
                  <Text id="username" label="Username" locked readOnly placeholder="-" value={f.username} hint={lockedHint} />
                  <Text
                    id="email" label="Email" type="email" maxLength={255} placeholder="-"
                    value={f.email} onChange={(e) => set("email", e.target.value)} error={errors.email}
                  />
                </Section>

                <Section title="Identitas Organizer">
                  <Text
                    id="organizerName" label="Nama Organizer / Brand" maxLength={150} placeholder="-"
                    className="md:col-span-2"
                    value={f.organizerName} onChange={(e) => set("organizerName", e.target.value)}
                    error={errors.organizerName}
                  />
                  <Text
                    id="organizerType" label="Jenis Organizer" locked readOnly placeholder="-"
                    value={f.organizerType ? TYPE_LABEL[f.organizerType] : ""} hint={lockedHint}
                  />
                  <Text
                    id="legalName" label="Nama Legal (sesuai NPWP / KTP)" locked readOnly placeholder="-"
                    value={f.legalName} hint={lockedHint}
                  />
                  <Field
                    id="organizerBio" label="Bio Organizer" className="md:col-span-2"
                    error={errors.organizerBio}
                    hint={editing ? `${f.organizerBio.length}/500 karakter` : undefined}
                  >
                    <textarea
                      id="organizerBio" rows={3} placeholder="-" value={f.organizerBio}
                      onChange={(e) => set("organizerBio", e.target.value)}
                      className={`${inputClass} ${errors.organizerBio ? "border-red-400" : ""}`}
                    />
                  </Field>
                  <Text
                    id="websiteUrl" label="Website" maxLength={255} inputMode="url" placeholder="-"
                    value={f.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)}
                    error={errors.websiteUrl}
                  />
                  <Text
                    id="instagramUrl" label="Instagram" maxLength={255} inputMode="url" placeholder="-"
                    value={f.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)}
                    error={errors.instagramUrl}
                  />
                </Section>

                <Section title="Legalitas">
                  <Text id="npwp" label="NPWP" locked readOnly placeholder="-" value={shown(f.npwp)} hint={lockedHint} />
                  <Text id="nib" label="NIB" locked readOnly placeholder="-" value={f.nib} hint={lockedHint} />
                  <Text
                    id="npwpImage" label="Dokumen NPWP" locked readOnly className="md:col-span-2"
                    value={f.npwpImageUrl || "Belum diunggah"}
                  />
                </Section>

                <Section title="Penanggung Jawab (PIC)">
                  <Text
                    id="picName" label="Nama Penanggung Jawab" maxLength={100} placeholder="-"
                    value={f.picName} onChange={(e) => set("picName", e.target.value)} error={errors.picName}
                  />
                  <Text
                    id="picPhoneNumber" label="No. Ponsel PIC" type="tel" inputMode="tel" maxLength={20} placeholder="-"
                    value={f.picPhoneNumber} onChange={(e) => set("picPhoneNumber", e.target.value)}
                    error={errors.picPhoneNumber}
                  />
                  <Text id="picNik" label="NIK (sesuai KTP)" locked readOnly placeholder="-" value={shown(f.picNik)} hint={lockedHint} />
                  <Text id="ktpImage" label="Dokumen KTP" locked readOnly value={f.picKtpImageUrl || "Belum diunggah"} />
                </Section>

                <Section title="Alamat Kantor">
                  <Field id="officeAddress" label="Alamat Lengkap" className="md:col-span-2" error={errors.officeAddress}>
                    <textarea
                      id="officeAddress" rows={3} maxLength={500} placeholder="-" value={f.officeAddress}
                      onChange={(e) => set("officeAddress", e.target.value)}
                      className={`${inputClass} ${errors.officeAddress ? "border-red-400" : ""}`}
                    />
                  </Field>
                  <Text
                    id="city" label="Kota / Kabupaten" maxLength={100} placeholder="-"
                    value={f.city} onChange={(e) => set("city", e.target.value)} error={errors.city}
                  />
                  <Field id="province" label="Provinsi" error={errors.province}>
                    <select
                      id="province" value={f.province}
                      onChange={(e) => set("province", e.target.value)}
                      className={`${inputClass} ${errors.province ? "border-red-400" : ""}`}
                    >
                      <option value="">{editing ? "Pilih provinsi" : "-"}</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Text
                    id="postalCode" label="Kode Pos" inputMode="numeric" placeholder="-"
                    value={f.postalCode} onChange={(e) => set("postalCode", onlyDigits(e.target.value, 5))}
                    error={errors.postalCode}
                  />
                </Section>

                <Section title="Rekening Pencairan Dana">
                  <Field id="bankName" label="Nama Bank" error={errors.bankName}>
                    <select
                      id="bankName" value={f.bankName}
                      onChange={(e) => set("bankName", e.target.value)}
                      className={`${inputClass} ${errors.bankName ? "border-red-400" : ""}`}
                    >
                      <option value="">{editing ? "Pilih bank" : "-"}</option>
                      {bankOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <Text
                    id="bankAccountNumber" label="Nomor Rekening" inputMode="numeric" placeholder="-"
                    value={editing ? f.bankAccountNumber : shown(f.bankAccountNumber)}
                    onChange={(e) => set("bankAccountNumber", onlyDigits(e.target.value, 30))}
                    error={errors.bankAccountNumber}
                  />
                  <Text
                    id="bankAccountHolder" label="Nama Pemilik Rekening" locked readOnly placeholder="-"
                    className="md:col-span-2" value={f.bankAccountHolder}
                    hint={editing ? "Tidak bisa diubah. Harus sama dengan nama legal." : undefined}
                  />
                </Section>
              </fieldset>

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

          {/* Tab Keamanan */}
          {tab === "security" && <PasswordTab userId={user.id} isDemo={isDemo} />}
        </div>
      </div>

      {/* Popup konfirmasi */}
      <ConfirmDialog
        open={showConfirm}
        title="Update profil?"
        message="Data profil organizer kamu akan diperbarui."
        confirmText="Ya, update"
        isLoading={isSaving}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}