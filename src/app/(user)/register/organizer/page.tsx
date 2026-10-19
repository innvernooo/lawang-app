'use client';

import { isAxiosError } from 'axios';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import PopoverFailed from '@/features/register/components/popoverFailed';
import PopoverSuccess from '@/features/register/components/popoverSuccess';
import {
  OrganizerRegisterInput,
  OrganizerRegisterOutput,
  organizerRegisterSchema,
} from '@/features/register/validation/organizerSchema';
import { sortedCities } from '@/components/cities';
import { sortedProvinces } from '@/components/provinces';
import { sortedBanks } from '@/components/banks';
import { stepFields } from '@/features/register/organizerRegister/validationStep';
import { RegisterOrganizer } from '@/features/register/organizerRegister/organizerFormData';

// Class TailwindCSS
const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';
const errorClass = 'label text-xs text-red-600';
const sectionTitleClass =
  'text-sm font-semibold uppercase tracking-wide text-purple-700';

const organizerTypeOptions = [
  {
    value: 'INDIVIDUAL',
    title: 'Perorangan',
    desc: 'Penyelenggara atas nama pribadi',
  },
  {
    value: 'COMPANY',
    title: 'Perusahaan / Badan Usaha',
    desc: 'PT, CV, atau badan usaha lain',
  },
];

const steps = [
  'Akun',
  'Organisasi & Legalitas',
  'Penanggung Jawab & Alamat',
  'Rekening & Konfirmasi',
];
const lastStep = steps.length - 1;

