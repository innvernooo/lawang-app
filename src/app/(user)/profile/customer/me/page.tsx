'use client';

import { useState, InputHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { useGetCustomerData } from '@/hook/customer/useGetCustomerData';
import IsLoading from '@/features/general/components/isLoadingImage';
import { tanggal } from '@/utils/localDate';

const COUNTRIES = [
  'Indonesia',
  'Malaysia',
  'Singapura',
  'Brunei Darussalam',
  'Thailand',
  'Filipina',
  'Vietnam',
  'Jepang',
  'Korea Selatan',
  'Tiongkok',
  'India',
  'Australia',
  'Amerika Serikat',
  'Inggris',
  'Jerman',
  'Belanda',
  'Arab Saudi',
  'Negara lainnya',
];

/* --- Kelas Tailwind bersama --- */

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 [color-scheme:light] disabled:cursor-default disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700';
const lockedClass =
  'w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 placeholder-gray-400';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

/* --- Komponen tampilan --- */

// Pembungkus label + isi field
function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Input teks dengan label. locked = true: tampil abu-abu dan tidak bisa diubah.
function Text({
  id,
  label,
  locked,
  className,
  ...input
}: {
  id: string;
  label: string;
  locked?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field id={id} label={label} className={className}>
      <input
        id={id}
        {...input}
        disabled={locked || input.disabled}
        className={locked ? lockedClass : inputClass}
      />
    </Field>
  );
}

// Kelompok field dengan judul, tersusun dua kolom di layar lebar
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

// Tab "Keamanan": ganti password + tautan reset password lewat email
function PasswordTab() {
  return (
    <form className="space-y-5 p-5 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Ganti Kata Sandi</h2>
        <p className="text-sm text-gray-500">
          Gunakan kata sandi minimal 8 karakter yang belum pernah kamu pakai.
        </p>
      </div>

      <Text
        id="currentPw"
        label="Kata Sandi Saat Ini"
        type="password"
        autoComplete="current-password"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Text
          id="newPw"
          label="Kata Sandi Baru"
          type="password"
          autoComplete="new-password"
        />
        <Text
          id="confirmPw"
          label="Konfirmasi Kata Sandi Baru"
          type="password"
          autoComplete="new-password"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" className="h-4 w-4 accent-indigo-600" />
        Tampilkan kata sandi
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 sm:w-auto sm:px-6"
        >
          Ubah Kata Sandi
        </button>
        <Link
          href="/forgot-password"
          className="text-sm text-indigo-600 hover:underline"
        >
          Lupa kata sandi saat ini? Atur ulang lewat email
        </Link>
      </div>
    </form>
  );
}

export default function CustomerProfilePage() {
  // Hanya untuk berpindah tab (tampilan), bukan data
  const [tab, setTab] = useState<'info' | 'rewards' | 'security'>('info');
  const { data: customer, isLoading } = useGetCustomerData();

  if (isLoading) return <IsLoading />;
  console.log(customer);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      {/* ── Judul + tombol Update Profile ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Profil Saya
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Klik Perbarui Profil untuk mengubahnya.
          </p>
        </div>
        {tab === 'info' && (
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Perbarui Profil
          </button>
        )}
      </div>

      {/* ── Grid: kartu identitas (kiri) + panel tab (kanan) ── */}
      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:space-y-0">
        {/* Kartu identitas + kode referral */}
        <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5 lg:sticky lg:top-8 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xl font-bold text-gray-500">
              <img
                src={customer.profilePictureUrl ?? '/cus.svg'}
                alt={customer.name}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {customer.name}
              </p>
              <p className="truncate text-sm text-gray-500">
                @{customer.username}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t border-indigo-100 pt-4 text-sm">
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Customer
            </span>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Bergabung</span>
              <span className="text-gray-700">
                {tanggal.format(new Date(customer.createdAt))}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-indigo-100 pt-4">
            <p className="text-sm text-gray-600">Kode referral kamu</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="text-xl font-bold tracking-widest text-indigo-700">
                {customer.referralCode}
              </span>
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                Salin
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Kode ini permanen dan tidak bisa diubah. Bagikan ke teman, dan
              kamu mendapat 10.000 poin untuk setiap pendaftar baru.
            </p>
          </div>
        </section>

        {/* Panel kanan: tab */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-md lg:col-span-2">
          <div
            role="tablist"
            className="flex overflow-x-auto border-b border-gray-200"
          >
            {(
              [
                { key: 'info', label: 'Informasi Profil' },
                { key: 'rewards', label: 'Poin & Kupon' },
                { key: 'security', label: 'Keamanan' },
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
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab Informasi Profil ── */}
          {tab === 'info' && (
            <form className="p-5 sm:p-6 lg:p-8">
              <fieldset className="min-w-0 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 lg:h-24 lg:w-24 lg:text-3xl">
                    <img
                      src={customer.profilePictureUrl ?? '/cus.svg'}
                      alt={customer.name}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Ganti foto
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>

                <Section title="Data Akun">
                  <Text
                    id="username"
                    label="Nama Pengguna"
                    locked
                    readOnly
                    placeholder={customer.username}
                  />
                  <Text
                    id="role"
                    label="Jenis Akun"
                    locked
                    readOnly
                    placeholder={customer.role === 'CUSTOMER' ? 'Customer' : customer.role}
                  />
                  <Text
                    id="email"
                    label="Email"
                    type="email"
                    maxLength={255}
                    disabled
                    placeholder={customer.email}
                  />
                  <Text
                    id="phoneNumber"
                    label="No. Ponsel"
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    disabled
                    placeholder={customer.phoneNumber}
                  />
                </Section>

                <Section title="Data Diri">
                  <Text
                    id="fullName"
                    label="Nama Lengkap"
                    maxLength={150}
                    placeholder={customer.name}
                    disabled
                    className="md:col-span-2"
                  />
                  <Text
                    id="nik"
                    label="NIK (opsional)"
                    inputMode="numeric"
                    maxLength={16}
                    disabled
                    placeholder={customer.nik}
                  />
                  <Field id="country" label="Negara">
                    <select id="country" defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        -
                      </option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Jenis kelamin */}
                  <fieldset className="md:col-span-2">
                    <legend className={labelClass}>Jenis Kelamin</legend>
                    <div className="flex gap-6">
                      {(
                        [
                          { value: 'MALE', label: 'Laki-laki' },
                          { value: 'FEMALE', label: 'Perempuan' },
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
                            className="h-4 w-4 accent-indigo-600"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </Section>
              </fieldset>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Perbarui Profil
                </button>
              </div>
            </form>
          )}

          {/* ── Tab Poin & Kupon ── */}
          {tab === 'rewards' && (
            <div className="space-y-8 p-5 sm:p-6 lg:p-8">
              {/* Saldo poin aktif */}
              <div className="rounded-xl bg-indigo-600 p-5 text-white">
                <p className="text-sm text-indigo-100">Saldo poin aktif</p>
                <p className="text-3xl font-bold">{/* jumlah poin */} poin</p>
                <p className="mt-1 text-xs text-indigo-100">
                  Poin berlaku 3 bulan sejak diterima. Poin yang kedaluwarsa
                  tidak dihitung.
                </p>
              </div>

              {/* Riwayat poin: satu <li> di bawah adalah contoh baris, nanti di-map dari data */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Riwayat Poin
                </h2>
                <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                  <li className="flex flex-wrap items-center justify-between gap-2 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        +{/* jumlah */} poin
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* keterangan */} · diterima {/* tanggal */}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {/* status */}
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        s.d. {/* tanggal kedaluwarsa */}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Kupon diskon: satu <li> di bawah adalah contoh kartu, nanti di-map dari data */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Kupon Diskon
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  <li className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-2xl font-bold text-indigo-700">
                        {/* diskon */}
                      </p>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {/* status */}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {/* judul kupon */}
                    </p>
                    <p className="font-mono text-xs text-gray-600">
                      {/* kode kupon */}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Berlaku s.d. {/* tanggal kedaluwarsa */}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Tab Keamanan ── */}
          {tab === 'security' && <PasswordTab />}
        </div>
      </div>
    </main>
  );
}
