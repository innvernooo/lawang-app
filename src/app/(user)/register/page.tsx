'use client';

import { useRef } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import {
  RegisterInput,
  RegisterRequest,
  registerSchema,
} from '@/features/register/validation/customerSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import PopoverFailed from '@/features/register/components/popoverFailed';
import PopoverSuccess from '@/features/register/components/popoverSuccess';

// Class TailwindCSS
const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

// Untuk box roles
const roleOptions = [
  { value: 'CUSTOMER', title: 'Customer', desc: 'Beli tiket event' },
  { value: 'ORGANIZER', title: 'Organizer', desc: 'Buat & kelola event' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const successRef = useRef<HTMLDialogElement>(null);
  const failedRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput, unknown, RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterUser = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.role) formData.append('role', data.role);
      if (data.role !== 'ORGANIZER' && data.referralCode)
        formData.append('referralCode', data.referralCode);
      if (data.profilePictureUrl?.length)
        formData.append('profilePicture', data.profilePictureUrl[0]);

      const res = await axiosInstance.post('/users/register', formData);
      return res?.data;
    },
    onSuccess: () => {
      successRef.current?.showModal();
      reset();
    },
    onError: () => failedRef.current?.showModal(),
  });

  return (
    <>
      <PopoverFailed
        ref={failedRef}
        title="Akun Gagal Terdaftar"
        message="Email atau username sudah terdaftar"
      />
      <PopoverSuccess
        ref={successRef}
        title="Akun Berhasil Terdaftar"
        message="Klik tombol berikut untuk lanjut ke halaman login"
      />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-8 md:max-w-2xl">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Buat Akun
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Daftar untuk mulai membeli tiket atau membuat event.
          </p>

          {/* `group` dipakai agar input referral bisa disembunyikan lewat CSS
            saat radio Organizer terpilih (group-has-[#role-organizer:checked]) */}
          <form
            onSubmit={handleSubmit((data) => handleRegisterUser.mutate(data))}
            noValidate
            className="group mt-6 space-y-5"
          >
            <fieldset>
              <legend className={labelClass}>Daftar sebagai</legend>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((opt) => (
                  <label
                    key={opt.value}
                    htmlFor={`role-${opt.value.toLowerCase()}`}
                    className="cursor-pointer rounded-lg border border-gray-300 p-3 text-sm hover:bg-gray-50 has-checked:border-blue-600 has-checked:bg-blue-50 has-checked:ring-2 has-checked:ring-blue-200 has-focus-visible:ring-2 has-focus-visible:ring-blue-400"
                  >
                    <input
                      id={`role-${opt.value.toLowerCase()}`}
                      type="radio"
                      value={opt.value}
                      defaultChecked={opt.value === 'CUSTOMER'}
                      className="sr-only"
                      {...register('role')}
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
              <p className="label text-xs text-red-600">
                {errors?.role?.message}
              </p>
            </fieldset>

            <div>
              <span className={labelClass}>Foto Profil (opsional)</span>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 sm:h-20 sm:w-20">
                  ?
                </div>
                <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-blue-400">
                  Pilih foto
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="sr-only"
                    {...register('profilePictureUrl')}
                  />
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Maksimal 5 MB (JPG/PNG/WEBP).
              </p>
              <p className="label text-xs text-red-600">
                {errors?.profilePictureUrl?.message}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <input
                  id="username"
                  placeholder="budisantoso"
                  autoComplete="username"
                  className={inputClass}
                  {...register('username')}
                />
                <p className="label text-xs text-red-600">
                  {errors?.username?.message}
                </p>
              </div>

              <div>
                <label htmlFor="name" className={labelClass}>
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  placeholder="Budi Santoso"
                  autoComplete="name"
                  className={inputClass}
                  {...register('name')}
                />
                <p className="label text-xs text-red-600">
                  {errors?.name?.message}
                </p>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className={inputClass}
                  {...register('email')}
                />
                <p className="label text-xs text-red-600">
                  {errors?.email?.message}
                </p>
              </div>

              <div>
                <label htmlFor="phoneNumber" className={labelClass}>
                  No. Ponsel
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  placeholder="081234567890"
                  autoComplete="tel"
                  className={inputClass}
                  {...register('phoneNumber')}
                />
                <p className="label text-xs text-red-600">
                  {errors?.phoneNumber?.message}
                </p>
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
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-blue-600 focus-visible:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <p className="label text-xs text-red-600">
                  {errors?.password?.message}
                </p>
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
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-blue-600 focus-visible:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <p className="label text-xs text-red-600">
                  {errors?.confirmPassword?.message}
                </p>
              </div>
            </div>
            <div className="group-has-[#role-organizer:checked]:hidden">
              <label htmlFor="referralCode" className={labelClass}>
                Kode Referral (opsional)
              </label>
              <input
                id="referralCode"
                placeholder="BUDI7K2X"
                className={`${inputClass} uppercase tracking-widest`}
                {...register('referralCode')}
              />
              <p className="mt-1 text-xs text-gray-500">
                Punya kode dari teman? Masukkan untuk mendapat kupon diskon.
              </p>
              <p className="label text-xs text-red-600">
                {errors?.referralCode?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Daftar
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