export default function OrganizerRegister() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [failedMessage, setFailedMessgae] = useState('');
  const successRef = useRef<HTMLDialogElement>(null);
  const failedRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getValues,
    setError,
    control,
    formState: { errors },
  } = useForm<OrganizerRegisterInput, unknown, OrganizerRegisterOutput>({
    resolver: zodResolver(organizerRegisterSchema),
  });

  const agree = useWatch({ control, name: 'agree' });

  const profilePicture = useWatch({ control, name: 'profilePicture' });
  const previewPicture = useMemo(
    () =>
      profilePicture?.length ? URL.createObjectURL(profilePicture[0]) : null,
    [profilePicture],
  );

  useEffect(() => {
    return () => {
      if (previewPicture) URL.revokeObjectURL(previewPicture);
    };
  }, [previewPicture]);

  async function goNext() {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (!valid) return;

    if (step === 0 && getValues('password') !== getValues('confirmPassword')) {
      setError('confirmPassword', {
        message: 'Konfirmasi password tidak sama',
      });
      return;
    }

    goTo(step + 1);
  }

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const stepClass = (n: number) => (step === n ? 'space-y-5' : 'hidden');

  const handleOrganizerRegister = useMutation({
    mutationFn: RegisterOrganizer,
    onSuccess: () => {
      successRef?.current?.showModal();
      reset();
    },
    onError: (error) => {
      setFailedMessgae(
        isAxiosError(error)
          ? (error?.response?.data?.message ??
              'Tidak dapat terhubung ke server')
          : 'Terjasi kesalahan',
      );
      failedRef?.current?.showModal();
    },
  });

  return (
    <>
      <PopoverFailed
        ref={failedRef}
        title="Akun Gagal Terdaftar"
        message={failedMessage}
      />
      <PopoverSuccess
        ref={successRef}
        title="Akun Berhasil Terdaftar"
        message="Klik tombol berikut untuk lanjut ke halaman login"
      />
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-8 md:max-w-2xl lg:max-w-3xl lg:p-10">
          <Link
            href="/register"
            className="text-sm text-purple-600 hover:underline"
          >
            &larr; Ganti peran
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Daftar sebagai Organizer
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Buat, promosikan, dan kelola event kamu.
          </p>

          {/* Indikator langkah */}
          <ol className="mt-6 flex items-center gap-2">
            {steps.map((title, i) => (
              <li
                key={title}
                className="flex flex-1 items-center gap-2 last:flex-none"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    i < step
                      ? 'bg-purple-600 text-white'
                      : i === step
                        ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span
                  className={`hidden whitespace-nowrap text-xs font-medium lg:block ${
                    i === step ? 'text-purple-700' : 'text-gray-500'
                  }`}
                >
                  {title}
                </span>
                {i < steps.length - 1 && (
                  <span className="h-px flex-1 bg-gray-200" />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-gray-500 lg:hidden">
            Langkah {step + 1} dari {steps.length}:{' '}
            <b className="text-gray-800">{steps[step]}</b>
          </p>

          {/* Hubungkan ke react-hook-form + useMutation seperti di register/customer/page.tsx */}
          {/* Sementara: cegah reload halaman. Ganti dengan handleSubmit(...) dari react-hook-form */}
          <form
            noValidate
            onSubmit={handleSubmit((data) =>
              handleOrganizerRegister.mutate(data),
            )}
            className="mt-6 space-y-6"
          >
            {/* ───── Langkah 1: Akun ───── */}
            <div className={stepClass(0)}>
              <div>
                <span className={labelClass}>Logo Organizer (opsional)</span>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 sm:h-20 sm:w-20">
                    {previewPicture ? (
                      <img
                        src={previewPicture}
                        alt="Foto profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      '?'
                    )}
                  </div>
                  <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-purple-400">
                    Pilih logo
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="sr-only"
                      {...register('profilePicture')}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Maksimal 5 MB (JPG/PNG/WEBP).
                </p>
                <p className={errorClass}>{errors?.profilePicture?.message}</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="organizer@email.com"
                    autoComplete="email"
                    className={inputClass}
                    {...register('email')}
                  />
                  <p className={errorClass}>{errors?.email?.message}</p>
                </div>

                <div>
                  <label htmlFor="username" className={labelClass}>
                    Username
                  </label>
                  <input
                    id="username"
                    placeholder="sinarevent"
                    autoComplete="username"
                    className={inputClass}
                    {...register('username')}
                  />
                  <p className={errorClass}>{errors?.username?.message}</p>
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`${inputClass} pr-10`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-purple-600 focus-visible:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  <p className={errorClass}>{errors?.password?.message}</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`${inputClass} pr-10`}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-purple-600 focus-visible:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  <p className={errorClass}>
                    {errors?.confirmPassword?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* ───── Langkah 2: Organisasi & Legalitas ───── */}
            <div className={stepClass(1)}>
              <h2 className={sectionTitleClass}>Identitas Organizer</h2>

              <div>
                <label htmlFor="organizerName" className={labelClass}>
                  Nama Organizer / Brand
                </label>
                <input
                  id="organizerName"
                  placeholder="Sinar Event Organizer"
                  className={inputClass}
                  {...register('organizerName')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Nama ini yang tampil di setiap event kamu.
                </p>
                <p className={errorClass}>{errors?.organizerName?.message}</p>
              </div>
              <fieldset>
                <legend className={labelClass}>Jenis Organizer</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {organizerTypeOptions.map((opt) => (
                    <label
                      key={opt.value}
                      htmlFor={`organizerType-${opt.value.toLowerCase()}`}
                      className="cursor-pointer rounded-lg border border-gray-300 p-3 text-sm hover:bg-gray-50 has-checked:border-purple-600 has-checked:bg-purple-50 has-checked:ring-2 has-checked:ring-purple-200 has-focus-visible:ring-2 has-focus-visible:ring-purple-400"
                    >
                      <input
                        id={`organizerType-${opt.value.toLowerCase()}`}
                        type="radio"
                        value={opt.value}
                        className="sr-only"
                        {...register('organizerType')}
                      />
                      <span className="block font-semibold text-gray-900">
                        {opt.title}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {opt.desc}
                      </span>
                    </label>
                  ))}
                </div>
                <p className={errorClass}>{errors?.organizerType?.message}</p>
              </fieldset>

              <div>
                <label htmlFor="legalName" className={labelClass}>
                  Nama Legal
                </label>
                <input
                  id="legalName"
                  className={inputClass}
                  {...register('legalName')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Perusahaan: sesuai NPWP / akta. Perorangan: sesuai KTP.
                </p>
                <p className={errorClass}>{errors?.legalName?.message}</p>
              </div>

              <div>
                <label htmlFor="organizerBio" className={labelClass}>
                  Bio Organizer (opsional)
                </label>
                <textarea
                  id="organizerBio"
                  rows={3}
                  placeholder="Ceritakan singkat tentang organizer kamu"
                  className={inputClass}
                  {...register('organizerBio')}
                />
                <p className={errorClass}>{errors?.organizerBio?.message}</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="websiteUrl" className={labelClass}>
                    Website (opsional)
                  </label>
                  <input
                    id="websiteUrl"
                    type="url"
                    inputMode="url"
                    placeholder="https://namabrand.com"
                    className={inputClass}
                    {...register('websiteUrl')}
                  />
                  <p className={errorClass}>{errors?.websiteUrl?.message}</p>
                </div>

                <div>
                  <label htmlFor="instagramUrl" className={labelClass}>
                    Instagram (opsional)
                  </label>
                  <input
                    id="instagramUrl"
                    type="url"
                    inputMode="url"
                    placeholder="https://instagram.com/namabrand"
                    className={inputClass}
                    {...register('instagramUrl')}
                  />
                  <p className={errorClass}>{errors?.instagramUrl?.message}</p>
                </div>
              </div>

              <h2 className={sectionTitleClass}>Legalitas</h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="npwp" className={labelClass}>
                    NPWP
                  </label>
                  <input
                    id="npwp"
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="16 digit, tanpa titik/strip"
                    className={inputClass}
                    {...register('npwp')}
                  />
                  <p className={errorClass}>{errors?.npwp?.message}</p>
                </div>

                <div>
                  <label htmlFor="nib" className={labelClass}>
                    NIB
                  </label>
                  <input
                    id="nib"
                    inputMode="numeric"
                    maxLength={13}
                    placeholder="13 digit"
                    className={inputClass}
                    {...register('nib')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Wajib untuk perusahaan, opsional untuk perorangan.
                  </p>
                  <p className={errorClass}>{errors?.nib?.message}</p>
                </div>
              </div>
            </div>

            {/* ───── Langkah 3: Penanggung Jawab & Alamat ───── */}
            <div className={stepClass(2)}>
              <h2 className={sectionTitleClass}>Penanggung Jawab (PIC)</h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="picName" className={labelClass}>
                    Nama Penanggung Jawab
                  </label>
                  <input
                    id="picName"
                    placeholder="Sinta Dewi"
                    className={inputClass}
                    {...register('picName')}
                  />
                  <p className={errorClass}>{errors?.picName?.message}</p>
                </div>

                <div>
                  <label htmlFor="picPhoneNumber" className={labelClass}>
                    No. Ponsel PIC
                  </label>
                  <input
                    id="picPhoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="081234567890"
                    autoComplete="tel"
                    className={inputClass}
                    {...register('picPhoneNumber')}
                  />
                  <p className={errorClass}>
                    {errors?.picPhoneNumber?.message}
                  </p>
                </div>

                <div>
                  <label htmlFor="picNik" className={labelClass}>
                    NIK (sesuai KTP)
                  </label>
                  <input
                    id="picNik"
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="3171234567890001"
                    autoComplete="off"
                    className={inputClass}
                    {...register('picNik')}
                  />
                  <p className={errorClass}>{errors?.picNik?.message}</p>
                </div>
              </div>

              <h2 className={sectionTitleClass}>Alamat Kantor</h2>

              <div>
                <label htmlFor="officeAddress" className={labelClass}>
                  Alamat Lengkap
                </label>
                <textarea
                  id="officeAddress"
                  rows={3}
                  placeholder="Jl. Contoh No. 10, Kelurahan, Kecamatan"
                  className={inputClass}
                  {...register('officeAddress')}
                />
                <p className={errorClass}>{errors?.officeAddress?.message}</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="city" className={labelClass}>
                    Kota
                  </label>
                  <select
                    id="city"
                    defaultValue=""
                    className={inputClass}
                    {...register('city')}
                  >
                    <option value="" disabled>
                      Pilih kota
                    </option>
                    {sortedCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <p className={errorClass}>{errors?.city?.message}</p>
                </div>

                <div>
                  <label htmlFor="province" className={labelClass}>
                    Provinsi
                  </label>
                  <select
                    id="province"
                    defaultValue=""
                    className={inputClass}
                    {...register('province')}
                  >
                    <option value="" disabled>
                      Pilih provinsi
                    </option>
                    {sortedProvinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  <p className={errorClass}>{errors?.province?.message}</p>
                </div>

                <div>
                  <label htmlFor="postalCode" className={labelClass}>
                    Kode Pos
                  </label>
                  <input
                    id="postalCode"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="12345"
                    className={inputClass}
                    {...register('postalCode')}
                  />
                  <p className={errorClass}>{errors?.postalCode?.message}</p>
                </div>
              </div>
            </div>

            {/* ───── Langkah 4: Rekening & Konfirmasi ───── */}
            <div className={stepClass(3)}>
              <h2 className={sectionTitleClass}>Rekening Pencairan Dana</h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="bankName" className={labelClass}>
                    Nama Bank
                  </label>
                  <select
                    id="bankName"
                    defaultValue=""
                    className={inputClass}
                    {...register('bankName')}
                  >
                    <option value="" disabled>
                      Pilih bank
                    </option>
                    {sortedBanks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <p className={errorClass}>{errors?.bankName?.message}</p>
                </div>

                <div>
                  <label htmlFor="bankAccountNumber" className={labelClass}>
                    Nomor Rekening
                  </label>
                  <input
                    id="bankAccountNumber"
                    inputMode="numeric"
                    maxLength={30}
                    placeholder="1234567890"
                    className={inputClass}
                    {...register('bankAccountNumber')}
                  />
                  <p className={errorClass}>
                    {errors?.bankAccountNumber?.message}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bankAccountHolder" className={labelClass}>
                    Nama Pemilik Rekening
                  </label>
                  <input
                    id="bankAccountHolder"
                    className={inputClass}
                    {...register('bankAccountHolder')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Harus sama dengan nama legal.
                  </p>
                  <p className={errorClass}>
                    {errors?.bankAccountHolder?.message}
                  </p>
                </div>
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                  <input
                    id="agree"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-purple-600"
                    {...register('agree')}
                  />
                  Saya menyatakan data yang diisi benar dan dapat
                  dipertanggungjawabkan.
                </label>
                <p className={errorClass}>{errors?.agree?.message}</p>
              </div>
            </div>

            {/* Tombol navigasi */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Kembali
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              {step < lastStep ? (
                <button
                  key="next"
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  key="submit"
                  type="submit"
                  disabled={!agree || handleOrganizerRegister.isPending}
                  className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  Daftar Sekarang
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
