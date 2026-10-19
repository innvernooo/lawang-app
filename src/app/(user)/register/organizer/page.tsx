"use client";

import {
  useState,
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";

/* ───────────── Konstanta ───────────── */

// Sesuaikan dengan enum OrganizerType di schema.prisma kalau nilainya berbeda
type OrganizerType = "INDIVIDUAL" | "COMPANY";

const ORGANIZER_TYPES: { value: OrganizerType; label: string; desc: string }[] = [
  { value: "INDIVIDUAL", label: "Perorangan", desc: "Penyelenggara atas nama pribadi" },
  { value: "COMPANY", label: "Perusahaan / Badan Usaha", desc: "PT, CV, atau badan usaha lain" },
];

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
  "Danamon", "BTN", "OCBC", "Bank Jago", "Lainnya",
];

const STEPS = [
  "Akun",
  "Organisasi & Legalitas",
  "Penanggung Jawab & Alamat",
  "Rekening & Konfirmasi",
];
const LAST = STEPS.length - 1;

// Akun contoh bawaan, dipakai untuk mengecek email/username yang sudah ada
const SEED_USERS: Record<string, unknown>[] = [
  { username: "budisantoso", email: "budi@email.com" },
  { username: "sinarevent", email: "sinar@email.com" },
];

/* ───────────── Helper ───────────── */

type AnyUser = Record<string, unknown>;

function readStoredUsers(): AnyUser[] {
  try {
    return JSON.parse(localStorage.getItem("users") ?? "[]");
  } catch {
    return [];
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v);

/* ───────────── Form & validasi ───────────── */

interface Form {
  email: string;
  username: string;
  password: string;
  confirm: string;
  organizerName: string;
  organizerType: OrganizerType | "";
  legalName: string;
  organizerBio: string;
  websiteUrl: string;
  instagramUrl: string;
  npwp: string;
  nib: string;
  picName: string;
  picNik: string;
  picPhoneNumber: string;
  officeAddress: string;
  city: string;
  province: string;
  postalCode: string;
  bankName: string;
  bankOther: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}

const INITIAL: Form = {
  email: "", username: "", password: "", confirm: "",
  organizerName: "", organizerType: "", legalName: "", organizerBio: "",
  websiteUrl: "", instagramUrl: "", npwp: "", nib: "",
  picName: "", picNik: "", picPhoneNumber: "",
  officeAddress: "", city: "", province: "", postalCode: "",
  bankName: "", bankOther: "", bankAccountNumber: "", bankAccountHolder: "",
};

type Errors = Record<string, string | undefined>;

// Dipakai untuk melompat ke langkah yang benar saat ada data ganda
const STEP_OF: Record<string, number> = { email: 0, username: 0, npwp: 1, nib: 1 };

function validate(step: number, f: Form, agree: boolean): Errors {
  const e: Errors = {};

  if (step === 0) {
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Format email tidak valid.";
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(f.username))
      e.username = "Username 4-20 karakter: huruf, angka, atau underscore.";
    if (f.password.length < 8) e.password = "Password minimal 8 karakter.";
    if (f.confirm !== f.password) e.confirm = "Konfirmasi password tidak sama.";
  }

  if (step === 1) {
    if (f.organizerName.trim().length < 3)
      e.organizerName = "Nama organizer minimal 3 karakter.";
    if (!f.organizerType) e.organizerType = "Pilih jenis organizer.";
    if (!f.legalName.trim()) e.legalName = "Nama legal wajib diisi.";
    if (f.organizerBio.length > 500) e.organizerBio = "Bio maksimal 500 karakter.";
    if (f.websiteUrl && !isUrl(f.websiteUrl))
      e.websiteUrl = "Gunakan format URL lengkap, contoh: https://namabrand.com";
    if (f.instagramUrl && !isUrl(f.instagramUrl))
      e.instagramUrl = "Gunakan format URL lengkap, contoh: https://instagram.com/namabrand";
    if (!/^\d{16}$/.test(f.npwp)) e.npwp = "NPWP harus 16 digit angka.";
    if (f.organizerType === "COMPANY" && !f.nib) e.nib = "NIB wajib diisi untuk perusahaan.";
    else if (f.nib && !/^\d{13}$/.test(f.nib)) e.nib = "NIB harus 13 digit angka.";
  }

  if (step === 2) {
    if (!f.picName.trim()) e.picName = "Nama penanggung jawab wajib diisi.";
    if (!/^\d{16}$/.test(f.picNik)) e.picNik = "NIK harus 16 digit angka.";
    if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(f.picPhoneNumber.trim()))
      e.picPhoneNumber = "Format no. ponsel tidak valid. Contoh: 081234567890.";
    if (!f.officeAddress.trim()) e.officeAddress = "Alamat kantor wajib diisi.";
    if (!f.city.trim()) e.city = "Kota wajib diisi.";
    if (!f.province) e.province = "Pilih provinsi.";
    if (!/^\d{5}$/.test(f.postalCode)) e.postalCode = "Kode pos harus 5 digit angka.";
  }

  if (step === 3) {
    if (!f.bankName) e.bankName = "Pilih bank.";
    if (f.bankName === "Lainnya" && !f.bankOther.trim())
      e.bankOther = "Tulis nama bank.";
    if (!/^\d{6,30}$/.test(f.bankAccountNumber))
      e.bankAccountNumber = "Nomor rekening 6-30 digit angka.";
    if (!f.bankAccountHolder.trim()) e.bankAccountHolder = "Nama pemilik rekening wajib diisi.";
    else if (normalize(f.bankAccountHolder) !== normalize(f.legalName))
      e.bankAccountHolder = "Nama pemilik rekening harus sama dengan nama legal.";
    if (!agree) e.agree = "Kamu harus menyetujui pernyataan ini.";
  }

  return e;
}

