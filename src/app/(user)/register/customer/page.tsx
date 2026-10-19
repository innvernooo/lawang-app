'use client';

import { isAxiosError } from 'axios';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import {
  customerRegisterSchema,
  CustomerRegisterInput,
  CustomerRegisterOutput,
} from '@/features/register/validation/customerSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import PopoverFailed from '@/features/register/components/popoverFailed';
import PopoverSuccess from '@/features/register/components/popoverSuccess';

// Class TailwindCSS
const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

export default function CustomerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const successRef = useRef<HTMLDialogElement>(null);
  const failedRef = useRef<HTMLDialogElement>(null);
  const [failedMessage, setFailedMessgae] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomerRegisterInput, unknown, CustomerRegisterOutput>({
    resolver: zodResolver(customerRegisterSchema),
  });

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

  const handleCustomerRegister = useMutation({
    mutationFn: async (data: CustomerRegisterOutput) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.nik) formData.append('nik', data.nik);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.referralCode) formData.append('referralCode', data.referralCode);
      if (data.profilePicture?.length)
        formData.append('profilePicture', data.profilePicture[0]);

      const res = await axiosInstance.post('/customers/register', formData);
      return res?.data;
    },
    onSuccess: () => {
      successRef?.current?.showModal();
      reset();
    },
    onError: (error) => {
      setFailedMessgae(
        isAxiosError(error)
          ? (error?.response?.data?.message ??
              'Tidak dapat terhubung ke server')
          : 'Terjadi kesalahan',
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
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-8 md:max-w-2xl">
          <form
            noValidate
            onSubmit={handleSubmit((data) =>
              handleCustomerRegister.mutate(data),
            )}
          >
            <div>
              <span className={labelClass}>Foto Profil (opsional)</span>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500 sm:h-20 sm:w-20">
                  {previewPicture ? (
                    <img
                      src={previewPicture}
                      alt="Foto Profil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    '?'
                  )}
                </div>
                <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-blue-400">
                  Pilih foto
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
              <p className="label text-xs text-red-600">
                {errors?.profilePicture?.message}
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
            <div className="mt-4">
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
            <div className="mt-4">
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
            <div className="mt-4">
              <label htmlFor="nik" className={labelClass}>
                NIK
              </label>
              <input
                id="nik"
                type="text"
                inputMode="numeric"
                maxLength={16}
                placeholder="3171234567890001"
                autoComplete="off"
                className={inputClass}
                {...register('nik')}
              />
              <p className="label text-xs text-red-600">
                {errors?.nik?.message}
              </p>
            </div>
            <div className="mt-4">
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
            <div className="mt-4">
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
                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-blue-600 focus-visible:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
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
                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-blue-600 focus-visible:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <p className="label text-xs text-red-600">
                {errors?.confirmPassword?.message}
              </p>
            </div>
            <div>
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
              disabled={handleCustomerRegister.isPending}
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