/* ───────────── Komponen kecil ───────────── */

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

function Box({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function TextField({
  id,
  label,
  error,
  hint,
  required,
  className,
  ...input
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Box id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <input
        id={id}
        {...input}
        className={`${inputClass} ${error ? "border-red-400" : ""}`}
      />
    </Box>
  );
}

function FileBox({
  id,
  label,
  hint,
  error,
  fileName,
  accept,
  onPick,
  onClear,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  fileName: string | null;
  accept: string;
  onPick: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <Box id={id} label={label} error={error} hint={hint}>
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={id}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Pilih file
        </label>
        <input id={id} type="file" accept={accept} onChange={onPick} className="hidden" />
        {fileName ? (
          <>
            <span className="max-w-[200px] truncate text-sm text-gray-600">{fileName}</span>
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-red-600 hover:underline"
            >
              Hapus
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-400">Belum ada file</span>
        )}
      </div>
    </Box>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-700">
      {children}
    </h2>
  );
}

/* ───────────── Halaman ───────────── */

export default function RegisterOrganizerPage() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [logo, setLogo] = useState<string | null>(null);
  const [npwpFile, setNpwpFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setF((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* Upload: logo disimpan sebagai data URL, dokumen hanya dicatat nama filenya.
     Upload sungguhan ke Supabase Storage dikerjakan saat backend digabung. */
  async function handleLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, logo: "File harus berupa gambar." }));
      return;
    }
    if (file.size > 1024 * 1024) {
      setErrors((p) => ({ ...p, logo: "Ukuran logo maksimal 1 MB." }));
      return;
    }
    setErrors((p) => ({ ...p, logo: undefined }));
    setLogo(await fileToDataUrl(file));
  }

 
     

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const stepErrors = validate(step, f, agree);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (step < LAST) {
      goTo(step + 1);
      return;
    }

    // Langkah terakhir: periksa ulang semua langkah
    for (let s = 0; s <= LAST; s++) {
      const er = validate(s, f, agree);
      if (Object.keys(er).length > 0) {
        setErrors(er);
        goTo(s);
        return;
      }
    }

    setIsLoading(true);
    await delay(1200); // simulasi menunggu backend

    // Cek data unik (di database nanti: @unique pada email, username, npwp, nib)
    const stored = readStoredUsers();
    const all = [...SEED_USERS, ...stored];
    const taken = (key: string, value: string) =>
      all.some((u) => String(u[key] ?? "").toLowerCase() === value.toLowerCase());

    const dup: Errors = {};
    if (taken("email", f.email.trim())) dup.email = "Email sudah terdaftar.";
    if (taken("username", f.username.trim())) dup.username = "Username sudah dipakai.";
    if (taken("npwp", f.npwp)) dup.npwp = "NPWP sudah terdaftar.";
    if (f.nib && taken("nib", f.nib)) dup.nib = "NIB sudah terdaftar.";

    if (Object.keys(dup).length > 0) {
      setErrors(dup);
      goTo(Math.min(...Object.keys(dup).map((k) => STEP_OF[k])));
      setIsLoading(false);
      return;
    }

    const bio = f.organizerBio.trim();
    const newUser = {
      id: crypto.randomUUID(),
      role: "ORGANIZER",
      email: f.email.trim(),
      username: f.username.trim(),
      password: f.password, // hanya untuk latihan; backend nanti menyimpan hash
      profilePictureUrl: logo,

      organizerName: f.organizerName.trim(),
      organizerType: f.organizerType,
      legalName: f.legalName.trim(),
      organizerBio: bio || null,
      websiteUrl: f.websiteUrl.trim() || null,
      instagramUrl: f.instagramUrl.trim() || null,

      npwp: f.npwp,
      npwpImageUrl: npwpFile?.name ?? null,
      nib: f.nib || null,

      picName: f.picName.trim(),
      picNik: f.picNik,
      picKtpImageUrl: ktpFile?.name ?? null,
      picPhoneNumber: f.picPhoneNumber.trim(),

      officeAddress: f.officeAddress.trim(),
      city: f.city.trim(),
      province: f.province,
      postalCode: f.postalCode,

      bankName: f.bankName === "Lainnya" ? f.bankOther.trim() : f.bankName,
      bankAccountNumber: f.bankAccountNumber,
      bankAccountHolder: f.bankAccountHolder.trim(),

      createdAt: new Date().toISOString(),

      // Alias supaya login, profil, dan dashboard yang sudah ada tetap berjalan
      name: f.picName.trim(),
      phone: f.picPhoneNumber.trim(),
      avatarUrl: logo,
      organizationName: f.organizerName.trim(),
      description: bio,
    };

    try {
      localStorage.setItem("users", JSON.stringify([...stored, newUser]));
    } catch {
      setFormError("Penyimpanan penuh. Coba pakai logo yang lebih kecil.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setDone(true);
  }

  /* ───── Tampilan sukses ───── */
  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md space-y-4 rounded-xl border border-gray-100 bg-white p-6 text-center shadow-md sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran berhasil!</h1>
          <p className="text-sm text-gray-600">
            Akun organizer <b>{f.organizerName}</b> sudah dibuat. Silakan masuk
            untuk mulai membuat event.
          </p>
          <Link
            href="/login"
            className="block rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Lanjut ke halaman login
          </Link>
        </div>
      </main>
    );
  }

  const isCompany = f.organizerType === "COMPANY";
  const legalLabel = isCompany
    ? "Nama Perusahaan (sesuai NPWP / Akta)"
    : "Nama Lengkap (sesuai KTP)";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-8 lg:p-10">
        <Link href="/register" className="text-sm text-purple-600 hover:underline">
          &larr; Ganti peran
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Daftar sebagai Organizer</h1>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            Organizer
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Buat, promosikan, dan kelola event kamu.
        </p>

        {/* Indikator langkah */}
        <ol className="mt-6 flex items-center gap-2">
          {STEPS.map((title, i) => (
            <li key={title} className="flex flex-1 items-center gap-2 last:flex-none">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  i < step
                    ? "bg-purple-600 text-white"
                    : i === step
                    ? "bg-purple-100 text-purple-700 ring-2 ring-purple-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span
                className={`hidden whitespace-nowrap text-xs font-medium lg:block ${
                  i === step ? "text-purple-700" : "text-gray-500"
                }`}
              >
                {title}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-gray-200" />}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-gray-500 lg:hidden">
          Langkah {step + 1} dari {STEPS.length}:{" "}
          <b className="text-gray-800">{STEPS[step]}</b>
        </p>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Mode latihan: gunakan data contoh, bukan NIK, NPWP, atau nomor rekening
          asli. Data hanya tersimpan di browser ini.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          {/* ───── Langkah 1: Akun ───── */}
          {step === 0 && (
            <>
              <div>
                <span className={labelClass}>Logo Organizer (opsional)</span>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt="Logo organizer" className="h-full w-full object-cover" />
                    ) : (
                      (f.organizerName.charAt(0) || f.username.charAt(0) || "?").toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Pilih logo
                      <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                    </label>
                    {logo && (
                      <button
                        type="button"
                        onClick={() => setLogo(null)}
                        className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
                {errors.logo ? (
                  <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Maksimal 1 MB (JPG/PNG).</p>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="email" label="Email" required type="email" maxLength={255}
                  value={f.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="organizer@email.com" autoComplete="email" error={errors.email}
                />
                <TextField
                  id="username" label="Username" required maxLength={50}
                  value={f.username} onChange={(e) => set("username", e.target.value)}
                  placeholder="sinarevent" autoComplete="username" error={errors.username}
                  hint="4-20 karakter: huruf, angka, atau underscore."
                />
                <Box id="password" label="Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={f.password}
                      onChange={(e) => set("password", e.target.value)}
                      autoComplete="new-password"
                      className={`${inputClass} pr-16 ${errors.password ? "border-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
                    >
                      {showPassword ? "Sembunyikan" : "Lihat"}
                    </button>
                  </div>
                </Box>
                <TextField
                  id="confirm" label="Konfirmasi Password" required
                  type={showPassword ? "text" : "password"}
                  value={f.confirm} onChange={(e) => set("confirm", e.target.value)}
                  autoComplete="new-password" error={errors.confirm}
                />
              </div>
            </>
          )}

          {/* ───── Langkah 2: Organisasi & Legalitas ───── */}
          {step === 1 && (
            <>
              <SectionTitle>Identitas Organizer</SectionTitle>

              <TextField
                id="organizerName" label="Nama Organizer / Brand" required maxLength={150}
                value={f.organizerName} onChange={(e) => set("organizerName", e.target.value)}
                placeholder="Sinar Event Organizer" error={errors.organizerName}
                hint="Nama ini yang tampil di setiap event kamu."
              />

              <fieldset>
                <legend className={labelClass}>
                  Jenis Organizer<span className="text-red-500"> *</span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ORGANIZER_TYPES.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-lg border p-3 text-sm ${
                        f.organizerType === opt.value
                          ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio" name="organizerType" value={opt.value}
                        checked={f.organizerType === opt.value}
                        onChange={() => set("organizerType", opt.value)}
                        className="sr-only"
                      />
                      <span className="block font-semibold text-gray-900">{opt.label}</span>
                      <span className="block text-xs text-gray-500">{opt.desc}</span>
                    </label>
                  ))}
                </div>
                {errors.organizerType && (
                  <p className="mt-1 text-sm text-red-600">{errors.organizerType}</p>
                )}
              </fieldset>

              <TextField
                id="legalName" label={legalLabel} required maxLength={200}
                value={f.legalName} onChange={(e) => set("legalName", e.target.value)}
                error={errors.legalName}
                hint={
                  f.organizerType
                    ? undefined
                    : "Pilih jenis organizer dulu agar labelnya sesuai."
                }
              />

              <Box
                id="organizerBio" label="Bio Organizer (opsional)"
                error={errors.organizerBio} hint={`${f.organizerBio.length}/500 karakter`}
              >
                <textarea
                  id="organizerBio" rows={3} value={f.organizerBio}
                  onChange={(e) => set("organizerBio", e.target.value)}
                  placeholder="Ceritakan singkat tentang organizer kamu"
                  className={`${inputClass} ${errors.organizerBio ? "border-red-400" : ""}`}
                />
              </Box>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="websiteUrl" label="Website (opsional)" maxLength={255} inputMode="url"
                  value={f.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)}
                  placeholder="https://namabrand.com" error={errors.websiteUrl}
                />
                <TextField
                  id="instagramUrl" label="Instagram (opsional)" maxLength={255} inputMode="url"
                  value={f.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/namabrand" error={errors.instagramUrl}
                />
              </div>

              <SectionTitle>Legalitas</SectionTitle>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="npwp" label="NPWP" required inputMode="numeric"
                  value={f.npwp} onChange={(e) => set("npwp", onlyDigits(e.target.value, 16))}
                  placeholder="16 digit, tanpa titik/strip" error={errors.npwp}
                  hint={`${f.npwp.length}/16 digit`}
                />
                <TextField
                  id="nib" label="NIB" required={isCompany} inputMode="numeric"
                  value={f.nib} onChange={(e) => set("nib", onlyDigits(e.target.value, 13))}
                  placeholder="13 digit" error={errors.nib}
                  hint={isCompany ? "Wajib untuk perusahaan (13 digit)." : "Opsional untuk perorangan."}
                />
              </div>

             
              
            </>
          )}

          {/* ───── Langkah 3: Penanggung Jawab & Alamat ───── */}
          {step === 2 && (
            <>
              <SectionTitle>Penanggung Jawab (PIC)</SectionTitle>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="picName" label="Nama Penanggung Jawab" required maxLength={100}
                  value={f.picName} onChange={(e) => set("picName", e.target.value)}
                  placeholder="Sinta Dewi" error={errors.picName}
                />
                <TextField
                  id="picPhoneNumber" label="No. Ponsel PIC" required type="tel"
                  inputMode="tel" maxLength={20}
                  value={f.picPhoneNumber}
                  onChange={(e) => set("picPhoneNumber", e.target.value)}
                  placeholder="081234567890" error={errors.picPhoneNumber}
                />
                <TextField
                  id="picNik" label="NIK (sesuai KTP)" required inputMode="numeric"
                  value={f.picNik} onChange={(e) => set("picNik", onlyDigits(e.target.value, 16))}
                  placeholder="16 digit" error={errors.picNik}
                  hint={`${f.picNik.length}/16 digit`}
                />
               
              </div>

              <SectionTitle>Alamat Kantor</SectionTitle>

              <Box id="officeAddress" label="Alamat Lengkap" required error={errors.officeAddress}>
                <textarea
                  id="officeAddress" rows={3} maxLength={500} value={f.officeAddress}
                  onChange={(e) => set("officeAddress", e.target.value)}
                  placeholder="Jl. Contoh No. 10, Kelurahan, Kecamatan"
                  className={`${inputClass} ${errors.officeAddress ? "border-red-400" : ""}`}
                />
              </Box>

              <div className="grid gap-5 md:grid-cols-3">
                <TextField
                  id="city" label="Kota / Kabupaten" required maxLength={100}
                  value={f.city} onChange={(e) => set("city", e.target.value)}
                  placeholder="Jakarta Selatan" error={errors.city}
                />
                <Box id="province" label="Provinsi" required error={errors.province}>
                  <select
                    id="province" value={f.province}
                    onChange={(e) => set("province", e.target.value)}
                    className={`${inputClass} ${errors.province ? "border-red-400" : ""}`}
                  >
                    <option value="">Pilih provinsi</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Box>
                <TextField
                  id="postalCode" label="Kode Pos" required inputMode="numeric"
                  value={f.postalCode} onChange={(e) => set("postalCode", onlyDigits(e.target.value, 5))}
                  placeholder="12345" error={errors.postalCode}
                />
              </div>
            </>
          )}

          {/* ───── Langkah 4: Rekening & Konfirmasi ───── */}
          {step === 3 && (
            <>
              <SectionTitle>Rekening Pencairan Dana</SectionTitle>

              <div className="grid gap-5 md:grid-cols-2">
                <Box id="bankName" label="Nama Bank" required error={errors.bankName}>
                  <select
                    id="bankName" value={f.bankName}
                    onChange={(e) => set("bankName", e.target.value)}
                    className={`${inputClass} ${errors.bankName ? "border-red-400" : ""}`}
                  >
                    <option value="">Pilih bank</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Box>

                {f.bankName === "Lainnya" ? (
                  <TextField
                    id="bankOther" label="Tulis Nama Bank" required maxLength={100}
                    value={f.bankOther} onChange={(e) => set("bankOther", e.target.value)}
                    error={errors.bankOther}
                  />
                ) : (
                  <div className="hidden md:block" />
                )}

                <TextField
                  id="bankAccountNumber" label="Nomor Rekening" required inputMode="numeric"
                  value={f.bankAccountNumber}
                  onChange={(e) => set("bankAccountNumber", onlyDigits(e.target.value, 30))}
                  placeholder="1234567890" error={errors.bankAccountNumber}
                />

                <div>
                  <TextField
                    id="bankAccountHolder" label="Nama Pemilik Rekening" required maxLength={150}
                    value={f.bankAccountHolder}
                    onChange={(e) => set("bankAccountHolder", e.target.value)}
                    error={errors.bankAccountHolder}
                    hint="Harus sama dengan nama legal."
                  />
                  {f.legalName && (
                    <button
                      type="button"
                      onClick={() => set("bankAccountHolder", f.legalName)}
                      className="mt-1 text-xs font-medium text-purple-600 hover:underline"
                    >
                      Samakan dengan: {f.legalName}
                    </button>
                  )}
                </div>
              </div>

              {/* Ringkasan data */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                <p className="font-semibold text-gray-900">Ringkasan pendaftaran</p>
                <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {[
                    ["Username", f.username],
                    ["Email", f.email],
                    ["Organizer", f.organizerName],
                    ["Jenis", ORGANIZER_TYPES.find((t) => t.value === f.organizerType)?.label ?? "-"],
                    ["Nama legal", f.legalName],
                    ["Penanggung jawab", f.picName],
                    ["Kota", `${f.city}, ${f.province}`],
                    ["Rekening", `${f.bankName === "Lainnya" ? f.bankOther : f.bankName} · ${f.bankAccountNumber}`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-gray-500">{k}</dt>
                      <dd className="break-words text-gray-800">{v || "-"}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox" checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      setErrors((p) => ({ ...p, agree: undefined }));
                    }}
                    className="mt-0.5 h-4 w-4 accent-purple-600"
                  />
                  Saya menyatakan data yang diisi benar dan dapat dipertanggungjawabkan.
                </label>
                {errors.agree && <p className="mt-1 text-sm text-red-600">{errors.agree}</p>}
              </div>

              {formError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>
              )}
            </>
          )}

          {/* Tombol navigasi */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {step < LAST ? "Lanjut" : isLoading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-purple-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}